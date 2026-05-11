#!/usr/bin/env python3
"""
rec_pipeline.py — 録音/録画ファイル自動処理パイプライン

_rec/ フォルダを監視 → 新規ファイルを検出
  - 音声/動画ファイル → whisper.cpp (Metal GPU) で文字起こし
  - テキストファイル(.txt) → そのまま文字起こしとして使用
→ 議事録・示唆・タスク生成（claude CLI）→ ファイル保存 → DAILY.md 更新
"""

import os
import json
import sys
import re
import subprocess
import tempfile
from pathlib import Path
from datetime import datetime

# ── パス設定 ──────────────────────────────────────────────
REC_DIR = Path(
    "/Users/dz0019/Library/CloudStorage/"
    "GoogleDrive-mizutani_yuta@ex-sirok.com/マイドライブ/_rec"
)
BASE_DIR = Path("/Users/dz0019/Desktop/claude_management")
STATE_FILE   = BASE_DIR / "00_context/rec_processed.json"
PROJECTS_DIR = BASE_DIR / "03_projects"
MINUTES_DIR  = BASE_DIR / "03_projects/meetings/minutes"
DAILY_FILE   = BASE_DIR / "DAILY.md"
LOG_FILE     = BASE_DIR / "scripts/pipeline.log"

WHISPER_CLI  = BASE_DIR / "scripts/whisper.cpp/build/bin/whisper-cli"
WHISPER_MODEL = BASE_DIR / "scripts/whisper.cpp/models/ggml-large-v3.bin"
FFMPEG       = "/opt/homebrew/bin/ffmpeg"

AUDIO_EXTS = {".m4a", ".mp3", ".wav", ".aac", ".flac", ".mp4", ".mov", ".webm"}
TEXT_EXTS  = {".txt"}  # 文字起こし済みテキストとして処理

# ── プロジェクト名マッピング ────────────────────────────────
PROJECT_KEYWORDS = {
    "monoqrome":  "MONOQROME",
    "モノクローム": "MONOQROME",
    "袴田":        "袴田監督",
    "norganic":   "N_organic",
    "n_organic":  "N_organic",
    "organic":    "N_organic",
    "amana":      "amana",
    "アマナ":      "amana",
    "non_cm":     "NON_CM",
    "noncm":      "NON_CM",
}


# ── ロギング ─────────────────────────────────────────────
def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


# ── 状態管理 ─────────────────────────────────────────────
def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {"processed": []}


def save_state(state: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(
        json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8"
    )


# ── 新規ファイル検出 ─────────────────────────────────────
def get_new_files(state: dict) -> list[Path]:
    if not REC_DIR.exists():
        log(f"[WARN] _rec/ ディレクトリが見つかりません: {REC_DIR}")
        return []
    processed = set(state["processed"])
    all_exts = AUDIO_EXTS | TEXT_EXTS
    files = [
        f for f in REC_DIR.iterdir()  # 直下のみ
        if f.is_file()
        and f.suffix.lower() in all_exts
        and f.name not in processed
    ]
    return sorted(files, key=lambda x: x.stat().st_mtime)


# ── プロジェクト推定 ─────────────────────────────────────
def guess_project(filename: str) -> str:
    name_lower = filename.lower()
    for keyword, project in PROJECT_KEYWORDS.items():
        if keyword in name_lower or keyword in filename:
            return project
    # ファイル名から日付以外の部分をフォルダ名に
    stem = Path(filename).stem
    parts = re.split(r"[\-_\s]", stem)
    label = next((p for p in parts if not re.match(r"^\d+$", p)), "misc")
    return label or "misc"


# ── whisper.cpp で文字起こし（Metal GPU）────────────────────
def transcribe(audio_path: Path) -> str:
    log(f"[Whisper.cpp] 文字起こし開始: {audio_path.name}")

    # m4a/mp4/mov 等は一時WAVに変換（whisper.cppはWAV推奨）
    with tempfile.TemporaryDirectory() as tmp_dir:
        wav_path = Path(tmp_dir) / "audio.wav"
        convert = subprocess.run(
            [FFMPEG, "-y", "-i", str(audio_path),
             "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", str(wav_path)],
            capture_output=True, timeout=120
        )
        if convert.returncode != 0:
            raise RuntimeError(f"ffmpeg変換失敗: {convert.stderr.decode()[:200]}")

        result = subprocess.run(
            [str(WHISPER_CLI), "-m", str(WHISPER_MODEL),
             "-f", str(wav_path), "-l", "ja",
             "--no-timestamps", "--output-txt", "--output-file", str(Path(tmp_dir) / "out")],
            capture_output=True, text=True, timeout=1800,
            env={**os.environ, "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"}
        )
        if result.returncode != 0:
            raise RuntimeError(f"whisper.cpp失敗: {result.stderr[:200]}")

        out_txt = Path(tmp_dir) / "out.txt"
        text = out_txt.read_text(encoding="utf-8").strip() if out_txt.exists() else result.stdout.strip()

    log(f"[Whisper.cpp] 完了: {len(text)} 文字")
    return text


# ── Claude CLI で議事録・示唆・タスク生成（APIクレジット不要）────
def generate_content(transcript: str, filename: str) -> dict:
    import subprocess

    log("[Claude] 議事録・示唆・タスク生成中（claude CLI使用）...")

    prompt = f"""以下は録音/録画ファイル「{filename}」の文字起こし全文です。

<transcript>
{transcript}
</transcript>

【前処理】まず文字起こしに含まれる固有名詞（ブランド名・シリーズ名・商品名・企業名・人名など）を文脈から推測し、正しい表記に変換してください。
例：音声認識の誤りによる「エヌオーガニック」→「N organic」、「モノクローム」→「MONOQROME」など。
変換できたものは議事録全体に反映し、推測が困難なものはそのまま記載してください。

次の3点を生成してください。

## 1. 議事録
- 日時・参加者（文字起こしから推測）
- 議題・主要な議論
- 決定事項・合意内容
- ネクストアクション（担当・期日があれば記載）

## 2. 事業への示唆（メモ）
化粧品の製造販売・EC・小売事業の経営者視点で、
この会議から読み取れる示唆・気づき・リスク・機会を箇条書きで記載。

## 3. タスクリスト（DAILY.md 登録用）
会議で発生したアクション・フォローアップを以下フォーマットで列挙：
- [ ] タスク内容（担当：xxx / 期日：mm/dd）#high|#medium|#low

必ず以下のJSON形式だけで返してください（他のテキスト不要）：
{{
  "minutes": "議事録テキスト（改行は\\nで）",
  "insights": "示唆メモテキスト（改行は\\nで）",
  "tasks": ["- [ ] タスク1 #high", "- [ ] タスク2 #medium"]
}}"""

    # ANTHROPIC_API_KEY を除外して claude.ai 認証を使用（APIクレジット不要）
    env = {k: v for k, v in os.environ.items() if k != "ANTHROPIC_API_KEY"}
    env["PATH"] = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"
    result = subprocess.run(
        ["claude", "--output-format", "text"],
        input=prompt, capture_output=True, text=True, timeout=600,
        env=env
    )
    text = result.stdout.strip()

    if not text:
        log(f"[WARN] claude CLI 出力なし: {result.stderr[:200]}")
        return {"minutes": transcript[:500], "insights": "", "tasks": []}

    # JSON抽出
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    log("[WARN] JSONパース失敗。テキストをそのまま議事録に使用")
    return {"minutes": text, "insights": "", "tasks": []}


# ── ファイル保存 ─────────────────────────────────────────
def save_files(
    transcript: str,
    result: dict,
    filename: str,
) -> tuple[Path, Path]:
    stem = Path(filename).stem
    MINUTES_DIR.mkdir(parents=True, exist_ok=True)

    # 文字起こし（main()で既に保存済みの場合はスキップ）
    transcript_path = MINUTES_DIR / f"{stem}_文字起こし.txt"
    if not transcript_path.exists():
        transcript_path.write_text(transcript, encoding="utf-8")

    # 議事録（示唆を含む）
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    minutes_content = f"""# 議事録：{stem}
生成日時：{now_str}
---

{result['minutes']}

---

## 事業への示唆

{result['insights']}
"""
    minutes_path = MINUTES_DIR / f"{stem}_議事録.txt"
    minutes_path.write_text(minutes_content, encoding="utf-8")

    log(f"[保存] 文字起こし → {transcript_path.relative_to(BASE_DIR)}")
    log(f"[保存] 議事録     → {minutes_path.relative_to(BASE_DIR)}")
    return transcript_path, minutes_path


# ── DAILY.md にタスク追記 ────────────────────────────────
def append_tasks_to_daily(tasks: list[str], filename: str):
    if not tasks:
        return

    today = datetime.now().strftime("%Y-%m-%d")
    daily_content = DAILY_FILE.read_text(encoding="utf-8")

    task_block = (
        f"\n#### 【会議タスク】{filename}\n"
        + "\n".join(tasks)
        + "\n"
    )

    # 今日のセクション内の【計画的に】直前に挿入
    insert_target = "#### 【計画的に】重要だが緊急でない"
    today_section = f"## {today}"

    if today_section in daily_content and insert_target in daily_content:
        # 今日のセクション内にある【計画的に】の直前に挿入
        idx_today = daily_content.index(today_section)
        idx_plan = daily_content.index(insert_target, idx_today)
        daily_content = (
            daily_content[:idx_plan]
            + task_block
            + daily_content[idx_plan:]
        )
    elif today_section in daily_content:
        # セクションが見つからない場合は今日の直後に追加
        daily_content = daily_content.replace(
            today_section, today_section + "\n" + task_block
        )
    else:
        # 今日のセクション自体がない場合は先頭に追加
        daily_content = f"## {today}\n{task_block}\n---\n\n" + daily_content

    DAILY_FILE.write_text(daily_content, encoding="utf-8")
    log(f"[DAILY] タスク {len(tasks)} 件を追記")


# ── メイン ──────────────────────────────────────────────
def main():
    log("=" * 50)
    log("[START] rec_pipeline 起動")

    state = load_state()
    new_files = get_new_files(state)

    if not new_files:
        log("[INFO] 新規ファイルなし。終了。")
        return

    log(f"[INFO] 新規ファイル {len(new_files)} 件を検出")

    for audio_path in new_files:
        log(f"\n[PIPELINE] 処理開始: {audio_path.name}")
        try:
            # 1. 文字起こし（既存ファイルがあればスキップ）
            stem = audio_path.stem
            MINUTES_DIR.mkdir(parents=True, exist_ok=True)
            transcript_path = MINUTES_DIR / f"{stem}_文字起こし.txt"

            if transcript_path.exists():
                transcript = transcript_path.read_text(encoding="utf-8")
                log(f"[Whisper] スキップ（既存ファイル使用）: {transcript_path.name}")
            elif audio_path.suffix.lower() in TEXT_EXTS:
                # .txt ファイルは文字起こし済みテキストとして直接使用
                transcript = audio_path.read_text(encoding="utf-8").strip()
                log(f"[TEXT] テキストファイルを直接使用: {audio_path.name} ({len(transcript)} 文字)")
                transcript_path.write_text(transcript, encoding="utf-8")
                log(f"[保存] 文字起こし → {transcript_path.relative_to(BASE_DIR)}")
            else:
                transcript = transcribe(audio_path)
                # 文字起こしを即座に保存（失敗時の再処理防止）
                transcript_path.write_text(transcript, encoding="utf-8")
                log(f"[保存] 文字起こし → {transcript_path.relative_to(BASE_DIR)}")

            # 2. 議事録・示唆・タスク生成
            result = generate_content(transcript, audio_path.name)

            # 3. ファイル保存
            save_files(transcript, result, audio_path.name)

            # 4. DAILY.md にタスク登録
            append_tasks_to_daily(result.get("tasks", []), audio_path.name)

            # 5. 処理済みとしてマーク
            state["processed"].append(audio_path.name)
            save_state(state)

            log(f"[完了] {audio_path.name} → meetings/minutes/")

        except Exception as e:
            log(f"[ERROR] {audio_path.name}: {e}")
            import traceback
            traceback.print_exc()
            # 処理済みにはしない（次回リトライ）

    log("[END] rec_pipeline 終了")


if __name__ == "__main__":
    main()
