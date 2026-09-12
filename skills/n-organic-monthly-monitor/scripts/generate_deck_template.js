// =============================================================================
// N organic 戦略市場モニタリング — PowerPoint デッキ生成テンプレート
// =============================================================================
//
// 使い方:
//   node generate_deck_template.js
//   → /mnt/user-data/outputs/N_organic_戦略市場モニタリング_2026年X月号_Tier1.pptx
//
// 月次更新時に変える箇所:
//   1. Issue No., 月号: 各スライドの "Issue 03" / "May 2026" / "5月号" を更新
//   2. 出力ファイル名: pres.writeFile({ fileName: ... }) の末尾
//   3. Cover の副題: 本号のテーマ（ポストダーマコスメ等）を反映
//   4. Exec Summary の3つの不都合な事実: 最新数値で更新
//   5. Anua 100億円スライド: 最新の売上規模数値で更新
//   6. リスクマトリクス: 前号→本号の変化欄を実態に合わせて更新
//   7. 各スライドの本文: 月次の最新動向を反映
//   8. データソース付録: 引用した最新ソースを追加
//
// 依存:
//   npm install -g pptxgenjs (バージョン 4.0.1 で動作確認済み)
//   /home/claude/chart1_market_growth.png 等の図表が事前生成済みであること
//
// QA手順 (生成後に必ず実施):
//   1. PDF変換:
//      python3 /mnt/skills/public/pptx/scripts/office/soffice.py \
//        --headless --convert-to pdf <output.pptx> --outdir /home/claude
//   2. 画像化:
//      rm -f slide-*.jpg && pdftoppm -jpeg -r 100 <output.pdf> slide
//   3. view ツールで slide-*.jpg を順次確認
//   4. callout/footer/title のオーバーフローを修正
//   5. 修正後は手順1から再実行
// =============================================================================

const pptxgen = require("pptxgenjs");
const fs = require("fs");

// ===== Color Palette =====
// Deep Japanese ink navy + cream + accents — content-informed for botanical premium brand
const COLOR = {
  navy: "1F3A6B",        // Primary - deep ink blue
  navyDark: "152849",    // Darker navy for emphasis
  ink: "0D1B2E",         // Near-black for high-contrast text
  cream: "F7F2E8",       // Premium ivory background
  paper: "FAFAFA",       // Off-white
  white: "FFFFFF",
  crimson: "B53F3F",     // Warning/threat accent
  crimsonDk: "8A2E2E",
  forest: "2F5F47",      // Opportunity/positive
  forestDk: "1F3F30",
  gold: "9C7B3A",        // Premium/aspiration accent
  text: "1A1A1A",
  textMuted: "6B6B6B",
  textLight: "9A9A9A",
  divider: "D8CDB8",     // Subtle divider line
  shade: "EEE7D6"        // Card background
};

// ===== Typography =====
// Yu Mincho for serif elegance (titles), Yu Gothic for clean body
const FONT_TITLE = "Yu Mincho";
const FONT_BODY = "Yu Gothic";

// ===== Init =====
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"
pres.author = "Strategy Advisory";
pres.title = "N organic 戦略市場モニタリング 2026年5月号";

// Slide dimensions
const W = 13.33;
const H = 7.5;

// ===== Helper builders =====

// Add a subtle footer bar to every slide (page number + report meta)
function addFooter(slide, pageNum, totalPages) {
  // Thin divider line
  slide.addShape(pres.shapes.LINE, {
    x: 0.6, y: 7.1, w: 12.1, h: 0,
    line: { color: COLOR.divider, width: 0.5 }
  });
  slide.addText("N organic Strategic Market Monitor  |  Issue 03  |  May 2026", {
    x: 0.6, y: 7.15, w: 8, h: 0.3,
    fontFace: FONT_BODY, fontSize: 9, color: COLOR.textLight, italic: true
  });
  slide.addText(`${pageNum} / ${totalPages}`, {
    x: 12.0, y: 7.15, w: 0.7, h: 0.3,
    fontFace: FONT_BODY, fontSize: 9, color: COLOR.textLight, align: "right"
  });
}

// Section header bar (small, top-right)
function addSectionTag(slide, text) {
  slide.addText(text, {
    x: 0.6, y: 0.35, w: 12.1, h: 0.3,
    fontFace: FONT_BODY, fontSize: 10, color: COLOR.navy,
    bold: true, charSpacing: 4
  });
}

// Slide title with subtitle
function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.6, y: 0.75, w: 12.1, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 28, color: COLOR.ink, bold: true,
    margin: 0
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.45, w: 12.1, h: 0.4,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.textMuted, italic: true,
      margin: 0
    });
  }
}

// Insight callout block (big takeaway)
function addCallout(slide, label, body, x, y, w, h, accentColor = COLOR.navy) {
  // Background
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: accentColor === COLOR.crimson ? "FCEEEE" :
                  accentColor === COLOR.forest ? "EDF4EF" : "F0F3F8" },
    line: { color: "FFFFFF", width: 0 }
  });
  // Left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.08, h,
    fill: { color: accentColor },
    line: { color: accentColor, width: 0 }
  });
  // Label
  slide.addText(label, {
    x: x + 0.25, y: y + 0.15, w: w - 0.4, h: 0.3,
    fontFace: FONT_BODY, fontSize: 11, color: accentColor, bold: true,
    margin: 0, charSpacing: 2
  });
  // Body
  slide.addText(body, {
    x: x + 0.25, y: y + 0.5, w: w - 0.4, h: h - 0.6,
    fontFace: FONT_BODY, fontSize: 13, color: COLOR.ink,
    margin: 0, paraSpaceAfter: 4, valign: "top"
  });
}

// Big stat with label
function addStat(slide, value, label, sublabel, x, y, w, color = COLOR.navy) {
  slide.addText(value, {
    x, y, w, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 48, color: color, bold: true,
    align: "left", valign: "top", margin: 0
  });
  slide.addText(label, {
    x, y: y + 1.0, w, h: 0.35,
    fontFace: FONT_BODY, fontSize: 12, color: COLOR.text, bold: true,
    align: "left", valign: "top", margin: 0
  });
  if (sublabel) {
    slide.addText(sublabel, {
      x, y: y + 1.35, w, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, color: COLOR.textMuted,
      align: "left", valign: "top", margin: 0, italic: true
    });
  }
}

// =========================================================
// SLIDE 1: Cover
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.cream };

  // Vertical accent bar on left
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.25, h: H,
    fill: { color: COLOR.navy }, line: { color: COLOR.navy, width: 0 }
  });

  // Small label
  slide.addText("MONTHLY STRATEGIC MARKET MONITOR", {
    x: 0.85, y: 1.0, w: 11, h: 0.3,
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.navy, bold: true,
    charSpacing: 6, margin: 0
  });
  slide.addText("Issue No. 03  /  May 2026", {
    x: 0.85, y: 1.35, w: 11, h: 0.3,
    fontFace: FONT_BODY, fontSize: 10, color: COLOR.textMuted, margin: 0
  });

  // Horizontal accent line
  slide.addShape(pres.shapes.LINE, {
    x: 0.85, y: 1.85, w: 3.0, h: 0,
    line: { color: COLOR.navy, width: 2 }
  });

  // Main title - large
  slide.addText("N organic", {
    x: 0.85, y: 2.4, w: 11, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 56, color: COLOR.ink, bold: true,
    margin: 0
  });
  slide.addText("戦略市場モニタリング", {
    x: 0.85, y: 3.5, w: 11, h: 0.8,
    fontFace: FONT_TITLE, fontSize: 36, color: COLOR.navy,
    margin: 0
  });

  // Subtitle
  slide.addText("「ポストダーマコスメ」戦略仮説とAnua脅威への対応", {
    x: 0.85, y: 4.5, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 16, color: COLOR.text, margin: 0
  });
  slide.addText("From Derma Race to Beyond-Derma Positioning: A Strategic Thesis", {
    x: 0.85, y: 5.0, w: 11, h: 0.4,
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.textMuted, italic: true, margin: 0
  });

  // Bottom info
  slide.addShape(pres.shapes.LINE, {
    x: 0.85, y: 6.4, w: 11.6, h: 0,
    line: { color: COLOR.divider, width: 0.5 }
  });
  slide.addText([
    { text: "提出先　　　", options: { color: COLOR.textMuted, bold: true } },
    { text: "株式会社シロク　N organicブランドチーム", options: { color: COLOR.text, breakLine: true } },
    { text: "発行日　　　", options: { color: COLOR.textMuted, bold: true } },
    { text: "2026年5月18日", options: { color: COLOR.text, breakLine: true } },
    { text: "情報基準　　", options: { color: COLOR.textMuted, bold: true } },
    { text: "公開情報のみ。内部財務・KPIデータ非含有", options: { color: COLOR.text, breakLine: true } },
    { text: "守秘区分　　", options: { color: COLOR.textMuted, bold: true } },
    { text: "Strictly Confidential", options: { color: COLOR.text } }
  ], {
    x: 0.85, y: 6.55, w: 11.6, h: 0.85,
    fontFace: FONT_BODY, fontSize: 10, margin: 0
  });
}

// =========================================================
// SLIDE 2: Executive Summary - 1 page
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "エグゼクティブ・サマリー  ／  EXECUTIVE SUMMARY");
  addTitle(slide, "Our Thesis：「ポストダーマコスメ」への戦略転換",
           "経営陣意思決定者向け 1ページ要約 — 詳細は本編各章を参照");

  // Big thesis box
  addCallout(slide,
    "OUR THESIS",
    "N organicの戦略的勝ち筋は、ダーマコスメ勝者になることではなく、ポストダーマコスメ時代の自然回帰需要を独占する位置取りである。Sミルクは戦術として正解だが、ブランド資産投資は別軌道で進めるべきだ。",
    0.6, 2.0, 12.1, 1.2, COLOR.navy);

  // 3 facts grid
  slide.addText("市場の現実 — 3つの不都合な事実", {
    x: 0.6, y: 3.45, w: 12.1, h: 0.35,
    fontFace: FONT_BODY, fontSize: 13, color: COLOR.text, bold: true, margin: 0
  });

  const facts = [
    { num: "01", title: "主戦場の構造的劣後",
      body: "自然派・オーガニック市場 +3.1%。スキンケア全体(+3.5%)、医薬部外品(+8.35%)、ダーマコスメ世界(+9.7%)に劣後。",
      src: "矢野経済 / IMARC / TBRC" },
    { num: "02", title: "Anuaが最大の構造的脅威",
      body: "Anua日本売上 100億円突破・前年比3倍以上(2024年度)。L'Oréalや資生堂より先に、N organicと同等規模で並走。",
      src: "週刊粧業 2025年3月号" },
    { num: "03", title: "@cosme評価の絶対水準",
      body: "Sミルクの@cosme評価4.9点。業界トップ水準(5.5+)未到達。「闘う」訴求と実体感のギャップ示唆。",
      src: "@cosme公開クチコミ" }
  ];

  facts.forEach((f, i) => {
    const x = 0.6 + i * 4.07;
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.85, w: 3.87, h: 1.5,
      fill: { color: COLOR.shade },
      line: { color: "FFFFFF", width: 0 }
    });
    slide.addText(f.num, {
      x: x + 0.2, y: 3.95, w: 0.8, h: 0.35,
      fontFace: FONT_TITLE, fontSize: 16, color: COLOR.crimson, bold: true, margin: 0
    });
    slide.addText(f.title, {
      x: x + 0.85, y: 3.92, w: 2.9, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.ink, bold: true, margin: 0
    });
    slide.addText(f.body, {
      x: x + 0.2, y: 4.35, w: 3.55, h: 0.75,
      fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, margin: 0, paraSpaceAfter: 2
    });
    slide.addText("出典：" + f.src, {
      x: x + 0.2, y: 5.15, w: 3.55, h: 0.2,
      fontFace: FONT_BODY, fontSize: 8, color: COLOR.textLight, italic: true, margin: 0
    });
  });

  // 3 decisions
  slide.addText("今月の3つの最重要意思決定（詳細は第4部）", {
    x: 0.6, y: 5.6, w: 12.1, h: 0.35,
    fontFace: FONT_BODY, fontSize: 13, color: COLOR.text, bold: true, margin: 0
  });

  const decisions = [
    { num: "①", q: "Sミルク「闘う」訴求の全シリーズ拡張", a: "条件付きNO", color: COLOR.crimson },
    { num: "②", q: "Anua直接対抗ライン投入", a: "NO", color: COLOR.crimson },
    { num: "③", q: "Nラボの「実体化」投資", a: "YES", color: COLOR.forest }
  ];
  decisions.forEach((d, i) => {
    const y = 6.0 + i * 0.32;
    slide.addText([
      { text: d.num + "  ", options: { color: COLOR.navy, bold: true } },
      { text: d.q + "　→　", options: { color: COLOR.text } },
      { text: d.a, options: { color: d.color, bold: true } }
    ], {
      x: 0.6, y, w: 12.1, h: 0.3,
      fontFace: FONT_BODY, fontSize: 12, margin: 0
    });
  });

  addFooter(slide, 2, 22);
}

// =========================================================
// SLIDE 3: Section divider 第1部
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.navy };

  slide.addText("PART 1", {
    x: 0.85, y: 2.5, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 14, color: "B8C8E0", bold: true, charSpacing: 8, margin: 0
  });
  slide.addText("第1部　市場の構造的劣後", {
    x: 0.85, y: 3.05, w: 11, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 44, color: "FFFFFF", bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.85, y: 4.2, w: 3.0, h: 0,
    line: { color: COLOR.gold, width: 2.5 }
  });
  slide.addText("N organicが立つセグメントの位置と、消費者意識の構造変化を確認する。", {
    x: 0.85, y: 4.5, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 16, color: "B8C8E0", italic: true, margin: 0
  });
}

// =========================================================
// SLIDE 4: Market growth comparison
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 1  ／  市場の構造的劣後");
  addTitle(slide, "N organic主戦場の成長率は、業界4セグメント中で最も低い",
           "矢野経済・富士経済・IMARC・TBRC各社調査値の横断比較");

  // Native chart for editability
  const chartData = [{
    name: "年成長率",
    labels: [
      "自然派・オーガニック\n(N organic主戦場)",
      "スキンケア化粧品全体",
      "医薬部外品スキンケア",
      "ダーマコスメ(世界)"
    ],
    values: [3.1, 3.5, 8.35, 9.7]
  }];

  slide.addChart(pres.charts.BAR, chartData, {
    x: 0.6, y: 2.0, w: 7.5, h: 4.6,
    barDir: "bar",
    chartColors: [COLOR.crimson, COLOR.textMuted, COLOR.gold, COLOR.navy],
    chartColorsOpacity: 85,
    catAxisLabelColor: COLOR.text,
    catAxisLabelFontSize: 10,
    catAxisLabelFontFace: FONT_BODY,
    valAxisLabelColor: COLOR.textMuted,
    valAxisLabelFontSize: 9,
    valGridLine: { color: "E8E8E8", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelPosition: "outEnd",
    dataLabelColor: COLOR.ink,
    dataLabelFontSize: 13,
    dataLabelFontBold: true,
    dataLabelFormatCode: "0.0\"%\"",
    showLegend: false,
    chartArea: { fill: { color: "FFFFFF" } },
    plotArea: { fill: { color: "FFFFFF" } },
    valAxisMaxVal: 12,
    barGapWidthPct: 60
  });

  // Right column - insights
  slide.addText("数値が示すこと", {
    x: 8.4, y: 2.0, w: 4.3, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, color: COLOR.ink, bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 8.4, y: 2.45, w: 0.5, h: 0,
    line: { color: COLOR.crimson, width: 2 }
  });

  slide.addText([
    { text: "事実", options: { color: COLOR.crimson, bold: true } },
    { text: " — N organicが主戦場とする「自然派・オーガニック」は、隣接3セグメントすべてに劣後する成長率である。", options: { color: COLOR.text, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "解釈", options: { color: COLOR.navy, bold: true } },
    { text: " — 現状のセグメント定義に留まる限り、市場平均超の成長は構造的に困難。ただし、これは「ダーマコスメへの移動が答え」を意味しない。", options: { color: COLOR.text, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "示唆", options: { color: COLOR.gold, bold: true } },
    { text: " — 「立つ場所」の問題であり、戦略仮説のレベルで再考すべき論点。Our Thesis（第3部）に接続する。", options: { color: COLOR.text } }
  ], {
    x: 8.4, y: 2.6, w: 4.3, h: 4.0,
    fontFace: FONT_BODY, fontSize: 11, margin: 0, paraSpaceAfter: 4
  });

  addFooter(slide, 4, 22);
}

// =========================================================
// SLIDE 5: Consumer "成分迷子" insight
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 1  ／  市場の構造的劣後");
  addTitle(slide, "消費者の「成分迷子」現象が、第三のポジション需要を生む",
           "The Founders JAPAN 2026年1月調査 (N=1,054) からの構造解釈");

  // Two-column: stat on left, narrative on right

  // Left: big stat
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.1, w: 5.2, h: 4.0,
    fill: { color: COLOR.cream }, line: { color: "FFFFFF", width: 0 }
  });

  slide.addText("80%", {
    x: 0.9, y: 2.3, w: 4.6, h: 1.6,
    fontFace: FONT_TITLE, fontSize: 110, color: COLOR.crimson, bold: true, margin: 0
  });
  slide.addText("20-30代女性が「成分迷子」を実感", {
    x: 0.9, y: 4.0, w: 4.6, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, color: COLOR.ink, bold: true, margin: 0
  });
  slide.addText("「自然由来派」「ダーマ・サイエンス派」双方ともに、約8割が「保湿不足」「成分迷子」を実感していると回答", {
    x: 0.9, y: 4.45, w: 4.6, h: 1.0,
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, margin: 0
  });
  slide.addText("出典：The Founders JAPAN「20-30代女性スキンケア意識調査」(2026年1月、N=1,054)", {
    x: 0.9, y: 5.65, w: 4.6, h: 0.4,
    fontFace: FONT_BODY, fontSize: 9, color: COLOR.textLight, italic: true, margin: 0
  });

  // Right: 3-step interpretation
  slide.addText("構造的解釈：「成分迷子」が意味するもの", {
    x: 6.2, y: 2.1, w: 6.5, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, color: COLOR.ink, bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 6.2, y: 2.55, w: 0.5, h: 0,
    line: { color: COLOR.navy, width: 2 }
  });

  const steps = [
    { n: "01", title: "現状", body: "レチノール・PDRN・ナイアシンアミド・トラネキサム酸・CICA・PGAなど機能成分が氾濫" },
    { n: "02", title: "結果", body: "消費者は「結局自分に合うものが分からない」状態に。ダーマコスメ訴求の限界" },
    { n: "03", title: "示唆", body: "「信頼できる開発組織・処方思想を持つブランド」への集約が起きる可能性 — 2026-2028年" }
  ];

  steps.forEach((s, i) => {
    const y = 2.85 + i * 1.05;
    slide.addText(s.n, {
      x: 6.2, y, w: 0.6, h: 0.4,
      fontFace: FONT_TITLE, fontSize: 18, color: COLOR.navy, bold: true, margin: 0
    });
    slide.addText(s.title, {
      x: 6.85, y, w: 5.8, h: 0.35,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.ink, bold: true, margin: 0
    });
    slide.addText(s.body, {
      x: 6.85, y: y + 0.35, w: 5.8, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0
    });
  });

  addCallout(slide,
    "市場示唆",
    "「自然派 vs ダーマ」の二者択一構図が崩れ、両派の「成分迷子」を解消する『第三のポジション』需要が顕在化する。",
    0.6, 6.35, 12.1, 0.7, COLOR.navy);

  addFooter(slide, 5, 22);
}

// =========================================================
// SLIDE 6: Section divider 第2部
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.navy };

  slide.addText("PART 2", {
    x: 0.85, y: 2.5, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 14, color: "B8C8E0", bold: true, charSpacing: 8, margin: 0
  });
  slide.addText("第2部　最大の脅威はAnuaである", {
    x: 0.85, y: 3.05, w: 11, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 44, color: "FFFFFF", bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.85, y: 4.2, w: 3.0, h: 0,
    line: { color: COLOR.crimson, width: 2.5 }
  });
  slide.addText("競合構造を、L'Oréal や資生堂ではなく、Anua を起点に組み替える。", {
    x: 0.85, y: 4.5, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 16, color: "B8C8E0", italic: true, margin: 0
  });
}

// =========================================================
// SLIDE 7: Anua 100億円 - big stat
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 2  ／  最大の脅威はAnuaである");
  addTitle(slide, "Anuaの日本売上は100億円を突破した — 前年比3倍以上",
           "出典：週刊粧業 2025年3月24日発行");

  // Big stat block - 100億円
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.1, w: 12.1, h: 2.0,
    fill: { color: COLOR.navy }, line: { color: COLOR.navy, width: 0 }
  });

  slide.addText("100億円", {
    x: 0.85, y: 2.3, w: 5.5, h: 1.6,
    fontFace: FONT_TITLE, fontSize: 80, color: COLOR.gold, bold: true, margin: 0, valign: "middle"
  });
  slide.addText("Anua 日本売上 (2024年度)", {
    x: 6.5, y: 2.45, w: 6.0, h: 0.5,
    fontFace: FONT_BODY, fontSize: 18, color: "FFFFFF", bold: true, margin: 0
  });
  slide.addText("前年比 +200% (3倍以上の伸長)", {
    x: 6.5, y: 2.95, w: 6.0, h: 0.4,
    fontFace: FONT_BODY, fontSize: 13, color: COLOR.gold, margin: 0
  });
  slide.addText("N organicの推定売上規模(100億円水準)と同等。同セグメント、同顧客、同価値訴求。", {
    x: 6.5, y: 3.4, w: 6.0, h: 0.6,
    fontFace: FONT_BODY, fontSize: 11, color: "C8D2E0", italic: true, margin: 0
  });

  // 3 facts row
  const anuaFacts = [
    { label: "ブランド戦略構造",
      body: "「攻め(レチノール・PDRN・ナイアシンアミド)」×「守り(ドクダミ・桃・ライス)」の2ライン構造で、機能と自然由来を両立" },
    { label: "受賞・市場評価",
      body: "Qoo10 MEGA BEAUTY AWARDS 2025 総合大賞「レチノール0.3 ナイアシンリニューイングセラム」 — 61万票投票" },
    { label: "プロモーション速度",
      body: "2024年10月から、なにわ男子 大橋和也氏起用の日本版CMを継続放映。Qoo10セット改編は2-3ヶ月単位" }
  ];

  anuaFacts.forEach((f, i) => {
    const x = 0.6 + i * 4.07;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.4, w: 3.87, h: 2.3,
      fill: { color: COLOR.shade }, line: { color: "FFFFFF", width: 0 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.4, w: 3.87, h: 0.05,
      fill: { color: COLOR.crimson }, line: { color: COLOR.crimson, width: 0 }
    });
    slide.addText(f.label, {
      x: x + 0.25, y: 4.6, w: 3.5, h: 0.4,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.crimson, bold: true, margin: 0
    });
    slide.addText(f.body, {
      x: x + 0.25, y: 5.05, w: 3.5, h: 1.6,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, margin: 0, paraSpaceAfter: 3
    });
  });

  addFooter(slide, 7, 22);
}

// =========================================================
// SLIDE 8: Competitive map (use generated chart image)
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 2  ／  最大の脅威はAnuaである");
  addTitle(slide, "Anuaは「自然派×プレミアム」象限へ上方移動している",
           "競合ポジショニング・マップ（2軸：自然派↔機能性 × ボリューム↔プレミアム）");

  // Embed the chart image (left side)
  slide.addImage({
    path: "/home/claude/chart2_competitive_map.png",
    x: 0.6, y: 1.95, w: 7.5, h: 4.8
  });

  // Right side: takeaways
  slide.addText("読み取れること", {
    x: 8.4, y: 2.0, w: 4.3, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, color: COLOR.ink, bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 8.4, y: 2.45, w: 0.5, h: 0,
    line: { color: COLOR.crimson, width: 2 }
  });

  const takeaways = [
    { n: "01", body: "AnuaはK-Beauty象限から、N organicの居場所「自然派×プレミアム」象限へ明確に上方移動中" },
    { n: "02", body: "従来想定の競合(SHIRO、THREE)は世界観競合だが、戦略的優先度は相対的に低い" },
    { n: "03", body: "L'Oréalや資生堂は「機能×プレミアム」象限にあり、顧客層の重複は部分的" }
  ];

  takeaways.forEach((t, i) => {
    const y = 2.65 + i * 1.3;
    slide.addText(t.n, {
      x: 8.4, y, w: 0.6, h: 0.4,
      fontFace: FONT_TITLE, fontSize: 16, color: COLOR.crimson, bold: true, margin: 0
    });
    slide.addText(t.body, {
      x: 9.0, y: y + 0.05, w: 3.7, h: 1.1,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, margin: 0
    });
  });

  addCallout(slide,
    "戦略的含意",
    "Anuaの侵食方向は「上方」。価格を上げ、訴求軸を「自然由来×機能」に統合してくる。",
    8.4, 6.3, 4.3, 0.85, COLOR.crimson);

  addFooter(slide, 8, 22);
}

// =========================================================
// SLIDE 9: Why Anua > L'Oreal as threat
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 2  ／  最大の脅威はAnuaである");
  addTitle(slide, "なぜAnuaが「L'Oréal・資生堂より危険」なのか",
           "競合脅威の質的構造比較 — 5軸での評価");

  // Comparison table - native PowerPoint table for editability
  const tableData = [
    [
      { text: "評価軸", options: { bold: true, fill: { color: COLOR.navy }, color: COLOR.white, align: "center" } },
      { text: "L'Oréal / 資生堂等大手", options: { bold: true, fill: { color: "EFEFEF" }, color: COLOR.text, align: "center" } },
      { text: "Anua", options: { bold: true, fill: { color: COLOR.crimson }, color: COLOR.white, align: "center" } }
    ],
    [
      { text: "売上規模", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "Vichy/La Roche-Posay合計で数百億円", options: {} },
      { text: "100億円(N organicとほぼ同等)", options: { bold: true, color: COLOR.crimson } }
    ],
    [
      { text: "顧客層", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "敏感肌・専門化主導、N organicと部分重複", options: {} },
      { text: "20-40代女性、N organicと高重複", options: { bold: true, color: COLOR.crimson } }
    ],
    [
      { text: "成長速度", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "J-Beauty/外資ともCAGR一桁台", options: {} },
      { text: "前年比+200%以上(二桁倍率)", options: { bold: true, color: COLOR.crimson } }
    ],
    [
      { text: "価値訴求", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "「皮膚科学」中心、自然派とは距離", options: {} },
      { text: "「自然由来×機能」、N organic直撃", options: { bold: true, color: COLOR.crimson } }
    ],
    [
      { text: "新製品速度", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "J-Beauty同等の遅さ", options: {} },
      { text: "Qoo10セット改編は2-3ヶ月単位", options: { bold: true, color: COLOR.crimson } }
    ]
  ];

  slide.addTable(tableData, {
    x: 0.6, y: 2.05, w: 12.1, h: 3.85,
    colW: [2.5, 4.5, 5.1],
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.text,
    valign: "middle",
    border: { type: "solid", pt: 0.5, color: "DDDDDD" }
  });

  // Bottom callout
  addCallout(slide,
    "UNCOMFORTABLE TRUTH",
    "「ダーマコスメ大手の参入」を脅威として議論する間に、Anuaは既に同じ規模・同じ顧客・同じ訴求軸で並走している。資生堂を相手にする戦略思考と、Anuaを相手にする戦略思考は質的に異なる。前者は「巨像との差別化」だが、後者は「同体格との生存競争」である。",
    0.6, 6.0, 12.1, 1.05, COLOR.crimson);

  addFooter(slide, 9, 22);
}

// =========================================================
// SLIDE 10: Section divider 第3部 Our Thesis
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.navy };

  slide.addText("PART 3", {
    x: 0.85, y: 2.3, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 14, color: "B8C8E0", bold: true, charSpacing: 8, margin: 0
  });
  slide.addText("第3部　Our Thesis", {
    x: 0.85, y: 2.85, w: 11, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 44, color: "FFFFFF", bold: true, margin: 0
  });
  slide.addText("「ポストダーマコスメ」戦略", {
    x: 0.85, y: 3.85, w: 11, h: 0.8,
    fontFace: FONT_TITLE, fontSize: 28, color: COLOR.gold, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.85, y: 4.85, w: 3.0, h: 0,
    line: { color: COLOR.gold, width: 2.5 }
  });
  slide.addText("コンサルファームとしての賭け — 検証可能な仮説として提示する。", {
    x: 0.85, y: 5.15, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 16, color: "B8C8E0", italic: true, margin: 0
  });
}

// =========================================================
// SLIDE 11: Our Thesis statement
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.cream };

  addSectionTag(slide, "PART 3  ／  Our Thesis");

  // Big quote-style thesis
  slide.addText("Our Thesis", {
    x: 0.85, y: 1.3, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 12, color: COLOR.navy, bold: true,
    charSpacing: 8, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.85, y: 1.75, w: 1.0, h: 0,
    line: { color: COLOR.gold, width: 2.5 }
  });

  slide.addText("「N organicの戦略的勝ち筋は、", {
    x: 0.85, y: 2.1, w: 11.6, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 30, color: COLOR.ink, margin: 0
  });
  slide.addText("ダーマコスメ勝者になることではなく、", {
    x: 0.85, y: 2.8, w: 11.6, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 30, color: COLOR.ink, margin: 0
  });
  slide.addText("ポストダーマコスメ時代の自然回帰需要を", {
    x: 0.85, y: 3.5, w: 11.6, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 30, color: COLOR.navy, bold: true, margin: 0
  });
  slide.addText("独占する位置取りである。」", {
    x: 0.85, y: 4.2, w: 11.6, h: 0.7,
    fontFace: FONT_TITLE, fontSize: 30, color: COLOR.navy, bold: true, margin: 0
  });

  // Three supporting points
  slide.addText("3つの観察に基づく：", {
    x: 0.85, y: 5.4, w: 11.6, h: 0.35,
    fontFace: FONT_BODY, fontSize: 12, color: COLOR.text, bold: true, margin: 0
  });

  const points = [
    "資金量・研究員数で資生堂・L'Oréal等の大手にダーマ正面衝突で勝てる可能性は低い",
    "「成分迷子」現象がダーマコスメ疲弊期(2028-2030想定)を引き寄せる構造的兆候として顕在化",
    "化粧品業界の10年周期サイクル(自然派↔ダーマ)の振り戻しで、2030年代は自然回帰局面"
  ];
  points.forEach((p, i) => {
    slide.addText("0" + (i + 1), {
      x: 0.85, y: 5.8 + i * 0.4, w: 0.6, h: 0.35,
      fontFace: FONT_TITLE, fontSize: 14, color: COLOR.gold, bold: true, margin: 0
    });
    slide.addText(p, {
      x: 1.5, y: 5.8 + i * 0.4, w: 11, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.text, margin: 0
    });
  });

  addFooter(slide, 11, 22);
}

// =========================================================
// SLIDE 12: Strategic framework (chart 3)
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 3  ／  Our Thesis");
  addTitle(slide, "ポストダーマコスメ戦略：4フェーズの時間軸モデル",
           "ダーマ勃興期 → 本格化 → 疲弊 → 自然回帰 の局面で、N organicが取るべき2つの選択");

  slide.addImage({
    path: "/home/claude/chart3_strategic_thesis.png",
    x: 0.8, y: 2.0, w: 11.7, h: 5.0
  });

  addFooter(slide, 12, 22);
}

// =========================================================
// SLIDE 13: Twin-track investment
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 3  ／  Our Thesis");
  addTitle(slide, "「二重投資」の構造：戦術と戦略を時間軸で分離する",
           "Sミルクの機能訴求は維持しつつ、ブランド資産は別軌道で投資");

  // Two columns
  const cols = [
    { title: "戦術レイヤー (短期)", subtitle: "Sミルク型の機能訴求", color: COLOR.crimson, fill: "FCEEEE",
      goal: "既存顧客の獲得・維持、Anua等への対抗",
      product: "Sミルク型(医薬部外品・成分の数値化)",
      comm: "「闘う美容乳液」のような機能訴求コピー",
      budget: "広告・販促予算の 60-65%",
      kpi: "売上・CPA・新規獲得数" },
    { title: "戦略レイヤー (長期)", subtitle: "ブランド資産投資", color: COLOR.forest, fill: "EDF4EF",
      goal: "2030年代の自然回帰需要を独占する位置取り",
      product: "ブランド世界観・「ありのまま」体験設計",
      comm: "MONOQROME型編集・Nラボ可視化・哲学ムービー",
      budget: "ブランド資産投資 35-40% (業界標準より高比率)",
      kpi: "ブランド指名検索・@cosme評価・PR露出の質" }
  ];

  cols.forEach((c, i) => {
    const x = 0.6 + i * 6.2;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.05, w: 5.9, h: 4.2,
      fill: { color: c.fill }, line: { color: "FFFFFF", width: 0 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.05, w: 5.9, h: 0.08,
      fill: { color: c.color }, line: { color: c.color, width: 0 }
    });

    slide.addText(c.title, {
      x: x + 0.25, y: 2.25, w: 5.4, h: 0.4,
      fontFace: FONT_BODY, fontSize: 14, color: c.color, bold: true, margin: 0
    });
    slide.addText(c.subtitle, {
      x: x + 0.25, y: 2.65, w: 5.4, h: 0.35,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.textMuted, italic: true, margin: 0
    });

    const rows = [
      { label: "目的", text: c.goal },
      { label: "プロダクト", text: c.product },
      { label: "コミュニケーション", text: c.comm },
      { label: "投資バランス", text: c.budget },
      { label: "KPI", text: c.kpi }
    ];
    rows.forEach((r, j) => {
      const ry = 3.15 + j * 0.55;
      slide.addText(r.label, {
        x: x + 0.25, y: ry, w: 1.8, h: 0.22,
        fontFace: FONT_BODY, fontSize: 10, color: c.color, bold: true, margin: 0
      });
      slide.addText(r.text, {
        x: x + 0.25, y: ry + 0.22, w: 5.4, h: 0.33,
        fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0
      });
    });
  });

  // Center divider with "+" sign
  slide.addText("+", {
    x: 6.4, y: 3.8, w: 0.6, h: 0.8,
    fontFace: FONT_TITLE, fontSize: 44, color: COLOR.gold, bold: true, align: "center", margin: 0
  });

  addCallout(slide,
    "経営判断としての含意",
    "二重投資は「予算を分割する」のではなく「目的別に時間軸を分ける」アプローチ。短期売上と長期ブランド資産が同じ予算プールを取り合う構造を解体する。",
    0.6, 6.2, 12.1, 0.85, COLOR.navy);

  addFooter(slide, 13, 22);
}

// =========================================================
// SLIDE 14: Verification - 3 leading indicators
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 3  ／  Our Thesis");
  addTitle(slide, "Our Thesisを検証する3つの先行指標",
           "仮説は「賭け」である以上、検証可能でなければならない — 6-12ヶ月でトラッキング");

  const indicators = [
    { label: "A", title: "K-Beautyの頭打ち兆候",
      body: "Anuaおよび主要K-Beautyブランドの @cosmeクチコミ平均点とSNS言及量の推移",
      signal: "頭打ち or 減速が見えれば、ダーマ疲れの先行兆候",
      timeline: "2026年6月～12月", color: COLOR.navy },
    { label: "B", title: "ダーマ大手の認知拡大",
      body: "資生堂・カネボウ・コーセーのダーマ系新ブランドの認知拡大度・店頭シェア変化",
      signal: "急拡大ならダーマ本格期延長、横ばいなら疲弊期接近",
      timeline: "四半期トラッキング", color: COLOR.gold },
    { label: "C", title: "自然回帰トレンド先導",
      body: "@cosme「日本プライドコスメ」「自然由来×機能」トレンド評価点の半期推移、訪日客買い物動向の質的変化",
      signal: "自然回帰ターゲットの先導兆候 — 最重要",
      timeline: "半期サイクル", color: COLOR.forest }
  ];

  indicators.forEach((ind, i) => {
    const y = 2.1 + i * 1.65;
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y, w: 12.1, h: 1.5,
      fill: { color: "FAFAFA" }, line: { color: COLOR.divider, width: 0.5 }
    });
    // Left accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y, w: 0.08, h: 1.5,
      fill: { color: ind.color }, line: { color: ind.color, width: 0 }
    });
    // Big letter
    slide.addText(ind.label, {
      x: 0.85, y: y + 0.25, w: 1.0, h: 1.0,
      fontFace: FONT_TITLE, fontSize: 56, color: ind.color, bold: true, margin: 0, valign: "middle"
    });
    // Title
    slide.addText("先行指標 " + ind.label + " — " + ind.title, {
      x: 2.0, y: y + 0.2, w: 8.5, h: 0.35,
      fontFace: FONT_BODY, fontSize: 14, color: COLOR.ink, bold: true, margin: 0
    });
    slide.addText(ind.body, {
      x: 2.0, y: y + 0.55, w: 8.5, h: 0.55,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, margin: 0
    });
    slide.addText("→ " + ind.signal, {
      x: 2.0, y: y + 1.1, w: 8.5, h: 0.35,
      fontFace: FONT_BODY, fontSize: 11, color: ind.color, italic: true, bold: true, margin: 0
    });
    // Right timeline
    slide.addText("計測サイクル", {
      x: 10.7, y: y + 0.3, w: 1.9, h: 0.3,
      fontFace: FONT_BODY, fontSize: 9, color: COLOR.textMuted, bold: true, margin: 0
    });
    slide.addText(ind.timeline, {
      x: 10.7, y: y + 0.6, w: 1.9, h: 0.6,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.ink, bold: true, margin: 0
    });
  });

  addFooter(slide, 14, 22);
}

// =========================================================
// SLIDE 15: Section divider 第4部
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.navy };

  slide.addText("PART 4", {
    x: 0.85, y: 2.5, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 14, color: "B8C8E0", bold: true, charSpacing: 8, margin: 0
  });
  slide.addText("第4部　3つの最重要意思決定", {
    x: 0.85, y: 3.05, w: 11, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 44, color: "FFFFFF", bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.85, y: 4.2, w: 3.0, h: 0,
    line: { color: COLOR.gold, width: 2.5 }
  });
  slide.addText("今四半期中に判断すべき論点を、Pro/Conと推奨判断と共に提示する。", {
    x: 0.85, y: 4.5, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 16, color: "B8C8E0", italic: true, margin: 0
  });
}

// =========================================================
// SLIDE 16: Decision 1
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 4  ／  3つの最重要意思決定");
  addTitle(slide, "意思決定①  Sミルク「闘う」訴求を全シリーズへ拡張するか",
           "Basic ⇒ Vie / Bright / Plenum への汎用テンプレート化の経営判断");

  // Pro/Con table
  const pcData = [
    [
      { text: "Pro（拡張賛成論）", options: { bold: true, fill: { color: COLOR.forest }, color: COLOR.white, align: "center" } },
      { text: "Con（拡張慎重論）", options: { bold: true, fill: { color: COLOR.crimson }, color: COLOR.white, align: "center" } }
    ],
    [
      { text: "CM視聴単価・YT想起リフト等の指標がポジティブと推察され、コミュニケーション設計として成立している", options: {} },
      { text: "@cosme Sミルクのクチコミ平均評価は4.9点で、リブランディング体現の旗艦としては相対的に低水準", options: {} }
    ],
    [
      { text: "「機能成分の数値化(CICA 10.9倍)」訴求は2026年市場で有効", options: {} },
      { text: "「闘う」「炎上」のトーンは、N organic既存ロイヤル顧客の「ありのまま」イメージから乖離するリスク", options: {} }
    ],
    [
      { text: "Sミルク売上の即時拡大が見込める", options: {} },
      { text: "Vie/Bright/Plenumの独自世界観が「闘う」一色に矮小化する", options: {} }
    ],
    [
      { text: "競合(Anua)の機能訴求への対抗手段になる", options: {} },
      { text: "ダーマコスメ路線への深入りは、Our Thesisと矛盾する", options: {} }
    ]
  ];

  slide.addTable(pcData, {
    x: 0.6, y: 2.05, w: 12.1, h: 3.0,
    colW: [6.05, 6.05],
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, valign: "middle",
    border: { type: "solid", pt: 0.5, color: "DDDDDD" }
  });

  // Recommendation
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.3, w: 12.1, h: 1.65,
    fill: { color: COLOR.cream }, line: { color: "FFFFFF", width: 0 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.3, w: 0.08, h: 1.65,
    fill: { color: COLOR.crimson }, line: { color: COLOR.crimson, width: 0 }
  });

  slide.addText([
    { text: "我々の推奨：", options: { color: COLOR.crimson, bold: true, fontSize: 14 } },
    { text: "条件付きNO", options: { color: COLOR.crimson, bold: true, fontSize: 16 } }
  ], {
    x: 0.85, y: 5.45, w: 11.6, h: 0.4,
    fontFace: FONT_BODY, margin: 0
  });

  slide.addText("Sミルクの「闘う」訴求はBasicシリーズの戦術として維持するが、Vie・Bright・Plenumへの一律拡張は推奨しない。代わりに、各シリーズの世界観に応じた、「ありのまま」を起点とした個別の機能訴求言語を開発すべきである。", {
    x: 0.85, y: 5.9, w: 11.6, h: 0.4,
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, margin: 0
  });
  slide.addText([
    { text: "言語体系の方向性： ", options: { color: COLOR.navy, bold: true } },
    { text: "Vie＝『年齢を否定しない、年齢と歩む』 ／ Bright＝『隠さず、整える』 ／ Plenum＝『豊かさを獲得する、ではなく、纏う』", options: { color: COLOR.text } }
  ], {
    x: 0.85, y: 6.35, w: 11.6, h: 0.5,
    fontFace: FONT_BODY, fontSize: 11, italic: true, margin: 0
  });

  addFooter(slide, 16, 22);
}

// =========================================================
// SLIDE 17: Decision 2
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 4  ／  3つの最重要意思決定");
  addTitle(slide, "意思決定②  Anua直接対抗ラインを投入するか",
           "中価格帯ダーマ寄りライン投入の経営判断");

  // 3 reasons
  slide.addText("我々がNoを取る3つの理由", {
    x: 0.6, y: 2.05, w: 12.1, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, color: COLOR.ink, bold: true, margin: 0
  });

  const reasons = [
    { num: "01", title: "Anuaの土俵で勝てない",
      body: "Anuaの強みは「韓国本国の量産能力 × 日本市場特化のマーケ × Qoo10流通の組み合わせ」。N organicがこの組み合わせで勝てる可能性は低い。価格帯を下げれば、Anuaの土俵に乗ったまま負ける構造。" },
    { num: "02", title: "Anuaが取れない領域がある",
      body: "「日本産プレミアム自然派」「日本人開発者のストーリー」「国産植物×日本の風土」は、Anuaが構造的に模倣困難。N organicがすでに持つ「日本」「ありのまま」「肌と心」は、構造的に守れる差別化軸。" },
    { num: "03", title: "プレミアム資産の毀損リスク",
      body: "中価格帯への参入は、N organicのプレミアム価格帯ブランド資産(6,000円台の乳液で支持される)を毀損するリスクがある。POLAやSHISEIDOがプチプラ参入で成功しないのと同じ構造。" }
  ];

  reasons.forEach((r, i) => {
    const y = 2.55 + i * 1.15;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y, w: 12.1, h: 1.0,
      fill: { color: "FAFAFA" }, line: { color: COLOR.divider, width: 0.5 }
    });
    slide.addText(r.num, {
      x: 0.85, y: y + 0.2, w: 0.9, h: 0.6,
      fontFace: FONT_TITLE, fontSize: 26, color: COLOR.crimson, bold: true, margin: 0
    });
    slide.addText(r.title, {
      x: 1.9, y: y + 0.15, w: 10.7, h: 0.35,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.ink, bold: true, margin: 0
    });
    slide.addText(r.body, {
      x: 1.9, y: y + 0.5, w: 10.7, h: 0.5,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, margin: 0
    });
  });

  // Recommendation
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 6.1, w: 12.1, h: 0.9,
    fill: { color: COLOR.cream }, line: { color: "FFFFFF", width: 0 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 6.1, w: 0.08, h: 0.9,
    fill: { color: COLOR.crimson }, line: { color: COLOR.crimson, width: 0 }
  });
  slide.addText([
    { text: "我々の推奨：", options: { color: COLOR.crimson, bold: true, fontSize: 14 } },
    { text: " NO（明確に）", options: { color: COLOR.crimson, bold: true, fontSize: 16, breakLine: true } },
    { text: "Anuaへの対抗策は「同じ土俵で戦う」のではなく、", options: { color: COLOR.text, fontSize: 11 } },
    { text: "「Anuaが入れない土俵を強化する」", options: { color: COLOR.text, fontSize: 11, bold: true } },
    { text: "こと。日本産植物原料のジオグラフィカル・オリジン強化、日本人研究員のストーリー化、MONOQROME型編集発信、地域パートナーシップ拡張の4点に投資集中。", options: { color: COLOR.text, fontSize: 11 } }
  ], {
    x: 0.85, y: 6.2, w: 11.8, h: 0.75, margin: 0,
    fontFace: FONT_BODY
  });

  addFooter(slide, 17, 22);
}

// =========================================================
// SLIDE 18: Decision 3
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 4  ／  3つの最重要意思決定");
  addTitle(slide, "意思決定③  Nラボの「実体化」へ投資するか",
           "可視化から実体化へ — 制度として体重を載せる経営判断");

  // Visualization vs Embodiment comparison table
  const nraboData = [
    [
      { text: "項目", options: { bold: true, fill: { color: COLOR.navy }, color: COLOR.white, align: "center" } },
      { text: "可視化(前号提案)", options: { bold: true, fill: { color: "EFEFEF" }, color: COLOR.text, align: "center" } },
      { text: "実体化(本号提案)", options: { bold: true, fill: { color: COLOR.forest }, color: COLOR.white, align: "center" } }
    ],
    [
      { text: "発信内容", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "研究員のストーリー・処方背景の編集発信", options: {} },
      { text: "研究員数・論文数・特許出願数・大学連携数の制度的開示", options: { bold: true, color: COLOR.forest } }
    ],
    [
      { text: "組織設計", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "既存の外部スペシャリスト連携の活用", options: {} },
      { text: "Nラボ専属研究員ポジションの正式設置、3-5年契約での外部研究者招聘", options: { bold: true, color: COLOR.forest } }
    ],
    [
      { text: "対外連携", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "テクノーブル等既存パートナーとのコンテンツ協業", options: {} },
      { text: "国内大学(皮膚科学・植物学領域)との共同研究契約、論文共著", options: { bold: true, color: COLOR.forest } }
    ],
    [
      { text: "時間軸", options: { bold: true, fill: { color: "F8F8F8" } } },
      { text: "3ヶ月で発信開始", options: {} },
      { text: "6-18ヶ月で制度構築、3-5年で評価対象に", options: { bold: true, color: COLOR.forest } }
    ]
  ];

  slide.addTable(nraboData, {
    x: 0.6, y: 2.05, w: 12.1, h: 3.3,
    colW: [2.0, 4.6, 5.5],
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, valign: "middle",
    border: { type: "solid", pt: 0.5, color: "DDDDDD" }
  });

  // Recommendation
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.55, w: 12.1, h: 1.45,
    fill: { color: "EDF4EF" }, line: { color: "FFFFFF", width: 0 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.55, w: 0.08, h: 1.45,
    fill: { color: COLOR.forest }, line: { color: COLOR.forest, width: 0 }
  });

  slide.addText([
    { text: "我々の推奨：", options: { color: COLOR.forest, bold: true, fontSize: 14 } },
    { text: " YES（全面的に）", options: { color: COLOR.forest, bold: true, fontSize: 16 } }
  ], {
    x: 0.85, y: 5.7, w: 11.6, h: 0.4,
    fontFace: FONT_BODY, margin: 0
  });

  slide.addText("Nラボの実体化は、Our Thesis(ポストダーマコスメ戦略)の中核資産となる。2030年の自然回帰局面で「自然由来×サイエンス」を主張できるブランドは限定的であり、その時点で「制度として根拠を持つ開発組織」を10年間積み上げてきたブランドは、ほぼN organic独占となり得る。これは資生堂・カネボウのダーマ訴求を凌駕する独自資産となる。", {
    x: 0.85, y: 6.15, w: 11.6, h: 0.8,
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.text, margin: 0
  });

  addFooter(slide, 18, 22);
}

// =========================================================
// SLIDE 19: Section divider 第5部
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.crimsonDk };

  slide.addText("PART 5", {
    x: 0.85, y: 2.5, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 14, color: "F0D0D0", bold: true, charSpacing: 8, margin: 0
  });
  slide.addText("第5部　Uncomfortable Truths", {
    x: 0.85, y: 3.05, w: 11, h: 1.0,
    fontFace: FONT_TITLE, fontSize: 44, color: "FFFFFF", bold: true, margin: 0
  });
  slide.addText("直面すべき5つの事実", {
    x: 0.85, y: 4.0, w: 11, h: 0.5,
    fontFace: FONT_BODY, fontSize: 20, color: "F0D0D0", italic: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.85, y: 4.7, w: 3.0, h: 0,
    line: { color: COLOR.gold, width: 2.5 }
  });
  slide.addText("クライアントが見ようとしない事実を、定量的かつ明示的に提示することは、コンサルファームの責務である。", {
    x: 0.85, y: 5.0, w: 11, h: 0.6,
    fontFace: FONT_BODY, fontSize: 14, color: "F0D0D0", italic: true, margin: 0
  });
}

// =========================================================
// SLIDE 20: 5 Uncomfortable Truths
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 5  ／  Uncomfortable Truths");
  addTitle(slide, "直面すべき5つの不都合な事実",
           "経営アジェンダの前提条件として整理する");

  const truths = [
    { n: "01", t: "「ありのまま」と「闘う」の戦略的緊張",
      b: "2024リブランディングの「ありのまま」と2026 Sミルクの「闘う」「肌の炎上を知らない」は、ブランドポジション上の戦略的緊張関係。コアファンの認知不協和が2026年後半に顕在化する可能性。" },
    { n: "02", t: "@cosme評価の絶対水準",
      b: "N organic主要商品の@cosmeクチコミ評価は4.9-5.4。業界トップ水準(5.5+)には未到達。リブランディング旗艦のSミルクが4.9に留まることは、コミュニケーションと製品実感のギャップを示唆。" },
    { n: "03", t: "シロク事業のCA内部での優先度",
      b: "シロク社の財務指標は親会社CA(連結7,000億円超)から見ると小規模。Nラボへの大規模R&D投資・ブランド資産投資の予算確保は、戦略的シナジー(CA媒体活用、D2C知見横展開、海外展開可能性)の言語化が前提。" },
    { n: "04", t: "N organicの「ラグジュアリー化」上限",
      b: "Plenum(クリーム9,240円)が示すラグジュアリー化は、SHIRO/THREE等やPlenum価格帯で構造的に頭打ち。1万円超の単価帯は、デパコス系(クレ・ド・ポー、HABA等)のヘリテージ領域で勝負が決まる。N organicがこの領域で勝つ可能性は低い。" },
    { n: "05", t: "Anuaの「学習速度」に勝てない構造",
      b: "Anuaは2024年10月の日本版CM開始から1年で売上100億円突破。N organicが累計9年で到達した規模を、Anuaは2年弱で達成。「速度」で勝つ戦略は現実的でない — だからこそOur Thesis(時間軸を逆手に取る戦略)が経済的合理性を持つ。" }
  ];

  truths.forEach((t, i) => {
    const y = 2.0 + i * 1.0;
    slide.addText(t.n, {
      x: 0.6, y, w: 0.8, h: 0.5,
      fontFace: FONT_TITLE, fontSize: 22, color: COLOR.crimson, bold: true, margin: 0
    });
    slide.addText("Truth " + t.n + " — " + t.t, {
      x: 1.45, y, w: 11.2, h: 0.35,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.ink, bold: true, margin: 0
    });
    slide.addText(t.b, {
      x: 1.45, y: y + 0.35, w: 11.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0
    });
  });

  addFooter(slide, 20, 22);
}

// =========================================================
// SLIDE 21: Risk matrix & monitoring
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "PART 6  ／  リスク・モニタリング");
  addTitle(slide, "リスクマトリクスと次月モニタリング指標",
           "前号からの差分を中心に評価更新");

  // Risk table
  const riskData = [
    [
      { text: "リスク要因", options: { bold: true, fill: { color: COLOR.navy }, color: COLOR.white, align: "center" } },
      { text: "前号", options: { bold: true, fill: { color: "EFEFEF" }, color: COLOR.text, align: "center" } },
      { text: "本号", options: { bold: true, fill: { color: "EFEFEF" }, color: COLOR.text, align: "center" } },
      { text: "根拠", options: { bold: true, fill: { color: "EFEFEF" }, color: COLOR.text, align: "center" } }
    ],
    [
      { text: "Anuaの直接競合化", options: { bold: true } },
      { text: "高", options: { align: "center" } },
      { text: "極めて高", options: { align: "center", bold: true, color: COLOR.crimson } },
      { text: "100億円突破・N organic同等規模・同顧客層", options: {} }
    ],
    [
      { text: "ダーマコスメ大手の参入", options: { bold: true } },
      { text: "高", options: { align: "center" } },
      { text: "中→高", options: { align: "center", bold: true, color: COLOR.gold } },
      { text: "2026年が本格化元年、ターゲット顧客は部分重複", options: {} }
    ],
    [
      { text: "自然派セグメント減速", options: { bold: true } },
      { text: "中", options: { align: "center" } },
      { text: "中", options: { align: "center" } },
      { text: "+3.1%継続、Our Thesisで好機転換可能", options: {} }
    ],
    [
      { text: "「闘う」訴求と認知不協和", options: { bold: true } },
      { text: "中", options: { align: "center" } },
      { text: "中→高", options: { align: "center", bold: true, color: COLOR.crimson } },
      { text: "Sミルク@cosme評価4.9点が示唆", options: {} }
    ],
    [
      { text: "CA内部での事業優先度", options: { bold: true } },
      { text: "非評価", options: { align: "center" } },
      { text: "中", options: { align: "center", bold: true, color: COLOR.gold } },
      { text: "Nラボ実体化への投資承認が経営課題化", options: {} }
    ]
  ];

  slide.addTable(riskData, {
    x: 0.6, y: 2.05, w: 7.5, h: 3.3,
    colW: [2.4, 0.9, 0.9, 3.3],
    fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, valign: "middle",
    border: { type: "solid", pt: 0.5, color: "DDDDDD" }
  });

  // Right: monitoring indicators
  slide.addText("次月モニタリング指標", {
    x: 8.4, y: 2.05, w: 4.3, h: 0.35,
    fontFace: FONT_BODY, fontSize: 14, color: COLOR.ink, bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 8.4, y: 2.45, w: 0.5, h: 0,
    line: { color: COLOR.navy, width: 2 }
  });

  const monitors = [
    "Anua / 魔女工場 / numbuzin の @cosme評価・件数推移",
    "Sミルク @cosme評価点推移 (4.9点からの変動)",
    "ドラッグストア棚配分 (マツキヨ / ウエルシア / ツルハ)",
    "資生堂・カネボウ・コーセー 2026夏ダーマ訴求GRP",
    "@cosme「日本プライドコスメ」キーワード言及量",
    "MFDS 2025年化粧品輸出統計 (日本向けK-Beauty規模)"
  ];

  monitors.forEach((m, i) => {
    slide.addText("•　" + m, {
      x: 8.4, y: 2.65 + i * 0.45, w: 4.3, h: 0.4,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0
    });
  });

  // Next issue preview
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.6, w: 12.1, h: 1.4,
    fill: { color: COLOR.cream }, line: { color: "FFFFFF", width: 0 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.6, w: 0.08, h: 1.4,
    fill: { color: COLOR.navy }, line: { color: COLOR.navy, width: 0 }
  });
  slide.addText("次号予告 — 2026年6月号 (H1 2026 中間総括号)", {
    x: 0.85, y: 5.7, w: 11.6, h: 0.4,
    fontFace: FONT_BODY, fontSize: 13, color: COLOR.navy, bold: true, margin: 0
  });
  slide.addText([
    { text: "•  Sミルクの市場反応3ヶ月評価 (@cosme・SNS・PR・店頭シェア)", options: { breakLine: true } },
    { text: "•  Our Thesis 先行指標A・B・C 6月実績", options: { breakLine: true } },
    { text: "•  意思決定①の実装ロードマップ提示 (Vie・Bright・Plenum向け訴求言語体系)", options: { breakLine: true } },
    { text: "•  意思決定③のNラボ実体化計画 具体ドラフト", options: {} }
  ], {
    x: 0.85, y: 6.1, w: 11.6, h: 0.85,
    fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0
  });

  addFooter(slide, 21, 22);
}

// =========================================================
// SLIDE 22: Appendix - Sources
// =========================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLOR.white };

  addSectionTag(slide, "APPENDIX  ／  データソース一覧");
  addTitle(slide, "データソース",
           "本号で参照した公開情報の出典 — 内部財務・KPIデータは非含有");

  // Left column - market data
  slide.addText("市場・業界データ", {
    x: 0.6, y: 2.0, w: 6.0, h: 0.35,
    fontFace: FONT_BODY, fontSize: 13, color: COLOR.navy, bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.6, y: 2.4, w: 0.5, h: 0,
    line: { color: COLOR.navy, width: 1.5 }
  });

  const marketSources = [
    "矢野経済研究所「化粧品市場調査」2025年版、「自然派・オーガニック化粧品市場」2024年度(1,835億円)",
    "富士経済「スキンケア化粧品マーケティング要覧」2025年版(1兆4,624億円)",
    "IMARC Group「日本のスキンケア市場 2026-2034」「医薬部外品スキンケア」(CAGR 8.35%)",
    "The Business Research Company「Dermocosmetics Global Market Report 2026」(CAGR 9.7%)",
    "インテージ「韓国コスメ市場分析」2024-2025(5年で6倍)",
    "週刊粧業「The Founders『Anua』、『Qoo10』を軸に日本で急成長」2025年3月24日号",
    "週刊粧業「グローバル・ダーマ覇権戦略」2026年1月号",
    "eBay Japan「Qoo10 MEGA BEAUTY AWARDS 2025」(61万票投票)",
    "WWDJAPAN「2026年国内ビューティの展望」2026年1月号",
    "The Founders JAPAN「20-30代女性スキンケア意識調査」2026年1月(N=1,054)",
    "Bain & Company カン・ジチョル氏講演 (Qoo10 K-Beauty Conference 2025)",
    "@cosme トレンド予測部「2026年上半期ネクストトレンドキーワード」",
    "Strategy& (PwC)「6つの価値観セグメント」2024年版"
  ];

  marketSources.forEach((s, i) => {
    slide.addText("•  " + s, {
      x: 0.6, y: 2.55 + i * 0.32, w: 6.2, h: 0.3,
      fontFace: FONT_BODY, fontSize: 9.5, color: COLOR.text, margin: 0
    });
  });

  // Right column - N organic public info
  slide.addText("N organic / シロク公開情報", {
    x: 7.0, y: 2.0, w: 5.7, h: 0.35,
    fontFace: FONT_BODY, fontSize: 13, color: COLOR.navy, bold: true, margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: 7.0, y: 2.4, w: 0.5, h: 0,
    line: { color: COLOR.navy, width: 1.5 }
  });

  const norgSources = [
    "シロク社プレスリリース「N organicブランドリニューアル発表」2024年6月11日",
    "N organic公式サイト sirok.jp (製品情報・コンセプト・会員数)",
    "Sミルク新CM・新製品プレスリリース 2026年4月3日",
    "Sミルク特設サイト sirok.jp/special/basic_milk_2026",
    "@cosme N organicブランドページ (クチコミ件数・評価点)",
    "Anua @cosme ブランドページ、Qoo10公式ショップ",
    "業界推計：N organic売上規模 (独立推計・複数業界コメントの統合)",
    "シロク社決算情報 (2019年9月期純利益6.2億円)"
  ];

  norgSources.forEach((s, i) => {
    slide.addText("•  " + s, {
      x: 7.0, y: 2.55 + i * 0.36, w: 5.7, h: 0.32,
      fontFace: FONT_BODY, fontSize: 9.5, color: COLOR.text, margin: 0
    });
  });

  // Closing line
  slide.addShape(pres.shapes.LINE, {
    x: 7.0, y: 5.55, w: 5.7, h: 0,
    line: { color: COLOR.divider, width: 0.5 }
  });
  slide.addText("情報基準について", {
    x: 7.0, y: 5.7, w: 5.7, h: 0.3,
    fontFace: FONT_BODY, fontSize: 11, color: COLOR.navy, bold: true, margin: 0
  });
  slide.addText("本レポートは戦略コンサルファームとしての客観性を確保するため、公開情報のみに基づいて構成。クライアント内部の財務・KPIデータは非含有。内部実績との突き合わせ評価は、別途実施可能。", {
    x: 7.0, y: 6.0, w: 5.7, h: 1.0,
    fontFace: FONT_BODY, fontSize: 9.5, color: COLOR.textMuted, italic: true, margin: 0
  });

  addFooter(slide, 22, 22);
}

// =========================================================
// Save
// =========================================================
pres.writeFile({ fileName: "/mnt/user-data/outputs/N_organic_戦略市場モニタリング_2026年5月号_Tier1.pptx" })
  .then(name => console.log("Deck created: " + name));
