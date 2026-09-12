---
name: n-organic-monthly-monitor
description: N organic（または同等の自然派・オーガニックコスメブランド）向けの月次戦略市場モニタリングレポートを、Tier 1コンサルファーム品質のPowerPointデッキとして作成する。公開情報（Layer 1）と社内KPI（Layer 2）の2層構造で分析。「月次レポート作成」「市場モニタリング」「N organic レポート」「ブランド戦略レポート」「市場分析PPT」「コンサル品質のデッキ」などのキーワード、または "Our Thesis"、"Uncomfortable Truths"、"ポストダーマコスメ" といった戦略フレームに関する依頼が出たら必ず使用する。
---

# N organic 月次戦略市場モニタリング・スキル（2層構造版）

## このスキルが提供するもの

Tier 1コンサルファーム（McKinsey / BCG / Bain 水準）の月次市場・競合モニタリングレポート（PowerPoint 26スライド）を2層構造で生成する。

**2層構造が核心：**
- **Layer 1（外部視点）** — 競合・市場・消費者が見ているN organicの姿。公開情報のみ。コンサルとしての客観性を担保する
- **Layer 2（内部較正）** — 内部KPIと外部分析のGAP分析。「市場が見えていないリスク」と「社内が気づいていない変化」を交差させる。社内版（INTERNAL）にのみ収録

必須5要素：
- **Our Thesis** — コンサルとしての逆張り仮説
- **3つの不都合な事実** — 外部×内部KPIの交差から導く定量指摘
- **3つの意思決定論点** — Pro/Con＋「YES/NO/条件付き」推奨
- **5つの Uncomfortable Truths** — クライアントが嫌がる指摘を独立章化
- **検証可能な先行指標** — 仮説の検証方法を明示

## ユーザーコンテクスト

CyberAgent/Sirok 子会社で N organic ブランドを担当する水谷 祐太さんの月次レポート発行サイクルに最適化。N organic（Basic / Vie / Bright / Plenum 4シリーズ / 約350万会員）、競合構造（Anua 100億円脅威、ダーマコスメ大手参入）を前提に組み立てる。

## 環境セットアップ（初回 or クリーン環境）

```bash
# リポジトリルートで実行
cd /path/to/claude_management   # CCRでは /repo など

# Node.js 依存 (pptxgenjs)
npm install

# Python 依存
pip install matplotlib

# Linux/CCR: 日本語フォントインストール（未インストール時のみ）
apt-get install -y fonts-noto-cjk 2>/dev/null || true
python3 -c "import matplotlib.font_manager; matplotlib.font_manager._load_fontmanager(try_read_cache=False)"
```

macOS では Hiragino Sans が OS 標準搭載のためフォントインストール不要。スクリプトが自動検出する。

## ワークフロー（6段階）

各段階で完了条件を満たすまで次に進まない。

---

### 段階1：Layer 1リサーチ（公開情報のみ）

**Layer 1では内部KPIを一切使わない。** コンサルとしての客観性を担保するため公開情報のみ。

web_search で**最低5〜10回検索**。トラッキング必須項目：

| 検索テーマ | 何を確認するか |
|-----------|--------------|
| 自然派市場規模 | 矢野経済/富士経済の最新値（前号からの更新確認） |
| ダーマコスメ市場 | IMARC/TBRC の最新CAGR数値 |
| Anua 最新動向 | プレスリリース・@cosme受賞・Qoo10ランキング |
| 競合新製品 | 第一三共ブライトエイジ・COSRX・Medipeel等 |
| N organic公開情報 | シロク社プレスリリース・新製品・受賞 |
| @cosme トレンド | 最新ベストコスメ・次期トレンド予測 |
| SNS/チャネル動向 | TikTok美容・Qoo10メガ割・Meta広告 |

詳細ソース一覧: `references/data-sources.md`

**完了条件：** 競合・市場・消費者の3視点でN organicの外部環境が把握できていること。

---

### 段階2：Layer 2リサーチ（内部KPI — Google Drive）

Google Drive MCP で経営会議議事録を取得する。

```
フォルダID: 1YXld4VQr5aIT8eaOv5Ry35wyGPrhCcMX
取得方法: mcp__claude_ai_Google_Drive__search_files + read_file_content
取得対象: 当月分・前月分の最新2〜3件
```

議事録から以下KPIを抽出・整理する：

**#tokyo セクション（N organic 東京）:**
- 月次PL：売上着予・目標・達成率、営利着予・目標
- チャネル別：マーケ / CRM / 直営店 / PF / オフライン 各着予と目標比
- トライアルKPI：CV数・CPA・定期UU・引き上げ率
- AF：CV件数・引き上げ率・UU-CPA
- 検索数：指名全体・指名単体（前月比）

**#Kyoto セクション（N organic Kyoto製品）:**
- 製品別：Sミルク・Sクレ・各製品の本数・売上・着予・昨対
- チャネル別：EC・楽天・Amazon・リテール・直営店
- 新製品：発売直後の初速データ

**整理フォーマット：**
```
【内部KPI整理：YYYY年MM月号】
■ PL全体
  売上着予: X.XX億 / 目標: X.XX億 / 達成率: XX%
  営利着予: X.XX億 / 目標: X.XX億
■ 獲得KPI（前月比）
  トライアルCPA: ¥XX,XXX（前月比 ±X,XXX）
  定期UU: XX,XXX人（目標比 XX%）
  AF引き上げ率: XX%（目標 XX%）
■ 主要製品（前月比）
  Sミルク: XX億（昨対 XXX%）
  Sクレ: XX億（昨対 XXX%）
  Kyoto製品: XX億（目標比 XX%）
■ 外部との乖離仮説
  （Layer 1で把握した市場動向とのGAP仮説を1〜3行で）
```

**注意：このデータはLayer 2専用。Layer 1（外部分析）に混入させない。社外秘。**

**完了条件：** 上記整理表が完成し、外部分析との乖離仮説が立てられていること。

---

### 段階3：Our Thesis の策定

Layer 1（外部）× Layer 2（内部）の交差から、Tier 1品質の論点を生成する。

1. **Our Thesis（中核仮説）** を1文で書く
   - 「市場が変化している方向」と「社内KPIが示す現在地」のGAPが最も大きい点を賭けにする
   - 例（Issue 04）：「Sミルク単品の超達成（目標+11%）は、N organicの戦略的勝利ではなく警戒すべきシグナルだ。指名検索は2ヶ月連続で逓減（-12.4%）しており、カテゴリー需要に乗っているに過ぎない。」

2. **3つの不都合な事実** — 外部データ×内部KPIを必ず1つずつ紐づける

3. **3つの意思決定論点** — Pro/Con + YES/NO/条件付き推奨

4. **5つの Uncomfortable Truths** — 議事録の不都合な共有事項を参考に

品質ガイド: `references/tier1-quality-criteria.md`

**完了条件：** Our Thesis + 3不都合な事実 + 3意思決定論点 + 5 Uncomfortable Truths が言語化されていること。

---

### 段階4：チャート生成（必須4点）

#### 出力先ディレクトリを決める

```bash
# Issue番号と月を決める（例: 7月号 = Issue 05）
ISSUE="05"
YEAR_MONTH="2026-07"
OUTPUT_DIR="output/n-organic-${YEAR_MONTH}"
mkdir -p "${OUTPUT_DIR}"
```

#### generate_charts.py の GAP_DATA を更新する

`skills/n-organic-monthly-monitor/scripts/generate_charts.py` の `GAP_DATA` セクションを当月の内部KPIで差し替える。

更新箇所（スクリプト末尾付近のコメント「★ 毎月更新する箇所 ★」で印されている）：
- `"internal_actual"`: 当月の実績値（目標比%）
- `"gap_notes"`: 各指標に対する1行解釈

#### チャートを生成する

```bash
# カレントディレクトリ = リポジトリルート で実行
python3 skills/n-organic-monthly-monitor/scripts/generate_charts.py "${OUTPUT_DIR}"

# 生成確認
ls -lh "${OUTPUT_DIR}"/chart*.png
```

**4つのチャート：**
1. `chart1_market_growth.png` — 市場成長率比較（Layer 1公開）
2. `chart2_competitive_map.png` — 競合ポジショニング（Layer 1公開）
3. `chart3_strategic_thesis.png` — ポストダーマ戦略フレームワーク（Layer 1公開）
4. `chart4_gap_dashboard.png` — 外部×内部GAP（**Layer 2専用・外部版に含めない**）

**完了条件：** 4ファイルが OUTPUT_DIR に生成されていること。

---

### 段階5：デッキ生成（26スライド）

スライド構造仕様: `references/deck-structure.md`
参照実装（Issue 04）: `output/n-organic-june-2026/generate_deck_issue04.js`

#### generate_deck_current.js を書く

`skills/n-organic-monthly-monitor/scripts/generate_deck_current.js` として新しいスクリプトを作成する。

Issue 04の実装（`output/n-organic-june-2026/generate_deck_issue04.js`）をベースに以下を更新：

| 更新箇所 | 内容 |
|---------|------|
| `ISSUE` | 当月号番号（例: `"05"`） |
| `MONTH_JP` | 日本語月（例: `"7月号"`） |
| `MONTH_EN` | 英語月（例: `"July 2026"`） |
| 発行日 | `2026年7月15日` 等 |
| `OUTPUT_DIR` | `path.resolve(__dirname, '../../../', OUTPUT_DIR)` 等 |
| `CHART_DIR` | チャートの絶対パス |
| Our Thesis テキスト | 当月版 |
| 3つの不都合な事実 | 当月版 |
| 3つの意思決定 | Pro/Con + 推奨を当月版に |
| 5 Uncomfortable Truths | 当月版 |
| Layer 2 KPI数値 | 当月の内部実績値 |
| リスクマトリクス | 前号→本号の変化を更新 |
| 次号予告 | 当月から見た来月の論点 |
| データソース一覧 | 今号参照した公開ソースをリスト |

#### デッキを生成する

```bash
node skills/n-organic-monthly-monitor/scripts/generate_deck_current.js

# 出力確認
ls -lh "${OUTPUT_DIR}"/*.pptx
# 期待: INTERNAL版（〜1.5MB）と EXTERNAL版（〜1.2MB）の2ファイル
```

**出力ファイル命名規則：**
- `N_organic_戦略市場モニタリング_2026年7月号_Tier1_INTERNAL.pptx`
- `N_organic_戦略市場モニタリング_2026年7月号_Tier1_EXTERNAL.pptx`

**スライド構成（26枚）：**
```
[Part 1: 外部市場 Layer 1]
1.  Cover
2.  Executive Summary（Our Thesis + 3不都合な事実 + 3意思決定の概要）
3.  Part 1 ディバイダー「市場の構造的劣後」
4.  市場成長率比較（図表1）
5.  消費者意識の構造変化（エビデンス化圧力）
6.  Part 2 ディバイダー「最大の脅威はAnuaである」
7.  Anua 100億円 ビッグスタッツ
8.  競合ポジショニング・マップ（図表2）
9.  Anua vs 大手 5軸比較表

[Part 2: 内部較正 Layer 2 — CONFIDENTIAL]
10. Part 3 ディバイダー「内部現実との照合」（INTERNAL版のみ実コンテンツ）
11. 外部×内部 GAPダッシュボード（図表4）
12. KPI前号比較：定期UU / CPA / AF引き上げ率
13. チャネル別製品KPIウォーターフォール

[Part 3: Our Thesis]
14. Part 4 ディバイダー「Our Thesis + ポストダーマ戦略」
15. Our Thesis ステートメント
16. ポストダーマコスメ戦略フレームワーク（図表3）
17. 「二重投資」の構造
18. 検証3指標（A/B/C）

[Part 4: 意思決定]
19. Part 5 ディバイダー「3つの意思決定」
20. 意思決定① Pro/Con + 推奨
21. 意思決定② Pro/Con + 推奨
22. 意思決定③ Pro/Con + 推奨

[Part 5: Uncomfortable Truths]
23. Part 6 ディバイダー
24. 5つの Uncomfortable Truths
25. リスクマトリクス + 次月モニタリング指標 + 次号予告
26. 付録（データソース一覧）
```

**Layer 2スライドの扱い：**
- スライド10〜13：INTERNAL版 = 実コンテンツ + `CONFIDENTIAL — INTERNAL USE ONLY` ヘッダー
- スライド10〜13：EXTERNAL版 = 「本セクションは内部資料のため非掲載」プレースホルダー

**完了条件：** INTERNAL版26枚・EXTERNAL版26枚が OUTPUT_DIR に生成されていること。

---

### 段階6：QAと検証

```bash
# python-pptxでスライド枚数確認（簡易チェック）
python3 -c "
from pptx import Presentation
for f in ['INTERNAL', 'EXTERNAL']:
    p = Presentation('${OUTPUT_DIR}/N_organic_戦略市場モニタリング_2026年XX月号_Tier1_${f}.pptx')
    print(f'{f}: {len(p.slides)} slides')
"

# スライドタイトル一覧
python3 -c "
from pptx import Presentation
p = Presentation('${OUTPUT_DIR}/N_organic_戦略市場モニタリング_2026年XX月号_Tier1_INTERNAL.pptx')
for i, s in enumerate(p.slides, 1):
    texts = [sh.text.strip()[:60] for sh in s.shapes if hasattr(sh, 'text') and sh.text.strip()]
    label = texts[1] if len(texts) > 1 else (texts[0] if texts else '(empty)')
    print(f'Slide {i:02d}: {label}')
"
```

チェックポイント：
- [ ] INTERNAL版 26スライド、EXTERNAL版 26スライドであること
- [ ] スライド10〜13のINTERNAL版に `CONFIDENTIAL` ヘッダーが入っていること
- [ ] スライド10〜13のEXTERNAL版が非掲載プレースホルダーになっていること
- [ ] チャート画像（chart1〜4）が正しく埋め込まれていること
- [ ] 全テキストが日本語で正常表示されていること（豆腐になっていないか）
- [ ] Issue番号・月号・発行日が当月に更新されていること

**完了後：** git commit してリポジトリに保存する

```bash
git add "${OUTPUT_DIR}/" skills/n-organic-monthly-monitor/scripts/
git commit -m "N organic 戦略市場モニタリング ${YEAR_MONTH}号 Issue ${ISSUE} 生成完了"
```

---

## 出力ファイル

```
output/n-organic-YYYY-MM/
├── chart1_market_growth.png
├── chart2_competitive_map.png
├── chart3_strategic_thesis.png
├── chart4_gap_dashboard.png           ← CONFIDENTIAL (Layer 2専用)
├── N_organic_戦略市場モニタリング_YYYY年MM月号_Tier1_INTERNAL.pptx
├── N_organic_戦略市場モニタリング_YYYY年MM月号_Tier1_EXTERNAL.pptx
└── generate_deck_issueXX.js           ← 当月スクリプト（参照用）
```

---

## 月次更新時の差分管理

**毎月同じ論点を繰り返すレポートはTier 2に落ちる。** 必ず更新：

**Layer 1の差分：**
- 市場データの最新値（前号からの変動）
- 競合の最新動向（プレスリリース、ローンチ、SNS指標）
- リスクマトリクスの「前号評価 → 本号評価」変化欄
- 先行指標A/B/Cの実績更新（前号で設定した指標の答え合わせ）

**Layer 2の差分：**
- `generate_charts.py` の `GAP_DATA` を当月KPIで更新
- KPI前号比較スライドの数値を更新
- Our Thesis を当月の「外部×内部の最大GAP」から再策定

---

## トラブルシューティング

| 問題 | 対処 |
|------|------|
| 日本語が豆腐になる（Linux/CCR） | `apt-get install -y fonts-noto-cjk` の後 font cache をクリア |
| 日本語が豆腐になる（macOS） | `Hiragino Sans` がOS標準。自動検出失敗時は `plt.rcParams['font.family'] = 'Hiragino Sans'` を手動設定 |
| pptxgenjs not found | `npm install` をリポジトリルートで実行 |
| matplotlib not found | `pip install matplotlib` |
| Google Drive 議事録が取得できない | フォルダID `1YXld4VQr5aIT8eaOv5Ry35wyGPrhCcMX` を再確認。MCP認証の再確認 |
| チャートパスエラー | `CHART_DIR` が OUTPUT_DIR と一致しているか確認 |
| PPTX スライド枚数が合わない | generate_deck_current.js の `TOTAL_SLIDES` 定数と実際のスライド数を一致させる |

## 参照実装（実績あり）

- **Issue 03 / 5月号**: `skills/n-organic-monthly-monitor/scripts/generate_deck_template.js`
- **Issue 04 / 6月号**: `output/n-organic-june-2026/generate_deck_issue04.js` — 2層構造・26スライド版の確定実装
  - 生成物: `output/n-organic-june-2026/N_organic_戦略市場モニタリング_2026年6月号_Tier1_INTERNAL.pptx`
  - 生成物: `output/n-organic-june-2026/N_organic_戦略市場モニタリング_2026年6月号_Tier1_EXTERNAL.pptx`