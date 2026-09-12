# 22スライド構造仕様

このドキュメントは、22枚のスライドそれぞれの目的・レイアウト・必須要素を定義する。前号 Issue 03 で実証済みのテンプレートに基づく。

## 全体レイアウト仕様

- **スライドサイズ：** `LAYOUT_WIDE` (13.33" × 7.5")
- **マージン：** 左右 0.6"、上下 0.35-0.5"
- **フォント：** 見出し Yu Mincho、本文 Yu Gothic
- **基本フォントサイズ：** タイトル 28pt、サブタイトル 13pt、本文 11pt、キャプション 9pt
- **フッター：** y=7.1 に区切り線、y=7.15 に「N organic Strategic Market Monitor | Issue XX | XX 2026」とページ番号

## カラーパレット適用ルール

- **Navy `1F3A6B`** - 主要見出し、ブランド要素、Our Thesis関連
- **Cream `F7F2E8`** - 大型背景、ストーリー領域
- **Crimson `B53F3F`** - 警告・脅威（Anua、不都合な事実、NO推奨）
- **Forest `2F5F47`** - 機会・推奨（YES推奨、Pro側、検証指標C）
- **Gold `9C7B3A`** - プレミアム強調、Anuaスタッツ、検証指標B
- **Shade `EEE7D6`** - カードの背景色

セクションディバイダー（Part 1-6の見出し）は Navy 背景に白文字。Part 5（Uncomfortable Truths）のみ Crimson Dark 背景。

## スライド別仕様

### Slide 1：Cover

**目的：** レポートの所在を明確にする（クライアント名、号番号、発行日）

**必須要素：**
- 左端に Navy 縦バー（x=0, w=0.25）
- 上部に「MONTHLY STRATEGIC MARKET MONITOR」「Issue No. XX / Month YYYY」
- メインタイトル：「N organic」（56pt）+ 副題「戦略市場モニタリング」（36pt）
- 副題：本号のテーマ（例：「『ポストダーマコスメ』戦略仮説とAnua脅威への対応」）
- 下部：提出先、発行日、情報基準、守秘区分の4項目（10pt）

**背景：** Cream

---

### Slide 2：Executive Summary

**目的：** 1ページ完結。経営層がこのページだけ読めば意思決定の方向性が見える。

**必須要素：**
- "Our Thesis"カラウト（Navy左バー、本文13pt太字）
- 「市場の現実 — 3つの不都合な事実」セクション（3カラム横並びカード、各 w=3.87"）
- 「今月の3つの最重要意思決定」表（3カラム：番号 / 論点 / 推奨）

**重要：** 推奨欄では「条件付きNO」「NO」「YES」を色分けして明示（Crimson / Crimson / Forest）

**背景：** 白

---

### Slide 3：Part 1 ディバイダー

**目的：** 「市場の構造的劣後」セクションの導入

**必須要素：**
- "PART 1" ラベル（白文字、charSpacing=8）
- 「第1部　市場の構造的劣後」（44pt）
- Gold アクセントライン（w=3.0）
- リード文（16pt、italic）

**背景：** Navy

---

### Slide 4：市場成長率比較（図表1）

**目的：** N organic主戦場の構造的劣後を視覚化

**レイアウト：** 左60%にチャート、右40%にナラティブ

**チャート：** ネイティブ pptx Bar chart（横棒）。系列は自然派+3.1%、スキンケア全体+3.5%、医薬部外品+8.35%、ダーマコスメ+9.7%。

**右ナラティブ構造：** 「数値が示すこと」（見出し）→ 事実 / 解釈 / 示唆 の3段構成（色分け：Crimson / Navy / Gold）

---

### Slide 5：「成分迷子」消費者意識

**目的：** 第三のポジション需要の顕在化を提示

**レイアウト：** 左に Cream 背景の Big Stat（80% / 110pt Crimson）、右に3ステップ解釈

**重要な座標値（オーバーフロー回避済み）：**
- 左 Cream 箱：y=2.1, h=4.0（前号で h=4.6 から修正）
- 「80%」テキスト：fontSize=110（前号で 120 から修正）
- 右ステップ：spacing=1.05、body h=0.6 × 3行
- 「市場示唆」カラウト：y=6.35, h=0.7

---

### Slide 6：Part 2 ディバイダー

「第2部　最大の脅威はAnuaである」 — Crimson のアクセント色を使う

---

### Slide 7：Anua 100億円 ビッグスタッツ

**目的：** Anua脅威の定量化。本レポート最大のインパクトスライド。

**レイアウト：**
- 上半分：Navy 背景の大型バナー（h=2.0）。左に「100億円」（Gold 80pt）、右に説明文（白）
- 下半分：3カラム横並びカード（ブランド戦略構造 / 受賞・市場評価 / プロモーション速度）、各カードの上端に Crimson アクセントライン

---

### Slide 8：競合ポジショニング・マップ（図表2）

**レイアウト：** 左に chart2_competitive_map.png（生成済み）、右に「読み取れること」3点

**重要：** 戦略的含意のカラウトは y=6.3, h=0.85 で配置。本文は1文に絞る（前号で本文短縮済み）。

---

### Slide 9：Anua vs L'Oréal/資生堂 5軸比較表

**目的：** なぜAnuaが「より危険」かを質的に証明

**レイアウト：** 3カラムpptx表（評価軸 / 大手 / Anua）×5行。Anua列は Crimson 太字でハイライト

**評価軸：** 売上規模、顧客層、成長速度、価値訴求、新製品速度

**下部：** "UNCOMFORTABLE TRUTH" カラウト（Crimson）

---

---

## Layer 2 スライド仕様（Slide 10-13）— CONFIDENTIAL INTERNAL USE ONLY

Layer 2スライドは内部KPIを使用するため、**外部配布資料には含めない**。
スライド10〜13に「CONFIDENTIAL — INTERNAL USE ONLY」のヘッダーテキストを必ず入れる（Crimson 8pt、右上配置）。

### Slide 10：Part 3 ディバイダー「内部現実との照合」

**目的：** 外部分析（Layer 1）から内部KPI較正（Layer 2）セクションへの切り替えを示す

**必須要素：**
- "PART 3" ラベル（白文字、charSpacing=8）
- 「第3部　内部現実との照合」（44pt）
- リード文：「外部市場が描く仮説を、社内KPIで検証する」（16pt、italic）
- 右下に「CONFIDENTIAL — INTERNAL USE ONLY」（Crimson、10pt）

**背景：** Navy

**フッター：** 通常の号番号フッター＋右端に Crimson の「機密」バッジ

---

### Slide 11：外部×内部 GAPダッシュボード（図表4）

**目的：** 「市場が期待する水準」と「社内KPIの現実」の乖離を一目で可視化

**レイアウト：** chart4_gap_dashboard.png をフル幅で配置（w=12.0, h=5.2, x=0.65, y=1.4）

**必須要素：**
- タイトル：「外部×内部 GAPダッシュボード」（28pt）
- サブタイトル：「[月]月実績：市場期待との乖離が大きいKPIを特定」（13pt）
- 右上：「CONFIDENTIAL — INTERNAL USE ONLY」（Crimson 8pt）
- 下部カラウト（Crimson）：「最大のGAPがある項目と、Our Thesisへの接続を1〜2文で記述」

**月次更新ポイント：**
- スクリプトの `GAP_DATA` 辞書を当月議事録の実績値に更新してからチャートを再生成
- 下部カラウトのテキストをGAP分析結果に応じて更新

---

### Slide 12：KPI前号比較 — 3軸トレンド

**目的：** 主要獲得KPI（定期UU・CPA・AF引き上げ率）の前号比変化を提示

**レイアウト：** 3カラム横並び、各カード（w=3.87"）

**各カードの構造：**
- 上部：KPI名（13pt 太字）
- 大型数値：当月実績（56pt、達成率に応じて Forest/Gold/Crimson の色分け）
- サブテキスト：「前月比 ±X,XXX」「目標比 XX%」（11pt）
- 矢印アイコン：前月比の方向（↑ Forest / → Gold / ↓ Crimson）
- 下部：「[指摘]」カラウト（1〜2行）

**カラーコード：**
- 目標達成（≥100%）→ Forest
- 許容範囲（90-99%）→ Gold
- 目標未達（<90%）→ Crimson

**右上：** 「CONFIDENTIAL — INTERNAL USE ONLY」（Crimson 8pt）

**下部カラウト：** 3指標を横断した統合解釈（「3指標が示す現在地：」というラベルで）

---

### Slide 13：チャネル別昨対ウォーターフォール

**目的：** 主要製品（Sミルク・Sクレ・最新製品）のチャネル別昨対を可視化

**レイアウト：** 上下2段
- 上段：製品別昨対一覧表（pptx table、3〜4列 × 製品行数）
  - 列：製品名 / EC昨対 / 楽天昨対 / Amazon昨対 / オフライン昨対 / 合計昨対
  - 100%以上 → Forest 背景、100%未満 → Crimson 背景（薄め alpha=0.3）
- 下段：「Sミルクチャネルウォーターフォール」（簡易テキスト表現 or 棒グラフ）
  - EC / 楽天 / Amazon / リテール / 直営 の各着予を横並び表示

**右上：** 「CONFIDENTIAL — INTERNAL USE ONLY」（Crimson 8pt）

**下部カラウト（Crimson）：** 「最大の昨対差があるチャネルと、チャネルミックス上の含意を1〜2文」

---

### Slide 14：Part 4 ディバイダー（旧Slide 10）

「第4部　Our Thesis」「『ポストダーマコスメ』戦略」 — Gold のアクセント色

> **注意：** Layer 2（Slide 10〜13）追加により、旧スライド番号 10-22 はすべて +3 にシフトする。
> `generate_deck_template.js` の `addFooter()` 呼び出しのページ番号を更新すること。

---

### Slide 10（旧構造 / 外部共有版用プレースホルダー）

外部共有版（EXTERNAL）を出力する際は、Slide 10〜13を以下のプレースホルダーに差し替える：

**プレースホルダーコンテンツ：**
- 背景：Shade `EEE7D6`
- 中央テキスト：「本セクションは内部資料のため、外部配布版では非掲載です」（18pt、Navy）
- サブテキスト：「N organic 経営内部KPI較正分析（Layer 2）— 別途お問い合わせください」（11pt、Gray）
- 左バー：Navy（w=0.25）

---

## Layer 2 実装ノート

### generate_deck_template.js への追加コード概要

既存の Slide 9（Anua比較表）と Slide 10（旧Part 3 ディバイダー）の間に、以下の4スライドを挿入する：

```javascript
// Slide 10: Layer 2 Divider
const slide10 = pres.addSlide();
slide10.background = { color: COLOR.navy };
addLayerTwoConfidentialHeader(slide10); // 右上のCONFIDENTIALテキスト追加
// ... Part 3 ディバイダーのコンテンツ

// Slide 11: GAP Dashboard
const slide11 = pres.addSlide();
addLayerTwoConfidentialHeader(slide11);
slide11.addImage({ path: '/home/claude/chart4_gap_dashboard.png',
  x: 0.65, y: 1.4, w: 12.0, h: 5.2 });
// ... タイトルとカラウト

// Slide 12: KPI Trend 3-axis
const slide12 = pres.addSlide();
addLayerTwoConfidentialHeader(slide12);
// ... 3カラムKPIカード

// Slide 13: Channel Waterfall
const slide13 = pres.addSlide();
addLayerTwoConfidentialHeader(slide13);
// ... テーブルとウォーターフォール

// ヘルパー関数
function addLayerTwoConfidentialHeader(slide) {
  slide.addText('CONFIDENTIAL — INTERNAL USE ONLY', {
    x: 9.0, y: 0.12, w: 4.0, h: 0.25,
    fontSize: 7.5, color: COLOR.crimson,
    bold: true, align: 'right', fontFace: FONT_BODY
  });
}
```

### フッターのページ番号対応

Layer 2スライド挿入後、全スライドのフッターページ番号は総ページ数 `26` に更新する：

```javascript
// 変更前: addFooter(slide, pageNum, 22)
// 変更後: addFooter(slide, pageNum, 26)
```

---

### Slide 10：Part 3 ディバイダー（旧スライド番号）

> **現在は Slide 14** に移動（Layer 2の4スライドがShift）

「第4部　Our Thesis」「『ポストダーマコスメ』戦略」 — Gold のアクセント色

---

### Slide 11：Our Thesis ステートメント

**目的：** レポートの中核仮説を引用形式で大きく提示

**レイアウト：**
- Cream 背景
- "Our Thesis" 小見出し（Navy、charSpacing=8）+ Gold アクセントライン
- 4行に分けて本文を配置（30pt）。3-4行目は Navy 太字で強調

**下部：** 「3つの観察に基づく：」+ 01/02/03 の根拠を1行ずつ

---

### Slide 12：ポストダーマコスメ戦略フレームワーク（図表3）

**レイアウト：** chart3_strategic_thesis.png をフル幅で配置（w=11.7, h=5.0）

---

### Slide 13：「二重投資」の構造

**目的：** 戦術 vs 戦略 の時間軸分離を提示

**レイアウト：** 2カラム比較（左：戦術レイヤー 短期 Crimson、右：戦略レイヤー 長期 Forest）。各カラム内に5行（目的 / プロダクト / コミュニケーション / 投資バランス / KPI）

**重要な座標（オーバーフロー回避済み）：**
- カラム箱：y=2.05, h=4.2（前号で h=4.6 から修正）
- 各行間隔：0.55"（前号で 0.65 から修正）
- 中央の「+」記号：y=3.8（前号で 4.0 から修正）
- 経営判断としての含意カラウト：y=6.2, h=0.85

---

### Slide 14：検証3指標（A/B/C）

**目的：** Our Thesis の検証可能性を示す

**タイトル：** 「Our Thesisを検証する3つの先行指標」（短縮版 — 1行に収まる長さ）
**サブタイトル：** 「仮説は『賭け』である以上、検証可能でなければならない — 6-12ヶ月でトラッキング」

**レイアウト：** 3枚のカード（縦並び、各 h=1.5"）
- 左：大文字 A/B/C（56pt、各色 Navy / Gold / Forest）
- 中央：先行指標名 + 内容 + シグナル解釈（italic）
- 右：計測サイクル

---

### Slide 15：Part 4 ディバイダー

「第4部　3つの最重要意思決定」 — Gold アクセント

---

### Slide 16-18：意思決定 1/2/3

**共通レイアウト：**
- タイトル：「意思決定①/②/③　[論点]」
- メイン：Pro / Con 表（pptx table、緑/赤のヘッダー）
- 下部：「我々の推奨：[YES/NO/条件付きNO]」のカラウト

**各意思決定の固定方針（号によって違うかもしれないが基本構造）：**
- 意思決定①：Sミルク「闘う」訴求の全シリーズ拡張 → 推奨：条件付きNO
- 意思決定②：Anua直接対抗ライン投入 → 推奨：NO
- 意思決定③：Nラボの「実体化」投資 → 推奨：YES

意思決定①と③は Pro/Con表 + カラウト。意思決定②は「3つの理由」リスト形式（多様性のため）。

---

### Slide 19：Part 5 ディバイダー

「第5部　Uncomfortable Truths」「直面すべき5つの事実」 — 唯一 Crimson Dark 背景

---

### Slide 20：5つの不都合な事実

**レイアウト：** 5項目縦並び、各 h=1.0"
- 左：大文字番号 01-05（22pt、Crimson）
- 右：タイトル（13pt太字）+ 本文（10.5pt）

5つの定型項目：
1. 「ありのまま」と「闘う」の戦略的緊張
2. @cosme評価の絶対水準
3. シロク事業のCA内部での優先度
4. N organicの「ラグジュアリー化」上限
5. Anuaの「学習速度」に勝てない構造

---

### Slide 21：リスクマトリクス + 次月モニタリング指標 + 次号予告

**レイアウト：** 3エリア構成
- 左60%上部：リスク表（リスク要因 / 前号 / 本号 / 根拠）
- 右40%上部：次月モニタリング指標（6項目箇条書き）
- 下部全幅：次号予告（Cream背景、Navy左バー）

---

### Slide 22：付録 - データソース

**レイアウト：** 2カラム（市場・業界データ / N organic公開情報）。各カラムに項目を箇条書き

**下部：** 「情報基準について」セクション（Navy 太字 + italic説明）— 公開情報のみ、内部データ非含有を明示

## 共通ヘルパー関数

`generate_deck_template.js` には以下の関数が含まれている：

- `addFooter(slide, pageNum, totalPages)` - 全スライド共通のフッター
- `addSectionTag(slide, text)` - 上部の小さなセクションタグ
- `addTitle(slide, title, subtitle)` - タイトル + サブタイトル
- `addCallout(slide, label, body, x, y, w, h, accentColor)` - 左バー付きカラウトボックス
- `addStat(slide, value, label, sublabel, x, y, w, color)` - 大型スタッツ表示

## オーバーフロー対策のチェックリスト

毎回必ず以下を確認：

- [ ] callout の本文が h で指定した高さに収まるか（11pt 1行 ≈ 0.18-0.20"）
- [ ] タイトルが1行で収まるか（h=0.7 で 28pt 日本語 ≈ 24文字まで）
- [ ] フッター（y=7.1）と本文が重ならないか（コンテンツは y=6.95 まで）
- [ ] テーブル列幅の合計が w=12.1" に収まるか
- [ ] 画像のアスペクト比が保たれているか
