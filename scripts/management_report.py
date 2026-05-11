#!/usr/bin/env python3
"""
management_report.py — 経営会議資料の自動要約・Slack DM送信

毎週水曜日 9:00 に自動実行（cron）
対象フォルダの最新PDFを読み取り → Claude CLI で要約＋アクション抽出 → Slack DM送信
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Optional

# ── 設定 ──────────────────────────────────────────────
MGMT_DIR = Path(
    "/Users/dz0019/Library/CloudStorage/"
    "GoogleDrive-mizutani_yuta@sirok.co.jp/マイドライブ/経営資料"
)
BASE_DIR     = Path("/Users/dz0019/Desktop/claude_management")
STATE_FILE   = BASE_DIR / "00_context/mgmt_report_processed.json"
LOG_FILE     = BASE_DIR / "scripts/management_report.log"

REPORT_OUTPUT = BASE_DIR / "00_context/mgmt_report_latest.txt"


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


# ── 最新PDFを取得 ────────────────────────────────────────
def get_latest_pdf(state: dict) -> Optional[Path]:
    if not MGMT_DIR.exists():
        log(f"[WARN] 経営資料フォルダが見つかりません: {MGMT_DIR}")
        return None

    processed = set(state["processed"])
    pdfs = [
        f for f in MGMT_DIR.iterdir()
        if f.is_file() and f.suffix.lower() == ".pdf"
        and f.name not in processed
    ]
    if not pdfs:
        log("[INFO] 未処理のPDFなし")
        return None

    return max(pdfs, key=lambda x: x.stat().st_mtime)


# ── PDFテキスト抽出 ──────────────────────────────────────
def extract_pdf_text(pdf_path: Path) -> str:
    import pdfplumber
    log(f"[PDF] テキスト抽出: {pdf_path.name}")
    text_parts = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
    text = "\n".join(text_parts).strip()
    log(f"[PDF] 抽出完了: {len(text)} 文字")
    return text


# ── Claude CLI で要約・アクション生成 ────────────────────
def generate_summary(text: str, filename: str) -> str:
    log("[Claude] 要約・アクション生成中...")

    prompt = f"""以下は経営会議資料「{filename}」の内容です。

<content>
{text[:8000]}
</content>

化粧品の製造販売・EC・小売事業の経営者として、この資料を読んで以下の2点を簡潔にまとめてください。

## 📋 要約
箇条書きで5〜8点、重要なトピック・数値・決定事項を整理する。

## ✅ 取るべきアクション
この資料を踏まえて自分が動くべきこと・確認すべき点を箇条書きで3〜5点。
※このアクションはDAILY.mdや工程表には追加しないこと。Slackへの送信のみ。

Slack DM用に読みやすいテキストで返してください（マークダウン可）。"""

    env = {k: v for k, v in os.environ.items() if k != "ANTHROPIC_API_KEY"}
    env["PATH"] = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"

    result = subprocess.run(
        ["claude", "--output-format", "text"],
        input=prompt, capture_output=True, text=True, timeout=300,
        env=env
    )
    output = result.stdout.strip()
    if not output:
        log(f"[WARN] Claude出力なし: {result.stderr[:200]}")
        return "（要約生成に失敗しました）"

    log(f"[Claude] 完了: {len(output)} 文字")
    return output


# ── レポートをファイル保存 ────────────────────────────────
def save_report(message: str, filename: str):
    today = datetime.now().strftime("%Y/%m/%d")
    content = f"*📊 経営会議資料レポート — {today}*\n対象ファイル：{filename}\n\n{message}"
    REPORT_OUTPUT.write_text(content, encoding="utf-8")
    log(f"[保存] レポート → {REPORT_OUTPUT.relative_to(BASE_DIR)}")


# ── メイン ──────────────────────────────────────────────
def main():
    log("=" * 50)
    log("[START] management_report 起動")

    state = load_state()
    pdf_path = get_latest_pdf(state)

    if not pdf_path:
        log("[END] 処理対象なし")
        return

    log(f"[対象] {pdf_path.name}")

    try:
        # 1. PDFテキスト抽出
        text = extract_pdf_text(pdf_path)
        if not text:
            log("[WARN] テキスト抽出結果が空（スキャンPDFの可能性）")
            text = f"（テキスト抽出不可：{pdf_path.name}）"

        # 2. 要約・アクション生成
        summary = generate_summary(text, pdf_path.name)

        # 3. レポートをファイル保存
        save_report(summary, pdf_path.name)

        # 4. 処理済みとしてマーク
        state["processed"].append(pdf_path.name)
        save_state(state)

        log(f"[完了] {pdf_path.name}")

    except Exception as e:
        log(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()

    log("[END] management_report 終了")


if __name__ == "__main__":
    main()
