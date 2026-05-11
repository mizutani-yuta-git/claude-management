#!/bin/bash
# N organic のん リール編集スクリプト
# 対象: 0324making_interview_check.mp4 → 60秒 9:16 縦型リール

SRC="/Users/dz0019/Library/CloudStorage/GoogleDrive-mizutani_yuta@ex-sirok.com/マイドライブ/_Mizutani_Gdrive/SミルクCM/PR/0324making_interview_check.mp4"
TMPDIR="/tmp/reels_segs"
OUT="/Users/dz0019/Library/CloudStorage/GoogleDrive-mizutani_yuta@ex-sirok.com/マイドライブ/_Mizutani_Gdrive/SミルクCM/PR/0324reels_60s.mp4"

mkdir -p "$TMPDIR"

# ─── 縦型変換フィルター（ぼかし背景付き 1080x1920） ───
V_FILTER='[0:v]split=2[bg][fg];
[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:5[blurred];
[fg]scale=1080:-1[sharp];
[blurred][sharp]overlay=(W-w)/2:(H-h)/2[v]'

# ─── セグメント切り出し & 縦型変換 ───
# Seg1: Making モニター（フック）
ffmpeg -ss 0 -i "$SRC" -t 4 \
  -filter_complex "$V_FILTER" -map '[v]' -map 0:a \
  -c:v libx264 -preset fast -crf 18 -c:a aac -ar 48000 \
  "$TMPDIR/seg1.mp4" -y -loglevel error

# Seg2: Interview「すごくかっこいい映像で / 赤ツボクサの力強さ」
ffmpeg -ss 25 -i "$SRC" -t 17 \
  -filter_complex "$V_FILTER" -map '[v]' -map 0:a \
  -c:v libx264 -preset fast -crf 18 -c:a aac -ar 48000 \
  "$TMPDIR/seg2.mp4" -y -loglevel error

# Seg3: Making 夕焼けセット撮影
ffmpeg -ss 62 -i "$SRC" -t 10 \
  -filter_complex "$V_FILTER" -map '[v]' -map 0:a \
  -c:v libx264 -preset fast -crf 18 -c:a aac -ar 48000 \
  "$TMPDIR/seg3.mp4" -y -loglevel error

# Seg4: Interview「すっごいいい香りですよね」
ffmpeg -ss 240 -i "$SRC" -t 13 \
  -filter_complex "$V_FILTER" -map '[v]' -map 0:a \
  -c:v libx264 -preset fast -crf 18 -c:a aac -ar 48000 \
  "$TMPDIR/seg4.mp4" -y -loglevel error

# Seg5: Interview「ハマりました」笑顔
ffmpeg -ss 422 -i "$SRC" -t 12 \
  -filter_complex "$V_FILTER" -map '[v]' -map 0:a \
  -c:v libx264 -preset fast -crf 18 -c:a aac -ar 48000 \
  "$TMPDIR/seg5.mp4" -y -loglevel error

# Seg6: Making 赤ドレス撮影シーン
ffmpeg -ss 442 -i "$SRC" -t 10 \
  -filter_complex "$V_FILTER" -map '[v]' -map 0:a \
  -c:v libx264 -preset fast -crf 18 -c:a aac -ar 48000 \
  "$TMPDIR/seg6.mp4" -y -loglevel error

# ─── 連結リスト生成 ───
cat > "$TMPDIR/concat.txt" << EOF
file '$TMPDIR/seg1.mp4'
file '$TMPDIR/seg2.mp4'
file '$TMPDIR/seg3.mp4'
file '$TMPDIR/seg4.mp4'
file '$TMPDIR/seg5.mp4'
file '$TMPDIR/seg6.mp4'
EOF

# ─── 連結 → 最終出力 ───
ffmpeg -f concat -safe 0 -i "$TMPDIR/concat.txt" \
  -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUT" -y -loglevel error

echo "完了: $OUT"
