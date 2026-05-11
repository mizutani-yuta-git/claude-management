#!/bin/bash
# run_pipeline.sh — rec_pipeline.py のラッパー
# crontab から呼び出される。環境変数をロードしてパイプラインを起動する。

set -euo pipefail

BASE_DIR="/Users/dz0019/Desktop/claude_management"
ENV_FILE="$BASE_DIR/credentials/.env"
SCRIPT="$BASE_DIR/scripts/rec_pipeline.py"

# 認証情報ロード
if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo "[ERROR] $ENV_FILE が見つかりません。credentials/.env を作成してください。" >&2
    exit 1
fi

# Python パスを確保（cron は PATH が限定的なため）
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:$PATH"

exec /usr/bin/python3 "$SCRIPT"
