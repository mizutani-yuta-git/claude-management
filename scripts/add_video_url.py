#!/usr/bin/env python3
"""
競合映像URL追加スクリプト
YouTube URL → yt_dlp でメタデータ取得 → CSV追記 → ギャラリーリビルド

使い方:
  python3 scripts/add_video_url.py <URL> [--brand ブランド名] [--category カテゴリー] [--dry-run]

例:
  python3 scripts/add_video_url.py https://www.youtube.com/watch?v=XXXX
  python3 scripts/add_video_url.py https://www.youtube.com/watch?v=XXXX --brand KATE --category マス系
"""

import argparse
import csv
import subprocess
import sys
from pathlib import Path

try:
    import yt_dlp
    HAS_YT_DLP = True
except ImportError:
    HAS_YT_DLP = False

REPO_ROOT = Path(__file__).parent.parent
VIDEO_CSV = REPO_ROOT / "output/trends/competitive-video-master.csv"
BUILD_SCRIPT = REPO_ROOT / "scripts/build_creative_gallery.py"

YOUTUBE_HOSTS = ("youtube.com", "youtu.be", "www.youtube.com")
TIKTOK_HOSTS = ("tiktok.com", "www.tiktok.com", "vm.tiktok.com")


def fetch_yt_metadata(url: str) -> dict:
    opts = {"quiet": True, "no_warnings": True, "skip_download": True}
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
    raw_date = info.get("upload_date", "")  # "20260621"
    if len(raw_date) == 8:
        date = f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:]}"
    else:
        date = ""
    duration_sec = info.get("duration") or 0
    if duration_sec >= 60:
        duration_str = f"{duration_sec // 60}分{duration_sec % 60}秒" if duration_sec % 60 else f"{duration_sec // 60}分"
    else:
        duration_str = f"{duration_sec}秒"
    return {
        "date": date,
        "title": info.get("title", ""),
        "channel": info.get("channel", ""),
        "duration": duration_str,
    }


def load_existing_urls() -> set:
    if not VIDEO_CSV.exists():
        return set()
    with open(VIDEO_CSV, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return {row.get("URL", "").strip() for row in reader if row.get("URL", "").strip()}


def append_row(row: dict, dry_run: bool = False):
    fieldnames = ["調査日", "ブランド", "カテゴリー", "プラットフォーム", "URL",
                  "尺", "フォーマット", "映像表現手法", "BGM_音楽", "キャスト", "トレンドタグ"]
    line = ",".join(row.get(f, "") for f in fieldnames)
    if dry_run:
        print(f"\n[dry-run] 追記予定行:\n{line}\n")
        return
    with open(VIDEO_CSV, "a", encoding="utf-8") as f:
        f.write(line + "\n")
    print(f"[追記済み] {line}")


def rebuild_gallery():
    result = subprocess.run(
        [sys.executable, str(BUILD_SCRIPT)],
        capture_output=True, text=True, cwd=REPO_ROOT
    )
    if result.returncode == 0:
        for line in result.stdout.strip().splitlines():
            print(f"[gallery] {line}")
    else:
        print(f"[warn] ギャラリーリビルドエラー: {result.stderr.strip()}")


def main():
    parser = argparse.ArgumentParser(description="競合映像URLをDBに追加する")
    parser.add_argument("url", help="追加する動画URL")
    parser.add_argument("--brand", default="", help="ブランド名")
    parser.add_argument("--category", default="", help="カテゴリー（例: マス系、スキンケア）")
    parser.add_argument("--format", default="", dest="fmt", help="フォーマット（例: TVCM、ブランドムービー）")
    parser.add_argument("--technique", default="", help="映像表現手法")
    parser.add_argument("--cast", default="", help="キャスト")
    parser.add_argument("--tags", default="", help="トレンドタグ（スペース区切り）")
    parser.add_argument("--no-rebuild", action="store_true", help="ギャラリーリビルドをスキップ")
    parser.add_argument("--dry-run", action="store_true", help="追記せず内容だけ確認")
    args = parser.parse_args()

    url = args.url.strip()

    # 重複チェック
    existing = load_existing_urls()
    if url in existing:
        print(f"[skip] 既にDBに存在します: {url}")
        sys.exit(0)

    # メタデータ取得
    from urllib.parse import urlparse
    host = urlparse(url).hostname or ""
    is_youtube = any(h in host for h in YOUTUBE_HOSTS)
    is_tiktok = any(h in host for h in TIKTOK_HOSTS)

    meta = {"date": "", "title": "", "channel": "", "duration": ""}
    if (is_youtube or is_tiktok) and HAS_YT_DLP:
        print(f"[yt_dlp] メタデータ取得中...")
        try:
            meta = fetch_yt_metadata(url)
        except Exception as e:
            print(f"[warn] yt_dlp失敗: {e}")
    else:
        print("[warn] YouTube/TikTok以外のURLです。日付・尺は手動で確認してください。")

    print(f"\n取得メタデータ:")
    print(f"  公開日: {meta['date'] or '(取得失敗)'}")
    print(f"  タイトル: {meta['title']}")
    print(f"  チャンネル: {meta['channel']}")
    print(f"  尺: {meta['duration']}")

    platform = "YouTube" if is_youtube else ("TikTok" if is_tiktok else "")

    row = {
        "調査日": meta["date"],
        "ブランド": args.brand or meta.get("channel", ""),
        "カテゴリー": args.category,
        "プラットフォーム": platform,
        "URL": url,
        "尺": meta["duration"],
        "フォーマット": args.fmt,
        "映像表現手法": args.technique,
        "BGM_音楽": "",
        "キャスト": args.cast,
        "トレンドタグ": args.tags,
    }

    append_row(row, dry_run=args.dry_run)

    if not args.dry_run and not args.no_rebuild:
        rebuild_gallery()


if __name__ == "__main__":
    main()