#!/usr/bin/env python3
"""
fetch_sheets.py — Google SheetsをOAuth認証で取得してCSVに保存する
"""

import gspread
from pathlib import Path
import csv

BASE_DIR = Path("/Users/dz0019/Desktop/claude_management")
OAUTH_FILE = BASE_DIR / "credentials/oauth_client.json"
TOKEN_FILE = BASE_DIR / "credentials/oauth_token.json"
OUTPUT_DIR = BASE_DIR / "03_projects/asset_management"

SHEETS = {
    "素材マスター台帳": {
        "spreadsheet_id": "14LmTleX3lJG4YCUB4834--4kZaPDjCkonl_nAZqxJCo",
        "gid": "1957172816",
        "output_file": "素材マスター台帳.csv",
    },
}


def get_client():
    return gspread.oauth(
        credentials_filename=str(OAUTH_FILE),
        authorized_user_filename=str(TOKEN_FILE),
    )


def fetch_sheet(client, config: dict, output_file: Path):
    sh = client.open_by_key(config["spreadsheet_id"])

    worksheet = None
    for ws in sh.worksheets():
        if str(ws.id) == config["gid"]:
            worksheet = ws
            break
    if worksheet is None:
        worksheet = sh.get_worksheet(0)

    rows = worksheet.get_all_values()
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with output_file.open("w", encoding="utf-8", newline="") as f:
        csv.writer(f).writerows(rows)

    print(f"[完了] {output_file.name} ({len(rows)-1} 行取得)")
    return rows


def main():
    print("[認証中] Googleアカウントで認証します...")
    client = get_client()
    print("[認証完了]")

    for name, config in SHEETS.items():
        print(f"[取得中] {name} ...")
        rows = fetch_sheet(client, config, OUTPUT_DIR / config["output_file"])
        if rows:
            print(f"  ヘッダー: {rows[0]}")


if __name__ == "__main__":
    main()
