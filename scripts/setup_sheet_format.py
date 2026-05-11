#!/usr/bin/env python3
"""
setup_sheet_format.py — 素材マスター台帳のカラム順を整理し、ステータスをプルダウンに設定する
"""

import gspread
from pathlib import Path

BASE_DIR = Path("/Users/dz0019/Desktop/claude_management")
OAUTH_FILE = BASE_DIR / "credentials/oauth_client.json"
TOKEN_FILE = BASE_DIR / "credentials/oauth_token.json"

SPREADSHEET_ID = "14LmTleX3lJG4YCUB4834--4kZaPDjCkonl_nAZqxJCo"
GID = 1957172816

NEW_HEADERS = [
    "商品", "目的", "訴求内容", "出し先チャネル", "フォーマット", "露出時期",
    "担当制作者", "承認者", "ステータス", "ラフ", "カンプ", "完成", "素材ID", "素材名", "備考"
]

STATUS_OPTIONS = ["依頼前", "制作中", "確認中", "修正中", "入稿済", "配信中", "終了"]

# 出し先チャネル選択肢（追加するときはここにappend）
CHANNEL_OPTIONS = [
    # オウンド
    "オウンド_公式サイト",
    "オウンド_ティザーサイト",
    "オウンド_直営店",
    # SNS
    "SNS_インスタグラム",
    "SNS_YouTube",
    "SNS_X",
    "SNS_TikTok",
    # リテール
    "リテール_ロフト",
    "リテール_ドラスト",
    # PF
    "PF_Amazon",
    "PF_楽天",
    # 広告
    "広告_Meta",
    "広告_LINE",
    "広告_Google",
    "広告_YouTube",
    "広告_TikTok",
    # CM
    "CM_スポット/タイム",
    "CM_スグリー/ミエルTV",
    # PR
    "PR_PRTIMES",
    "PR_WEB PR",
    "PR_テレビ PR",
]

# 現在のシートの列順（前回実行後の状態）
OLD_HEADERS = [
    "商品", "目的", "訴求内容", "出し先チャネル", "フォーマット", "露出時期",
    "担当制作者", "承認者", "ステータス", "素材ID", "素材名", "備考"
]
COLUMN_MAP = {new: OLD_HEADERS.index(new) for new in NEW_HEADERS if new in OLD_HEADERS}


def reorder_row(old_row):
    return [old_row[COLUMN_MAP[h]] if h in COLUMN_MAP else "" for h in NEW_HEADERS]


def main():
    client = gspread.oauth(
        credentials_filename=str(OAUTH_FILE),
        authorized_user_filename=str(TOKEN_FILE),
    )
    sh = client.open_by_key(SPREADSHEET_ID)
    ws = next(w for w in sh.worksheets() if w.id == GID)

    # 既存データ取得
    rows = ws.get_all_values()
    data_rows = rows[1:] if len(rows) > 1 else []  # ヘッダー除く

    # 列順を組み替え
    new_rows = [NEW_HEADERS] + [reorder_row(r) for r in data_rows]

    # シートをクリアして書き直す
    ws.clear()
    ws.update("A1", new_rows)
    print(f"[完了] 列順を更新しました（{len(data_rows)} 行）")

    # ステータス列（I列 = index 8）にプルダウンを設定
    status_col_index = NEW_HEADERS.index("ステータス")  # 8
    ws.spreadsheet.batch_update({
        "requests": [{
            "setDataValidation": {
                "range": {
                    "sheetId": GID,
                    "startRowIndex": 1,
                    "endRowIndex": 1000,
                    "startColumnIndex": status_col_index,
                    "endColumnIndex": status_col_index + 1,
                },
                "rule": {
                    "condition": {
                        "type": "ONE_OF_LIST",
                        "values": [{"userEnteredValue": v} for v in STATUS_OPTIONS],
                    },
                    "showCustomUi": True,
                    "strict": False,
                }
            }
        }]
    })
    print(f"[完了] ステータス列にプルダウンを設定しました: {STATUS_OPTIONS}")

    # ラフ・カンプ・完成列の行の高さを150pxに設定して画像が見えるようにする
    ws.spreadsheet.batch_update({
        "requests": [{
            "updateDimensionProperties": {
                "range": {
                    "sheetId": GID,
                    "dimension": "ROWS",
                    "startIndex": 1,
                    "endIndex": 1000,
                },
                "properties": {"pixelSize": 150},
                "fields": "pixelSize",
            }
        }]
    })
    print("[完了] 行の高さを150pxに設定しました（画像表示用）")

    # 出し先チャネル列にプルダウンを設定
    channel_col_index = NEW_HEADERS.index("出し先チャネル")
    ws.spreadsheet.batch_update({
        "requests": [{
            "setDataValidation": {
                "range": {
                    "sheetId": GID,
                    "startRowIndex": 1,
                    "endRowIndex": 1000,
                    "startColumnIndex": channel_col_index,
                    "endColumnIndex": channel_col_index + 1,
                },
                "rule": {
                    "condition": {
                        "type": "ONE_OF_LIST",
                        "values": [{"userEnteredValue": v} for v in CHANNEL_OPTIONS],
                    },
                    "showCustomUi": True,
                    "strict": False,
                }
            }
        }]
    })
    print(f"[完了] 出し先チャネル列にプルダウンを設定しました: {CHANNEL_OPTIONS}")

    # 出し先チャネル列の大カテゴリ別に条件付き書式で色分け
    channel_colors = {
        "オウンド_": {"red": 0.745, "green": 0.843, "blue": 0.933},  # 水色
        "SNS_":     {"red": 0.886, "green": 0.812, "blue": 0.953},  # 薄紫
        "リテール_": {"red": 0.776, "green": 0.933, "blue": 0.800},  # 薄緑
        "PF_":      {"red": 1.000, "green": 0.922, "blue": 0.612},  # 薄黄
        "広告_":    {"red": 0.988, "green": 0.894, "blue": 0.839},  # 薄オレンジ
        "CM_":      {"red": 0.988, "green": 0.780, "blue": 0.800},  # 薄赤
        "PR_":      {"red": 0.867, "green": 0.867, "blue": 0.867},  # 薄グレー
    }

    cf_requests = []
    for prefix, color in channel_colors.items():
        cf_requests.append({
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [{
                        "sheetId": GID,
                        "startRowIndex": 1,
                        "endRowIndex": 1000,
                        "startColumnIndex": channel_col_index,
                        "endColumnIndex": channel_col_index + 1,
                    }],
                    "booleanRule": {
                        "condition": {
                            "type": "TEXT_STARTS_WITH",
                            "values": [{"userEnteredValue": prefix}],
                        },
                        "format": {"backgroundColor": color},
                    }
                },
                "index": 0,
            }
        })

    ws.spreadsheet.batch_update({"requests": cf_requests})
    print("[完了] 出し先チャネル列に大カテゴリ別の色分けを設定しました")


if __name__ == "__main__":
    main()
