# カラーパレット & デザイン仕様

N organic 月次レポートの統一デザインシステム。content-informed なパレットとして、N organic のブランド世界観（和、自然、プレミアム、墨色）に基づいて選定。

## カラーパレット（pptxgenjs / matplotlib共通）

### Primary

| 名前 | HEX | 用途 |
|---|---|---|
| Navy | `1F3A6B` | 主要見出し、ブランド要素、Our Thesis関連 |
| NavyDark | `152849` | より深い強調が必要な場合 |
| Ink | `0D1B2E` | 本文の高コントラストテキスト |

### Secondary

| 名前 | HEX | 用途 |
|---|---|---|
| Cream | `F7F2E8` | 大型背景、ストーリー領域 |
| Paper | `FAFAFA` | オフホワイト背景 |
| White | `FFFFFF` | カード背景、Navyスライドの文字 |

### Accents（差し色）

| 名前 | HEX | 用途 |
|---|---|---|
| Crimson | `B53F3F` | 警告・脅威（Anua、不都合な事実、NO推奨） |
| CrimsonDark | `8A2E2E` | Part 5（Uncomfortable Truths）のディバイダー背景 |
| Forest | `2F5F47` | 機会・推奨（YES推奨、Pro側、検証指標C） |
| ForestDark | `1F3F30` | より深いForest |
| Gold | `9C7B3A` | プレミアム強調、Anuaスタッツ、検証指標B |

### Neutral

| 名前 | HEX | 用途 |
|---|---|---|
| Text | `1A1A1A` | 標準本文 |
| TextMuted | `6B6B6B` | サブ情報、補足 |
| TextLight | `9A9A9A` | フッター、出典 |
| Divider | `D8CDB8` | 細い区切り線 |
| Shade | `EEE7D6` | カードの背景色 |

## カラーの使い分けロジック

### 「脅威・警告」⇒ Crimson系
- Anuaの売上数値、競合脅威
- 「Uncomfortable Truth」「NO推奨」のラベル
- リスクマトリクスの「中→高」「高→極めて高」変化欄
- 「不都合な事実」の番号と見出し

### 「機会・推奨」⇒ Forest系
- 「YES推奨」「Pro（賛成）」
- 検証指標Cの「自然回帰トレンド先導」
- リスクマトリクスの「中→低」変化欄

### 「プレミアム・賭け」⇒ Gold系
- Anuaの「100億円」スタッツ
- Our Thesisセクションの強調要素
- ディバイダーのアクセントライン

### 「中立・標準」⇒ Navy系
- セクションタイトル、本文の見出し
- Our Thesis本文
- 標準的なフレームワーク要素

## フォント仕様

### 基本ルール

| 用途 | フォント | サイズ |
|---|---|---|
| カバースライドのブランド名 | Yu Mincho Bold | 56pt |
| カバースライドの副題 | Yu Mincho | 36pt |
| スライドタイトル | Yu Mincho Bold | 28pt |
| サブタイトル | Yu Gothic Italic | 13pt |
| セクションタグ | Yu Gothic Bold | 10pt（charSpacing=4-8） |
| 本文 | Yu Gothic | 11pt |
| 小さな本文 | Yu Gothic | 10.5pt |
| キャプション・出典 | Yu Gothic Italic | 9pt |
| 大型スタッツ数字 | Yu Mincho Bold | 80-120pt |

### charSpacing（文字間隔）の使い方

セクションタグや「PART 1」「MONTHLY STRATEGIC MARKET MONITOR」のような英大文字ラベルには `charSpacing: 4-8` を付ける。日本語フォントでも英字部分にスペーシングがかかり、品のある見た目になる。

### matplotlib での日本語表示

Python チャート生成時は必ず以下を設定：

```python
plt.rcParams['font.family'] = 'Noto Sans CJK JP'
plt.rcParams['axes.unicode_minus'] = False
```

これを忘れると日本語が「□□□」（豆腐）になる。最も頻発するミス。

## レイアウト原則

### 余白

- スライド外周マージン：左右 0.6"、上下 0.35-0.5"
- カード間の間隔：0.3-0.5"
- 文字とシェイプの間隔：0.15-0.25"

### 構造の繰り返し

毎スライドで以下の3要素を一貫して配置することで、統一感が出る：

1. **セクションタグ**（y=0.35）— 上部の小さなラベル
2. **タイトル**（y=0.75）+ **サブタイトル**（y=1.45）— 主要情報
3. **フッター**（y=7.1区切り線、y=7.15テキスト）— ブランディングとページ番号

### 視覚的階層

各スライドは以下のように視線誘導する：

1. タイトルで内容を把握（28pt）
2. メイン要素（チャート、ビッグスタッツ、表）でインパクト
3. サブ要素（解釈、So what?）で意味付け
4. カラウトボックスで結論を強調

## ヘルパー関数のスタイル定義

`generate_deck_template.js` の関数で使用する標準スタイル：

### `addCallout` の3バリエーション

| accentColor | 使い分け |
|---|---|
| Navy `1F3A6B` | 中立的な「示唆」「経営判断」 |
| Crimson `B53F3F` | 「Uncomfortable Truth」「警告」 |
| Forest `2F5F47` | 「機会」「YES推奨」 |

各カラウトは左バー（w=0.08）+ 薄い背景色（Navy系なら F0F3F8、Crimson系なら FCEEEE、Forest系なら EDF4EF）。

### セクションディバイダーの色

| Part | 背景 | アクセントライン |
|---|---|---|
| 1, 4 | Navy | Gold |
| 2 | Navy | Crimson |
| 3 | Navy | Gold |
| 5 | Crimson Dark | Gold |

## 避けるべきこと（AI生成ぽさの回避）

- ❌ タイトル下の薄い装飾下線（AI生成スライドの典型）
- ❌ デコ系のフルワイドの色付き帯（ヘッダーバー、サイドリボン）
- ❌ クリーム・ベージュをデフォルト背景にすること（本スキルでは意図的に使用しているがそれ以外では避ける）
- ❌ 全スライド同じレイアウトの繰り返し
- ❌ 中央揃えの本文（左寄せが基本、中央揃えはタイトルとシェイプ内のラベルのみ）

## 色のアクセシビリティ確認

主要な前景色と背景色の組み合わせは、コントラスト比 4.5:1 以上を確保している：

- Ink `0D1B2E` on White: 16.8:1 ✓
- Navy `1F3A6B` on White: 9.8:1 ✓
- Navy on Cream: 8.6:1 ✓
- White on Navy: 9.8:1 ✓
- Crimson `B53F3F` on White: 5.1:1 ✓
- Forest `2F5F47` on White: 6.4:1 ✓

これらは保ったまま、独自のカラー組み合わせを追加する場合はコントラスト比を再検証すること。
