// =============================================================================
// N organic 戦略市場モニタリング Issue No.06 — August 2026
// =============================================================================
// node skills/n-organic-monthly-monitor/scripts/generate_deck_current.js
// =============================================================================

const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "../../../output/n-organic-2026-08");
const CHART_DIR  = path.resolve(__dirname, "../../../output/n-organic-2026-08");

const COLOR = {
  navy: "1F3A6B", navyDark: "152849", ink: "0D1B2E",
  cream: "F7F2E8", paper: "FAFAFA", white: "FFFFFF",
  crimson: "B53F3F", crimsonDk: "8A2E2E",
  forest: "2F5F47", forestDk: "1F3F30",
  gold: "9C7B3A", text: "1A1A1A",
  textMuted: "6B6B6B", textLight: "9A9A9A",
  divider: "D8CDB8", shade: "EEE7D6"
};
const FONT_TITLE = "Yu Mincho";
const FONT_BODY  = "Yu Gothic";
const W = 13.33, H = 7.5;
const ISSUE = "06", MONTH_JP = "8月号", MONTH_EN = "August 2026";
const TOTAL_SLIDES = 26;

function makeDeck(isInternal) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Strategy Advisory";
  pres.title = `N organic 戦略市場モニタリング 2026年8月号${isInternal ? " [INTERNAL]" : " [EXTERNAL]"}`;

  function addFooter(slide, n) {
    slide.addShape(pres.shapes.LINE, {
      x: 0.6, y: 7.1, w: 12.1, h: 0,
      line: { color: COLOR.divider, width: 0.5 }
    });
    slide.addText(`N organic Strategic Market Monitor  |  Issue ${ISSUE}  |  ${MONTH_EN}`, {
      x: 0.6, y: 7.15, w: 8, h: 0.3,
      fontFace: FONT_BODY, fontSize: 9, color: COLOR.textLight, italic: true
    });
    slide.addText(`${n} / ${TOTAL_SLIDES}`, {
      x: 12.0, y: 7.15, w: 0.7, h: 0.3,
      fontFace: FONT_BODY, fontSize: 9, color: COLOR.textLight, align: "right"
    });
  }

  function addSectionTag(slide, text) {
    slide.addText(text, {
      x: 0.6, y: 0.35, w: 12.1, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, color: COLOR.navy, bold: true, charSpacing: 4
    });
  }

  function addTitle(slide, title, subtitle) {
    slide.addText(title, {
      x: 0.6, y: 0.75, w: 12.1, h: 0.7,
      fontFace: FONT_TITLE, fontSize: 28, color: COLOR.ink, bold: true, margin: 0
    });
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.6, y: 1.45, w: 12.1, h: 0.4,
        fontFace: FONT_BODY, fontSize: 13, color: COLOR.textMuted, italic: true, margin: 0
      });
    }
  }

  function addCallout(slide, label, body, x, y, w, h, accent = COLOR.navy) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: accent === COLOR.crimson ? "FCEEEE" :
              accent === COLOR.forest ? "EDF4EF" :
              accent === COLOR.gold ? "FBF6EC" : "F0F3F8" },
      line: { color: "FFFFFF", width: 0 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.08, h,
      fill: { color: accent }, line: { color: accent, width: 0 }
    });
    slide.addText(label, {
      x: x + 0.25, y: y + 0.12, w: w - 0.4, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, color: accent, bold: true, charSpacing: 2, margin: 0
    });
    slide.addText(body, {
      x: x + 0.25, y: y + 0.45, w: w - 0.4, h: h - 0.55,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.ink, margin: 0, paraSpaceAfter: 3, valign: "top"
    });
  }

  function addConfidentialHeader(slide) {
    slide.addText("CONFIDENTIAL — INTERNAL USE ONLY", {
      x: 8.5, y: 0.12, w: 4.5, h: 0.25,
      fontFace: FONT_BODY, fontSize: 7.5, color: COLOR.crimson,
      bold: true, align: "right"
    });
  }

  // =========================================================
  // SLIDE 1: Cover
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.cream };
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.25, h: H,
      fill: { color: COLOR.navy }, line: { color: COLOR.navy, width: 0 }
    });
    s.addText("MONTHLY STRATEGIC MARKET MONITOR", {
      x: 0.85, y: 1.0, w: 11, h: 0.3,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.navy, bold: true, charSpacing: 6, margin: 0
    });
    s.addText(`Issue No. ${ISSUE}  /  ${MONTH_EN}`, {
      x: 0.85, y: 1.35, w: 11, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, color: COLOR.textMuted, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 0.85, y: 1.85, w: 3.0, h: 0,
      line: { color: COLOR.navy, width: 2 }
    });
    s.addText("N organic", {
      x: 0.85, y: 2.4, w: 11, h: 1.0,
      fontFace: FONT_TITLE, fontSize: 56, color: COLOR.ink, bold: true, margin: 0
    });
    s.addText("戦略市場モニタリング", {
      x: 0.85, y: 3.5, w: 11, h: 0.8,
      fontFace: FONT_TITLE, fontSize: 36, color: COLOR.navy, margin: 0
    });
    s.addText("メガ割最大戦場化が問う「処方の固有性」—— ブランド転換への最後の外圧", {
      x: 0.85, y: 4.5, w: 11, h: 0.5,
      fontFace: FONT_BODY, fontSize: 16, color: COLOR.text, margin: 0
    });
    s.addText("Mega Sale Battlefield: The Last Pressure to Shift from Category to Brand", {
      x: 0.85, y: 5.0, w: 11, h: 0.4,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.textMuted, italic: true, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 0.85, y: 6.4, w: 11.6, h: 0,
      line: { color: COLOR.divider, width: 0.5 }
    });
    s.addText([
      { text: "提出先　　　", options: { color: COLOR.textMuted, bold: true } },
      { text: "株式会社シロク　N organicブランドチーム", options: { color: COLOR.text, breakLine: true } },
      { text: "発行日　　　", options: { color: COLOR.textMuted, bold: true } },
      { text: "2026年8月15日", options: { color: COLOR.text, breakLine: true } },
      { text: "情報基準　　", options: { color: COLOR.textMuted, bold: true } },
      { text: isInternal ? "Layer 1（公開情報）+ Layer 2（内部KPI — 経営会議議事録）" : "公開情報のみ（内部KPIは別冊社内版参照）", options: { color: COLOR.text, breakLine: true } },
      { text: "守秘区分　　", options: { color: COLOR.textMuted, bold: true } },
      { text: isInternal ? "Strictly Confidential — INTERNAL ONLY" : "Strictly Confidential", options: { color: COLOR.text } }
    ], {
      x: 0.85, y: 6.55, w: 11.6, h: 0.85,
      fontFace: FONT_BODY, fontSize: 10, margin: 0
    });
    addFooter(s, 1);
  }

  // =========================================================
  // SLIDE 2: Executive Summary
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "エグゼクティブ・サマリー  ／  EXECUTIVE SUMMARY");
    addTitle(s, "Our Thesis：メガ割依存の市場構造がN organicの「見えなさ」を加速する",
             "経営陣意思決定者向け 1ページ要約 — 詳細は本編各章を参照");

    addCallout(s,
      "OUR THESIS  (Issue 06 / August 2026)",
      "Qoo10第3回メガ割（8/28〜）が日韓コスメの最大戦場となる8月において、N organicはメガ割型バイヤーとの価格競争に引き込まれるリスクを抱えている。しかしこの外圧は同時に、「処方の固有性」で戦えるブランドへの転換を迫る最後の好機でもある。第一三共ブライトエイジ プレミアムの参入（6月）が医薬部外品VCを「コモディティ化の入口」に押し込んでいる今、N organicが投資すべきは成分スペックではなく「なぜN organicでなければならないか」を語る体験資産だ。",
      0.6, 1.95, 12.1, 1.35, COLOR.navy);

    s.addText("市場の現実 — 3つの不都合な事実", {
      x: 0.6, y: 3.5, w: 12.1, h: 0.35,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.text, bold: true, margin: 0
    });

    const facts = [
      { num: "01", title: "製薬大手の医薬部外品参入加速",
        body: "第一三共ブライトエイジ ホワイト プレミアム（6/11発売）が史上最高配合で参入。N organicの「医薬部外品CICA×VC」の希少性が消滅しつつある。",
        src: "第一三共ヘルスケアダイレクト プレスリリース 2026/6/1" },
      { num: "02", title: "Qoo10メガ割で韓国コスメが市場制圧",
        body: "8/28〜第3回メガ割でAnuaを筆頭に韓国コスメが上位独占予測。N organicはメガ割非対応のプレミアムとして「見えなくなる」リスクが8月に最大化する。",
        src: "pricey.jp / BAILA 2026年8月メガ割予測" },
      { num: "03", title: "自然派市場はダーマコスメの3分の1の成長速度",
        body: "オーガニック化粧品CAGR5.1% vs ダーマコスメCAGR9.6%。N organicが最も得意とする市場セグメントが最も遅い成長速度にある構造的不利が継続。",
        src: "KDマーケットインサイツ / TBRC 2026年最新版" }
    ];

    facts.forEach((f, i) => {
      const x = 0.6 + i * 4.07;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.9, w: 3.87, h: 1.55,
        fill: { color: COLOR.shade }, line: { color: "FFFFFF", width: 0 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.9, w: 3.87, h: 0.05,
        fill: { color: COLOR.crimson }, line: { color: COLOR.crimson, width: 0 }
      });
      s.addText(f.num, {
        x: x + 0.15, y: 4.0, w: 0.65, h: 0.32,
        fontFace: FONT_TITLE, fontSize: 14, color: COLOR.crimson, bold: true, margin: 0
      });
      s.addText(f.title, {
        x: x + 0.75, y: 3.97, w: 2.95, h: 0.35,
        fontFace: FONT_BODY, fontSize: 11, color: COLOR.ink, bold: true, margin: 0
      });
      s.addText(f.body, {
        x: x + 0.15, y: 4.37, w: 3.6, h: 0.82,
        fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, margin: 0, paraSpaceAfter: 2
      });
      s.addText("出典：" + f.src, {
        x: x + 0.15, y: 5.22, w: 3.6, h: 0.18,
        fontFace: FONT_BODY, fontSize: 8, color: COLOR.textLight, italic: true, margin: 0
      });
    });

    s.addText("今月の3つの最重要意思決定", {
      x: 0.6, y: 5.55, w: 12.1, h: 0.3,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.text, bold: true, margin: 0
    });

    const decisions = [
      { topic: "①Qoo10メガ割期間のN organic戦略設計", rec: "YES（差別化設計）", color: COLOR.forest },
      { topic: "②医薬部外品VCポジション継続 vs 処方転換", rec: "条件付きYES（併走）", color: COLOR.gold },
      { topic: "③秋以降のブランド体験投資の先行着手", rec: "YES（今すぐ着手）", color: COLOR.forest }
    ];

    const rows = [
      ["論点", "推奨", "根拠（要旨）"],
      ...decisions.map(d => [d.topic, d.rec, ""])
    ];
    s.addTable(rows, {
      x: 0.6, y: 5.9, w: 12.1, h: 1.05,
      fontFace: FONT_BODY, fontSize: 10, colW: [4.8, 2.0, 5.3],
      border: { pt: 0.5, color: COLOR.divider },
      color: COLOR.text
    });

    addFooter(s, 2);
  }

  // =========================================================
  // SLIDE 3: Part 1 Divider
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.navy };
    s.addText("PART 1", {
      x: 0.85, y: 1.8, w: 11, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.white, bold: true, charSpacing: 10, margin: 0
    });
    s.addText("第1部　市場の構造的劣後", {
      x: 0.85, y: 2.4, w: 11, h: 1.1,
      fontFace: FONT_TITLE, fontSize: 44, color: COLOR.white, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 0.85, y: 3.7, w: 3.0, h: 0,
      line: { color: COLOR.gold, width: 3 }
    });
    s.addText("N organicが立つ自然派市場は、スキンケア全体・医薬部外品・ダーマコスメの全カテゴリーに成長率で劣後する構造的不利を抱えている", {
      x: 0.85, y: 4.0, w: 10, h: 0.6,
      fontFace: FONT_BODY, fontSize: 16, color: COLOR.white, italic: true, margin: 0
    });
    addFooter(s, 3);
  }

  // =========================================================
  // SLIDE 4: 市場成長率比較（図表1）
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 1  ／  市場構造分析");
    addTitle(s, "【図表1】N organic主戦場の構造的劣後",
             "4セグメント成長率比較 — 自然派はすべての競合市場に成長率で劣後する");

    s.addImage({
      path: path.join(CHART_DIR, "chart1_market_growth.png"),
      x: 0.5, y: 1.8, w: 7.8, h: 4.8
    });

    const insights = [
      { color: COLOR.crimson, label: "事実", text: "自然派CAGR5.1%（2025-2035 KDマーケット）。ダーマコスメ9.6%の約半分の成長速度。" },
      { color: COLOR.navy, label: "解釈", text: "N organicの主戦場は市場構造として不利。競合カテゴリーは2倍近い勢いで成長中。" },
      { color: COLOR.gold, label: "示唆", text: "8月のメガ割でK-beautyが席巻する間、N organicは「市場の外」で別の勝ち方を設計すべきだ。" }
    ];

    s.addText("数値が示すこと", {
      x: 8.8, y: 1.85, w: 4.3, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.ink, bold: true, margin: 0
    });

    insights.forEach((ins, i) => {
      const y = 2.35 + i * 1.35;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 8.7, y, w: 4.3, h: 1.15,
        fill: { color: COLOR.shade }, line: { color: "FFFFFF", width: 0 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 8.7, y, w: 0.07, h: 1.15,
        fill: { color: ins.color }, line: { color: ins.color, width: 0 }
      });
      s.addText(ins.label, {
        x: 8.95, y: y + 0.08, w: 1.2, h: 0.28,
        fontFace: FONT_BODY, fontSize: 10, color: ins.color, bold: true, margin: 0
      });
      s.addText(ins.text, {
        x: 8.95, y: y + 0.38, w: 3.85, h: 0.68,
        fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, margin: 0
      });
    });

    addCallout(s, "8月の戦略的含意",
      "Qoo10メガ割（8/28〜）はダーマコスメ・K-beautyが最も集客する期間。N organicが同一市場で価格競争に参加しても埋もれる。メガ割「外」で指名検索を維持するコンテンツ戦略が8月の核心だ。",
      0.5, 6.55, 12.3, 0.7, COLOR.gold);
    addFooter(s, 4);
  }

  // =========================================================
  // SLIDE 5: 消費者の成分迷子 / 8月のSNSトレンド
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 1  ／  消費者インサイト");
    addTitle(s, "2026年夏の消費者：「透明感×リアルスキンケアグロウ」への移行",
             "成分リテラシーは高いが選択疲れが発生 — N organicへの含意");

    const insights = [
      {
        title: "TikTokトレンド：リアルスキンケアグロウ",
        body: "「パール系ツヤ」から「スキンケアで作るナチュラルな発光肌」へ転換。過剰な成分訴求より「使い続けた結果の素肌感」が評価される。N organicの自然主義ポジションと整合するが、コンテンツで伝えられていない。",
        color: COLOR.navy
      },
      {
        title: "@cosme 2026上半期トレンド：「手応え×やさしさ」",
        body: "2026年上半期ベストコスメ（5/20発表）は「待望のリニューアルを遂げた名品化粧水」「高機能日焼け止め」が受賞。N organic Sミルクとスペック整合するが、受賞・露出の確認は取れていない。",
        color: COLOR.gold
      },
      {
        title: "メガ割消費者：「まとめ買い×成分比較」型",
        body: "Qoo10メガ割消費者は20%OFFクーポンを前提にリスト化して購買する計画型。N organicはプレミアムEC主体でメガ割対応なし。この層は基本的にN organicの顧客にならない — ターゲットから外す判断が必要。",
        color: COLOR.crimson
      }
    ];

    insights.forEach((ins, i) => {
      const y = 1.9 + i * 1.55;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y, w: 12.3, h: 1.35,
        fill: { color: i % 2 === 0 ? COLOR.shade : COLOR.paper },
        line: { color: "FFFFFF", width: 0 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y, w: 0.08, h: 1.35,
        fill: { color: ins.color }, line: { color: ins.color, width: 0 }
      });
      s.addText(ins.title, {
        x: 0.75, y: y + 0.12, w: 11.8, h: 0.35,
        fontFace: FONT_BODY, fontSize: 12, color: COLOR.ink, bold: true, margin: 0
      });
      s.addText(ins.body, {
        x: 0.75, y: y + 0.5, w: 11.8, h: 0.75,
        fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0
      });
    });

    addCallout(s, "N organicへの含意",
      "「リアルスキンケアグロウ」トレンドはN organicの世界観と一致する。しかしコンテンツでそれを語れているか？ TikTok・Instagramで「植物×ナチュラル発光」を体験的に見せるコンテンツが今最も機能する土壌にある。",
      0.5, 6.6, 12.3, 0.65, COLOR.forest);
    addFooter(s, 5);
  }

  // =========================================================
  // SLIDE 6: Part 2 Divider
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.navyDark };
    s.addText("PART 2", {
      x: 0.85, y: 1.8, w: 11, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.white, bold: true, charSpacing: 10, margin: 0
    });
    s.addText("第2部　競合の動き", {
      x: 0.85, y: 2.4, w: 11, h: 1.1,
      fontFace: FONT_TITLE, fontSize: 44, color: COLOR.white, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 0.85, y: 3.7, w: 3.0, h: 0,
      line: { color: COLOR.gold, width: 3 }
    });
    s.addText("Anuaの攻勢継続、製薬大手の本格参入、Qoo10メガ割の構造化 — N organicを取り巻く3つの競合圧力", {
      x: 0.85, y: 4.0, w: 10, h: 0.6,
      fontFace: FONT_BODY, fontSize: 16, color: COLOR.white, italic: true, margin: 0
    });
    addFooter(s, 6);
  }

  // =========================================================
  // SLIDE 7: Anua + ブライトエイジ Big Stats
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 2  ／  競合脅威");
    addTitle(s, "2026年8月の競合構図：3方向からの同時圧力",
             "Anua（K-Beauty）/ 第一三共ブライトエイジ（製薬）/ Qoo10（チャネル）");

    const stats = [
      { num: "100億円+", label: "Anua 日本売上 FY2024", sub: "前年比3倍超、秋2026新製品攻勢中", color: COLOR.crimson },
      { num: "6/11", label: "ブライトエイジ プレミアム発売", sub: "第一三共ヘルスケア 史上最高配合で美白市場参入", color: COLOR.navy },
      { num: "8/28〜", label: "Qoo10第3回メガ割", sub: "9/9まで。韓国コスメが毎回上位独占。N organicは非参戦", color: COLOR.gold }
    ];

    stats.forEach((st, i) => {
      const x = 0.5 + i * 4.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.0, w: 3.9, h: 2.5,
        fill: { color: st.color === COLOR.crimson ? "FCEEEE" : st.color === COLOR.gold ? "FBF6EC" : "F0F3F8" },
        line: { color: "FFFFFF", width: 0 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.0, w: 3.9, h: 0.1,
        fill: { color: st.color }, line: { color: st.color, width: 0 }
      });
      s.addText(st.num, {
        x: x + 0.2, y: 2.25, w: 3.5, h: 0.85,
        fontFace: FONT_TITLE, fontSize: 36, color: st.color, bold: true, margin: 0
      });
      s.addText(st.label, {
        x: x + 0.2, y: 3.15, w: 3.5, h: 0.38,
        fontFace: FONT_BODY, fontSize: 13, color: COLOR.ink, bold: true, margin: 0
      });
      s.addText(st.sub, {
        x: x + 0.2, y: 3.55, w: 3.5, h: 0.7,
        fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.textMuted, margin: 0
      });
    });

    const analyses = [
      { title: "Anua脅威：秋2026新製品でさらに攻勢", body: "PDRN・アゼライン酸・BHA等の新成分トナーを継続投入。Qoo10×@cosmeを制する戦略を継続。N organicの成分訴求はAnuaとの直接対決になる。" },
      { title: "製薬大手：医薬部外品をコモディティ化", body: "ブライトエイジ プレミアム参入でVC美白の医薬部外品が「珍しくない」市場に。N organicのSミルク差別化が2027年以降さらに困難になる。" },
      { title: "Qoo10：チャネル独占が消費者動線を変える", body: "メガ割期に韓国コスメ以外は「選ばれない」消費者動線が定着しつつある。N organicのEC主力チャネル（自社・Amazon）との競合が激化。" }
    ];

    analyses.forEach((a, i) => {
      const y = 4.72 + i * 0.65;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 12.3, h: 0.58, fill: { color: COLOR.shade }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.07, h: 0.58, fill: { color: COLOR.crimson }, line: { color: COLOR.crimson, width: 0 } });
      s.addText(a.title, { x: 0.72, y: y + 0.06, w: 3.5, h: 0.25, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.ink, bold: true, margin: 0 });
      s.addText(a.body, { x: 4.3, y: y + 0.06, w: 8.3, h: 0.45, fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, margin: 0 });
    });

    addFooter(s, 7);
  }

  // =========================================================
  // SLIDE 8: 競合ポジショニングマップ（図表2）
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 2  ／  競合分析");
    addTitle(s, "【図表2】競合ポジショニングマップ 2026年8月版",
             "自然派↔機能性 × ボリューム↔プレミアム — Anuaの上方移動が止まらない");

    s.addImage({
      path: path.join(CHART_DIR, "chart2_competitive_map.png"),
      x: 0.5, y: 1.8, w: 7.8, h: 4.8
    });

    const points = [
      { label: "Anuaの動き", body: "K-Beauty大衆×機能性から「自然×機能」プレミアムへ移行中。N organicの正面に迫っている。", color: COLOR.crimson },
      { label: "ブライトエイジの参入", body: "医薬品大手が「機能性プレミアム」帯に強化参入。N organicの医薬部外品VC差別化が希薄化。", color: COLOR.navy },
      { label: "N organicの機会", body: "「自然×プレミアム」の右上象限はまだ空白。ただし今の成分訴求型コンテンツでは侵食できない。", color: COLOR.forest }
    ];

    s.addText("ポジション分析", {
      x: 8.8, y: 1.85, w: 4.3, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.ink, bold: true, margin: 0
    });

    points.forEach((p, i) => {
      const y = 2.35 + i * 1.35;
      s.addShape(pres.shapes.RECTANGLE, { x: 8.7, y, w: 4.3, h: 1.15, fill: { color: COLOR.shade }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 8.7, y, w: 0.07, h: 1.15, fill: { color: p.color }, line: { color: p.color, width: 0 } });
      s.addText(p.label, { x: 8.95, y: y + 0.08, w: 3.85, h: 0.28, fontFace: FONT_BODY, fontSize: 10, color: p.color, bold: true, margin: 0 });
      s.addText(p.body, { x: 8.95, y: y + 0.38, w: 3.85, h: 0.68, fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, margin: 0 });
    });

    addCallout(s, "戦略的含意",
      "AnuaがN organicのポジションに近づいている。成分訴求で競争しても追いつけない。「N organicでなければ体験できないもの」を定義して独自ポジションを堅守する必要がある。",
      0.5, 6.55, 12.3, 0.7, COLOR.gold);
    addFooter(s, 8);
  }

  // =========================================================
  // SLIDE 9: 競合比較表（Anua vs ブライトエイジ vs N organic）
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 2  ／  競合比較");
    addTitle(s, "3者比較：Anua / ブライトエイジ / N organic の戦略軸",
             "8月時点の強み・弱み・N organicへの示唆");

    const compRows = [
      [
        { text: "比較軸", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "Anua（K-Beauty）", options: { bold: true, color: COLOR.white, fill: COLOR.crimson } },
        { text: "ブライトエイジ（製薬）", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "N organic（自然派）", options: { bold: true, color: COLOR.white, fill: COLOR.forest } }
      ],
      ["日本売上規模", "100億円+ FY2024", "推定10〜30億円規模", "非公開（推定15〜30億円規模）"],
      ["主要チャネル", "Qoo10・@cosme・楽天", "楽天・Amazon・薬局", "自社EC・Amazon・@cosme"],
      ["成分訴求力", "PDRN/VC/BHA多品種", "VC最高配合（医薬品）", "CICA×VC（医薬部外品）"],
      ["メガ割依存度", "高（毎回上位）", "中（薬局型）", "低（非参戦）"],
      ["ブランド指名力", "急成長（@cosme席捲）", "第一三共の認知資産", "オーガニック訴求資産"],
      ["2026年の動き", "秋新製品・PDRN拡張", "プレミアム発売（6月）", "Sミルク以降の新製品確認なし"]
    ];

    s.addTable(compRows, {
      x: 0.5, y: 1.95, w: 12.3, h: 4.0,
      fontFace: FONT_BODY, fontSize: 10,
      colW: [2.5, 3.1, 3.1, 3.6],
      border: { pt: 0.5, color: COLOR.divider }
    });

    addCallout(s, "N organicの競合優位の空白",
      "Anuaはスピードとチャネル力で、ブライトエイジは有効成分濃度で勝る。N organicが持つ「植物×処方こだわり×日本生産」の固有性は、現在のマーケティングではほぼ訴求されていない。",
      0.5, 6.1, 12.3, 0.75, COLOR.crimson);
    addFooter(s, 9);
  }

  // =========================================================
  // SLIDE 10: Part 3 Divider (Layer 2 - Internal)
  // =========================================================
  if (isInternal) {
    const s = pres.addSlide();
    s.background = { color: COLOR.crimsonDk };
    addConfidentialHeader(s);
    s.addText("PART 3  —  INTERNAL", {
      x: 0.85, y: 1.8, w: 11, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.white, bold: true, charSpacing: 10, margin: 0
    });
    s.addText("第3部　内部現実との照合", {
      x: 0.85, y: 2.4, w: 11, h: 1.1,
      fontFace: FONT_TITLE, fontSize: 44, color: COLOR.white, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 0.85, y: 3.7, w: 3.0, h: 0,
      line: { color: COLOR.gold, width: 3 }
    });
    s.addText("Layer 1（外部分析）と Layer 2（内部KPI）を重ねて、「市場が見えていないリスク」と「社内が気づいていない変化」を照合する", {
      x: 0.85, y: 4.0, w: 10, h: 0.6,
      fontFace: FONT_BODY, fontSize: 16, color: COLOR.white, italic: true, margin: 0
    });
    s.addText("⚠️ このセクションのデータは経営内部資料です。外部配布禁止。", {
      x: 0.85, y: 5.0, w: 10, h: 0.4,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.gold, bold: true, margin: 0
    });
    addFooter(s, 10);
  } else {
    const s = pres.addSlide();
    s.background = { color: COLOR.shade };
    s.addText("第3部  ／  内部較正（INTERNAL ONLY）", {
      x: 0.5, y: 3.0, w: 12.3, h: 0.8,
      fontFace: FONT_TITLE, fontSize: 32, color: COLOR.textMuted, align: "center", margin: 0
    });
    s.addText("本セクション（スライド10〜13）は経営内部資料のため非掲載。\n内部版（INTERNAL）をご参照ください。", {
      x: 0.5, y: 4.0, w: 12.3, h: 0.7,
      fontFace: FONT_BODY, fontSize: 14, color: COLOR.textLight, align: "center", margin: 0
    });
    addFooter(s, 10);
  }

  // =========================================================
  // SLIDE 11: GAP Dashboard（図表4）Internal only
  // =========================================================
  if (isInternal) {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addConfidentialHeader(s);
    addSectionTag(s, "PART 3  ／  Layer 2  —  外部×内部 GAPダッシュボード（CONFIDENTIAL）");
    addTitle(s, "【図表4】外部期待値 vs 内部実績 GAPダッシュボード",
             "⚠️ 8月号：Google Drive接続エラーにより最新議事録未取得。6月実績（Issue 04）をベースライン使用。要更新。");

    s.addImage({
      path: path.join(CHART_DIR, "chart4_gap_dashboard.png"),
      x: 0.5, y: 1.8, w: 12.2, h: 4.8
    });

    s.addText("※ 2026年8月12日時点でGoogle Drive MCPへのアクセス（read_file_content）が全件エラー。最新議事録（7/28・8/6）のKPI取得不可。上記グラフは6月号（Issue 04）確定値を使用。議事録取得後に更新が必要。", {
      x: 0.5, y: 6.65, w: 12.3, h: 0.38,
      fontFace: FONT_BODY, fontSize: 8.5, color: COLOR.crimson, italic: true, margin: 0
    });

    addFooter(s, 11);
  } else {
    const s = pres.addSlide();
    s.background = { color: COLOR.shade };
    s.addText("本セクションは経営内部資料のため非掲載", {
      x: 0.5, y: 3.3, w: 12.3, h: 0.7,
      fontFace: FONT_TITLE, fontSize: 28, color: COLOR.textMuted, align: "center", margin: 0
    });
    addFooter(s, 11);
  }

  // =========================================================
  // SLIDE 12: KPI 3軸トレンド（Internal）
  // =========================================================
  if (isInternal) {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addConfidentialHeader(s);
    addSectionTag(s, "PART 3  ／  Layer 2  —  KPIトレンド（CONFIDENTIAL）");
    addTitle(s, "KPI 3軸トレンド：Issue 04（6月）→ Issue 06（8月）",
             "⚠️ 8月実績未取得。以下はIssue 04確定値と8月外部予測の重ね合わせ。");

    const kpiRows = [
      [
        { text: "KPI", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "Issue 04（6月確定）", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "Issue 05（7月）", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "Issue 06（8月）", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "外部圧力シグナル", options: { bold: true, color: COLOR.white, fill: COLOR.navy } }
      ],
      ["定期UU達成率", "83.7%（目標比）", "⚠️ 未取得", "⚠️ 未取得", "Qoo10メガ割期の新規流入減少リスク"],
      ["トライアルCPA", "¥20,174（+12%悪化）", "⚠️ 未取得", "⚠️ 未取得", "メガ割期はPaid CPAが一般的に上昇"],
      ["AF引き上げ率", "22%（目標15%超過）", "⚠️ 未取得", "⚠️ 未取得", "定着後LTV基盤として維持が重要"],
      ["Sミルク売上目標比", "111%（目標+11%）", "⚠️ 未取得", "⚠️ 未取得", "ブライトエイジ参入後の目標比変化に注目"],
      ["Kyoto売上目標比", "108%（6月）", "⚠️ 未取得", "⚠️ 未取得", "夏季は百貨店チャネル一般的に低調傾向"]
    ];

    s.addTable(kpiRows, {
      x: 0.5, y: 1.95, w: 12.3, h: 3.8,
      fontFace: FONT_BODY, fontSize: 10,
      colW: [2.2, 2.2, 2.0, 2.0, 3.9],
      border: { pt: 0.5, color: COLOR.divider }
    });

    addCallout(s, "⚠️ Layer 2データ未取得 — 要アクション",
      "Google Drive接続エラーにより最新議事録（7/28・8/6）を読めない状態。Cloud実行でも同エラー（7月号・8月号両方失敗の原因）。管理者にRead権限の付与を依頼するか、手動でKPIを更新してください。",
      0.5, 5.95, 12.3, 0.9, COLOR.crimson);
    addFooter(s, 12);
  } else {
    const s = pres.addSlide();
    s.background = { color: COLOR.shade };
    s.addText("本セクションは経営内部資料のため非掲載", {
      x: 0.5, y: 3.3, w: 12.3, h: 0.7,
      fontFace: FONT_TITLE, fontSize: 28, color: COLOR.textMuted, align: "center", margin: 0
    });
    addFooter(s, 12);
  }

  // =========================================================
  // SLIDE 13: チャネル別状況（Internal）
  // =========================================================
  if (isInternal) {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addConfidentialHeader(s);
    addSectionTag(s, "PART 3  ／  Layer 2  —  チャネル戦略（CONFIDENTIAL）");
    addTitle(s, "チャネル別 8月戦略フォーカス — Layer 1外部環境との照合",
             "⚠️ 内部実績は未取得。外部環境から導いた戦略的示唆のみ記載。");

    const channels = [
      { ch: "自社EC（sirok.jp）", env: "メガ割期は韓国コスメに流入取られる", focus: "指名検索維持コンテンツ・ブランドストーリー強化", priority: "★★★" },
      { ch: "Amazon", env: "プライムデー後の谷間。8月は競争が落ち着く", focus: "レビュー獲得・製品ページ改善の好機", priority: "★★" },
      { ch: "Qoo10", env: "メガ割（8/28〜）で韓国コスメが独占", focus: "非参戦を維持。プレミアムポジション堅守", priority: "★" },
      { ch: "@cosme / SNS", env: "リアルスキンケアグロウトレンドが最高潮", focus: "植物×ナチュラル体験コンテンツを8月に集中投稿", priority: "★★★" },
      { ch: "百貨店（Kyoto）", env: "夏季は一般的に低調。大阪高島屋の継続モニタリング", focus: "8月は守り。秋フェア企画を今から設計", priority: "★★" }
    ];

    const chanRows = [
      [{ text: "チャネル", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
       { text: "8月外部環境", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
       { text: "戦略フォーカス", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
       { text: "優先度", options: { bold: true, color: COLOR.white, fill: COLOR.navy } }],
      ...channels.map(c => [c.ch, c.env, c.focus, c.priority])
    ];

    s.addTable(chanRows, {
      x: 0.5, y: 1.95, w: 12.3, h: 3.6,
      fontFace: FONT_BODY, fontSize: 10,
      colW: [2.2, 3.8, 4.5, 1.8],
      border: { pt: 0.5, color: COLOR.divider }
    });

    addCallout(s, "8月の最重要チャネル優先順位",
      "①SNS（@cosme/TikTok） → ②自社EC → ③Amazon。Qoo10メガ割は非参戦維持。百貨店は秋の仕込みに集中。メガ割に巻き込まれずに指名検索を維持することが8月の最優先課題。",
      0.5, 5.75, 12.3, 0.9, COLOR.navy);
    addFooter(s, 13);
  } else {
    const s = pres.addSlide();
    s.background = { color: COLOR.shade };
    s.addText("本セクションは経営内部資料のため非掲載", {
      x: 0.5, y: 3.3, w: 12.3, h: 0.7,
      fontFace: FONT_TITLE, fontSize: 28, color: COLOR.textMuted, align: "center", margin: 0
    });
    addFooter(s, 13);
  }

  // =========================================================
  // SLIDE 14: Part 4 Divider (Our Thesis)
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.ink };
    s.addText("PART 4", {
      x: 0.85, y: 1.8, w: 11, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.white, bold: true, charSpacing: 10, margin: 0
    });
    s.addText("第4部　Our Thesis", {
      x: 0.85, y: 2.4, w: 11, h: 1.1,
      fontFace: FONT_TITLE, fontSize: 44, color: COLOR.white, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 0.85, y: 3.7, w: 3.0, h: 0,
      line: { color: COLOR.gold, width: 3 }
    });
    s.addText("外部圧力と内部現実の交差から導いた、今月の逆張り仮説", {
      x: 0.85, y: 4.0, w: 10, h: 0.5,
      fontFace: FONT_BODY, fontSize: 16, color: COLOR.white, italic: true, margin: 0
    });
    addFooter(s, 14);
  }

  // =========================================================
  // SLIDE 15: Our Thesis Statement
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 4  ／  OUR THESIS");
    addTitle(s, "Our Thesis — Issue 06 / August 2026",
             "市場が「メガ割×成分」で動く局面だからこそ、N organicは「体験の固有性」に賭ける");

    addCallout(s,
      "OUR THESIS",
      "Qoo10第3回メガ割（8/28〜）が日韓コスメの最大戦場になる8月において、N organicはメガ割型バイヤーとの価格競争に引き込まれるリスクを抱えているが、この脅威は同時に「処方の固有性」で戦えるブランドへの転換を迫る最後の外圧でもある。第一三共ブライトエイジ プレミアム（6月）が医薬部外品VCを「コモディティ化の入口」に押し込んでいる今、N organicが今すぐ投資すべきは成分スペックではなく「なぜN organicでなければならないか」を語る体験資産の構築だ。",
      0.5, 1.9, 12.3, 1.6, COLOR.navy);

    s.addText("なぜこれが「逆張り」なのか", {
      x: 0.5, y: 3.65, w: 12.3, h: 0.35,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.text, bold: true, margin: 0
    });

    const reasons = [
      { label: "市場が動く方向", text: "成分スペック競争の激化、Qoo10メガ割型のバイヤー獲得競争、製薬大手の医薬部外品参入" },
      { label: "We bet against", text: "成分での差別化は短期的に有効だが、2027-2028年のコモディティ化で競争優位が消滅する" },
      { label: "賭ける仮説", text: "「体験の固有性（植物×処方こだわり×日本生産）」はコモディティ化しない。これを今から積み上げる" },
      { label: "検証シグナル", text: "N organic指名検索の前月比（Weekly）がプラスに転じたとき、ブランド体験投資の効果が確認される" }
    ];

    reasons.forEach((r, i) => {
      const y = 4.1 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 12.3, h: 0.6, fill: { color: i % 2 === 0 ? COLOR.shade : COLOR.paper }, line: { color: "FFFFFF", width: 0 } });
      s.addText(r.label, { x: 0.65, y: y + 0.1, w: 2.4, h: 0.38, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.navy, bold: true, margin: 0 });
      s.addText(r.text, { x: 3.15, y: y + 0.1, w: 9.4, h: 0.38, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0 });
    });

    addFooter(s, 15);
  }

  // =========================================================
  // SLIDE 16: Strategic Framework（図表3）
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 4  ／  戦略フレームワーク");
    addTitle(s, "【図表3】ポストダーマコスメ戦略フレームワーク",
             "N organicが採るべき4フェーズの戦略時間軸");

    s.addImage({
      path: path.join(CHART_DIR, "chart3_strategic_thesis.png"),
      x: 0.5, y: 1.8, w: 12.2, h: 4.8
    });

    addFooter(s, 16);
  }

  // =========================================================
  // SLIDE 17: 「体験の固有性」投資の構造
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 4  ／  戦略設計");
    addTitle(s, "「体験の固有性」投資 — 今すぐ着手すべき3つの領域",
             "8月以降のブランド体験軸転換を成分訴求と並走させる「二重投資」設計");

    const areas = [
      {
        title: "A: コンテンツ体験（今すぐ）",
        items: [
          "TikTok/Instagram：「植物×ナチュラル発光」リアルスキンケアグロウ体験動画を8月中に3本以上",
          "Sミルク動画「植物が、白くする。」の制作着手（Issue 04で企画済み）",
          "ユーザー生成コンテンツ（UGC）の設計：購入後の自然素材体験を共有する仕組み"
        ],
        color: COLOR.forest
      },
      {
        title: "B: 処方の固有性訴求（1〜2ヶ月）",
        items: [
          "N Labの処方思想を「他社との違い」として語るサイト/SNS/PDFコンテンツ整備",
          "「なぜCICAとVCを組み合わせたか」という処方の意図を消費者言語で表現",
          "@cosme Q&A・SNSコメント返信で「成分の意味」を一次情報として発信"
        ],
        color: COLOR.navy
      },
      {
        title: "C: ブランド体験の拡張（3〜6ヶ月）",
        items: [
          "KOBIDO等の日本文化×スキンケア体験の企画・テスト",
          "直営店でのイベント型体験設計（秋冬シーズン向け）",
          "会員350万人へのN organic体験ブランドブック（DMや特典コンテンツ）配布"
        ],
        color: COLOR.gold
      }
    ];

    areas.forEach((a, i) => {
      const y = 1.9 + i * 1.65;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 12.3, h: 1.5, fill: { color: COLOR.shade }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.08, h: 1.5, fill: { color: a.color }, line: { color: a.color, width: 0 } });
      s.addText(a.title, { x: 0.72, y: y + 0.1, w: 11.8, h: 0.35, fontFace: FONT_BODY, fontSize: 12, color: a.color, bold: true, margin: 0 });
      a.items.forEach((item, j) => {
        s.addText("• " + item, { x: 0.85, y: y + 0.48 + j * 0.32, w: 11.6, h: 0.3, fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, margin: 0 });
      });
    });

    addFooter(s, 17);
  }

  // =========================================================
  // SLIDE 18: 検証3指標
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 4  ／  検証フレームワーク");
    addTitle(s, "Our Thesis 検証3指標 — 何が変わったら仮説が証明されるか",
             "賭けである以上、検証可能な先行指標を定義する");

    const indicators = [
      {
        id: "A",
        name: "N organic 指名検索 週次変化",
        source: "内部検索レポート（Google Search Console 推定）",
        signal: "連続2週間で前週比+3%以上 → 体験コンテンツ投資の効果発現",
        cycle: "週次",
        threshold: "+3%以上 / 2週連続",
        color: COLOR.forest
      },
      {
        id: "B",
        name: "Qoo10メガ割期間の自社EC直接流入率",
        source: "自社ECアナリティクス（メガ割期間 8/28〜9/9）",
        signal: "メガ割期に直接流入率が前月比で維持 or 上昇 → N organicブランド指名力が健在",
        cycle: "メガ割期（8/28〜9/9）",
        threshold: "前月比 -5%以内（維持）",
        color: COLOR.navy
      },
      {
        id: "C",
        name: "Sミルク指名検索 vs カテゴリー検索 比率",
        source: "Google Trends / 内部検索レポート",
        signal: "「N organic Sミルク」指名検索が「CICAミルク」カテゴリー検索を上回るようになる → ブランド指名転換",
        cycle: "月次",
        threshold: "指名/カテゴリー比 > 1.2",
        color: COLOR.gold
      }
    ];

    indicators.forEach((ind, i) => {
      const y = 1.85 + i * 1.62;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 12.3, h: 1.48, fill: { color: COLOR.shade }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.08, h: 1.48, fill: { color: ind.color }, line: { color: ind.color, width: 0 } });

      s.addText(`指標${ind.id}`, { x: 0.72, y: y + 0.1, w: 0.8, h: 0.35, fontFace: FONT_TITLE, fontSize: 18, color: ind.color, bold: true, margin: 0 });
      s.addText(ind.name, { x: 1.55, y: y + 0.12, w: 10.9, h: 0.35, fontFace: FONT_BODY, fontSize: 13, color: COLOR.ink, bold: true, margin: 0 });
      s.addText("データソース：" + ind.source, { x: 0.72, y: y + 0.5, w: 11.6, h: 0.26, fontFace: FONT_BODY, fontSize: 9.5, color: COLOR.textMuted, margin: 0 });
      s.addText("シグナル：" + ind.signal, { x: 0.72, y: y + 0.76, w: 11.6, h: 0.35, fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, margin: 0 });
      s.addText(`計測サイクル：${ind.cycle}　|　閾値：${ind.threshold}`, { x: 0.72, y: y + 1.12, w: 11.6, h: 0.28, fontFace: FONT_BODY, fontSize: 9.5, color: ind.color, bold: true, margin: 0 });
    });

    addFooter(s, 18);
  }

  // =========================================================
  // SLIDE 19: Part 5 Divider (意思決定)
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.navyDark };
    s.addText("PART 5", {
      x: 0.85, y: 1.8, w: 11, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.white, bold: true, charSpacing: 10, margin: 0
    });
    s.addText("第5部　3つの意思決定", {
      x: 0.85, y: 2.4, w: 11, h: 1.1,
      fontFace: FONT_TITLE, fontSize: 44, color: COLOR.white, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 0.85, y: 3.7, w: 3.0, h: 0,
      line: { color: COLOR.gold, width: 3 }
    });
    s.addText("論点提示で終わらせない — Pro/Conと明確な推奨判断を提示する", {
      x: 0.85, y: 4.0, w: 10, h: 0.5,
      fontFace: FONT_BODY, fontSize: 16, color: COLOR.white, italic: true, margin: 0
    });
    addFooter(s, 19);
  }

  // =========================================================
  // SLIDE 20: 意思決定1
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 5  ／  意思決定 1 of 3");
    addTitle(s, "意思決定①：Qoo10メガ割（8/28〜）期間にN organic独自戦略を設計すべきか？",
             "メガ割参戦 vs 非参戦で、8月の消費者接点をどう設計するか");

    const pros = [
      "メガ割非参戦によりプレミアムポジションを毀損せずに済む（価格競争の罠を回避）",
      "メガ割期にSNS体験コンテンツを集中投下すれば「韓国コスメを見ている消費者」と異なる層にリーチできる",
      "Qoo10メガ割後（9/10〜）は「反省消費」として手頃なプレミアムへの需要が戻る傾向がある",
      "メガ割期にブランドストーリーを強化することで指名検索維持が見込まれる"
    ];
    const cons = [
      "メガ割期にQoo10で探す消費者層へのリーチがゼロになる（新規獲得機会の損失）",
      "競合がメガ割で大量のUGC・クチコミを獲得する間、N organicのSNS露出が相対的に薄れる",
      "メガ割後の「反省消費」への転換は仮説であり、実証データが不足している",
      "SNSコンテンツ投下のリソース（制作・投稿）が逼迫している可能性がある"
    ];

    s.addText("Pro（独自戦略の根拠）", {
      x: 0.5, y: 1.95, w: 6.0, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.forest, bold: true, margin: 0
    });
    s.addText("Con（リスク）", {
      x: 6.8, y: 1.95, w: 6.0, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.crimson, bold: true, margin: 0
    });

    pros.forEach((p, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.35 + i * 0.72, w: 6.1, h: 0.62, fill: { color: "EDF4EF" }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.35 + i * 0.72, w: 0.08, h: 0.62, fill: { color: COLOR.forest }, line: { color: COLOR.forest, width: 0 } });
      s.addText("+ " + p, { x: 0.72, y: 2.38 + i * 0.72, w: 5.7, h: 0.56, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0 });
    });

    cons.forEach((c, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 2.35 + i * 0.72, w: 6.1, h: 0.62, fill: { color: "FCEEEE" }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 2.35 + i * 0.72, w: 0.08, h: 0.62, fill: { color: COLOR.crimson }, line: { color: COLOR.crimson, width: 0 } });
      s.addText("- " + c, { x: 7.02, y: 2.38 + i * 0.72, w: 5.7, h: 0.56, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0 });
    });

    addCallout(s, "推奨：YES（差別化設計・非参戦維持）",
      "Qoo10メガ割には参戦しない。その代わり、メガ割期間（8/28〜9/9）に「N organicが伝えたいブランド体験コンテンツ」をSNS・自社ECで集中投下する。KPIは「指名検索の維持率（メガ割期前後比）」と設定し、メガ割後（9月第2週以降）の自社EC流入回復を検証指標にする。",
      0.5, 6.2, 12.3, 0.85, COLOR.forest);
    addFooter(s, 20);
  }

  // =========================================================
  // SLIDE 21: 意思決定2
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 5  ／  意思決定 2 of 3");
    addTitle(s, "意思決定②：第一三共ブライトエイジ参入後も医薬部外品VCポジションを維持するか？",
             "Sミルク（CICA×VC医薬部外品）の差別化を維持するか、処方の次の一手を打つか");

    const pros = [
      "Sミルク目標+11%超の超達成実績があり、現時点でのポジション放棄は早計",
      "医薬部外品VCは依然として消費者に「効く」ポジティブな印象を持たれている",
      "ブライトエイジはどちらかというと「医薬品サプリ」領域で、外用スキンケア競合とは少し異なる",
      "N organicの「植物由来VC」という処方の独自性はブライトエイジとは差別化可能"
    ];
    const cons = [
      "ブライトエイジ ホワイト プレミアム（6/11発売）が「史上最高配合」で医薬部外品美白に参入",
      "Anua・COSRX・VT等もVC系製品を継続投入し、VCスキンケアがコモディティ化しつつある",
      "資生堂・花王等の大手が2027-2028年に本格参入するとN organicの医薬部外品VCは競争優位を失う",
      "「CICA×VC」のカテゴリー需要に乗っているに過ぎないという分析は変わっていない"
    ];

    s.addText("Pro（維持の根拠）", {
      x: 0.5, y: 1.95, w: 6.0, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.forest, bold: true, margin: 0
    });
    s.addText("Con（転換の根拠）", {
      x: 6.8, y: 1.95, w: 6.0, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.crimson, bold: true, margin: 0
    });

    pros.forEach((p, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.35 + i * 0.72, w: 6.1, h: 0.62, fill: { color: "EDF4EF" }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.35 + i * 0.72, w: 0.08, h: 0.62, fill: { color: COLOR.forest }, line: { color: COLOR.forest, width: 0 } });
      s.addText("+ " + p, { x: 0.72, y: 2.38 + i * 0.72, w: 5.7, h: 0.56, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0 });
    });

    cons.forEach((c, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 2.35 + i * 0.72, w: 6.1, h: 0.62, fill: { color: "FCEEEE" }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 2.35 + i * 0.72, w: 0.08, h: 0.62, fill: { color: COLOR.crimson }, line: { color: COLOR.crimson, width: 0 } });
      s.addText("- " + c, { x: 7.02, y: 2.38 + i * 0.72, w: 5.7, h: 0.56, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0 });
    });

    addCallout(s, "推奨：条件付きYES（並走戦略）",
      "Sミルク（医薬部外品CICA×VC）は現状維持するが、次の成分軸（第2世代処方）の企画をN Labで並行着手する。「植物由来VC」の固有性を競合と明確に差別化して表現することが2026年下半期の最重要コミュニケーション課題。2027年初までに次製品の方向性を確定する。",
      0.5, 6.2, 12.3, 0.85, COLOR.gold);
    addFooter(s, 21);
  }

  // =========================================================
  // SLIDE 22: 意思決定3
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 5  ／  意思決定 3 of 3");
    addTitle(s, "意思決定③：秋以降のブランド体験投資（KOBIDO等）を今すぐ着手すべきか？",
             "2026年秋（9-11月）の体験型ブランド投資の設計を、8月中に始めるかどうか");

    const aAxis = [
      "成分訴求の継続は現在のSミルク消費者に効いており、短期売上を守れる",
      "秋の百貨店フェアは体験型イベントと親和性が高く、Kyoto Plenuムとの連携が可能",
      "KOBIDO等の伝統美容×体験はN organicの「和×自然」ブランドと完全整合する",
      "350万会員への特別体験提供はLTV向上と口コミ拡散に直結する可能性がある"
    ];
    const bAxis = [
      "体験型投資は即効性がなく、ROI計測が困難。経営層の承認を得にくい",
      "KOBIDO等のイベント企画はリソース（人・コスト・時間）を大量に消費する",
      "秋以降の体験投資より、8月メガ割対策（SNSコンテンツ）を優先すべきという意見もある",
      "「体験の固有性」のコンセプト自体がまだ社内コンセンサスになっていない可能性がある"
    ];

    s.addText("A: 体験投資先行着手（推奨）", {
      x: 0.5, y: 1.95, w: 6.0, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.forest, bold: true, margin: 0
    });
    s.addText("B: 成分投資継続・体験は先送り", {
      x: 6.8, y: 1.95, w: 6.0, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12, color: COLOR.crimson, bold: true, margin: 0
    });

    aAxis.forEach((p, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.35 + i * 0.72, w: 6.1, h: 0.62, fill: { color: "EDF4EF" }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.35 + i * 0.72, w: 0.08, h: 0.62, fill: { color: COLOR.forest }, line: { color: COLOR.forest, width: 0 } });
      s.addText(p, { x: 0.72, y: 2.38 + i * 0.72, w: 5.7, h: 0.56, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0 });
    });

    bAxis.forEach((c, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 2.35 + i * 0.72, w: 6.1, h: 0.62, fill: { color: "FCEEEE" }, line: { color: "FFFFFF", width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 2.35 + i * 0.72, w: 0.08, h: 0.62, fill: { color: COLOR.crimson }, line: { color: COLOR.crimson, width: 0 } });
      s.addText(c, { x: 7.02, y: 2.38 + i * 0.72, w: 5.7, h: 0.56, fontFace: FONT_BODY, fontSize: 10.5, color: COLOR.text, margin: 0 });
    });

    addCallout(s, "推奨：YES（今すぐ着手。ただし規模は小さく始める）",
      "体験投資を先送りにするほど競合との差が開く。8月中に「秋体験投資の方針と予算案」を策定し、9月の1イベント（小規模テスト）から着手する。KOBIDO×N organicのコンセプトプロトタイプを社内で合意形成することが今月の最重要アクション。",
      0.5, 6.2, 12.3, 0.85, COLOR.forest);
    addFooter(s, 22);
  }

  // =========================================================
  // SLIDE 23: Part 6 Divider (Uncomfortable Truths)
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.crimsonDk };
    s.addText("PART 6", {
      x: 0.85, y: 1.8, w: 11, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR.white, bold: true, charSpacing: 10, margin: 0
    });
    s.addText("第6部", {
      x: 0.85, y: 2.4, w: 11, h: 0.9,
      fontFace: FONT_TITLE, fontSize: 44, color: COLOR.white, margin: 0
    });
    s.addText("5つの Uncomfortable Truths", {
      x: 0.85, y: 3.35, w: 11, h: 0.65,
      fontFace: FONT_TITLE, fontSize: 32, color: COLOR.gold, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 0.85, y: 4.1, w: 3.0, h: 0,
      line: { color: COLOR.gold, width: 3 }
    });
    s.addText("クライアントが見ようとしない事実の指摘なくして、コンサルファームとしての価値はない", {
      x: 0.85, y: 4.5, w: 10, h: 0.5,
      fontFace: FONT_BODY, fontSize: 14, color: COLOR.white, italic: true, margin: 0
    });
    addFooter(s, 23);
  }

  // =========================================================
  // SLIDE 24: 5 Uncomfortable Truths
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "PART 6  ／  5 UNCOMFORTABLE TRUTHS");
    addTitle(s, "5つの不都合な真実 — 直視すべき構造的事実",
             "これらの事実と向き合わないまま意思決定すると、方向を誤るリスクがある");

    const truths = [
      {
        num: "01",
        title: "Qoo10メガ割に参戦しないことは戦略的選択だが、放置すれば「存在感ゼロ」になる",
        body: "メガ割期に何もしなければ、消費者の視野からN organicが完全に消える。非参戦を選ぶなら、同期間に「別の場所で存在感を示す投資」が必須条件だ。"
      },
      {
        num: "02",
        title: "Sミルクの目標超達成が「N organicブランドへの愛着」の証拠ではない可能性がある",
        body: "カテゴリー（CICA×VC医薬部外品）が売れているのか、ブランド（N organic）が選ばれているのかを検証する指標（指名検索比率）が社内にまだない。"
      },
      {
        num: "03",
        title: "Google Drive APIへの読み取り権限エラーは「Layer 2データ空白」を意味する",
        body: "本号（Issue 06）のLayer 2データは未取得。7月号も同様の失敗。経営判断に使うべきKPIが毎月欠落している状態は、モニタリング体制の根本的な問題だ。"
      },
      {
        num: "04",
        title: "「ブランド体験投資」を先送りにするたびに、コモディティ化のリスクが1段階進む",
        body: "第一三共参入（6月）、Anua秋攻勢継続、Qoo10構造化（8月）。外圧は毎月強まっている。ブランド転換は「決めた瞬間」から18ヶ月後に効果が出る投資だ。今すぐ始めなければ2028年には間に合わない。"
      },
      {
        num: "05",
        title: "N organicの公開情報に2026年夏〜秋の新製品情報が確認できない",
        body: "競合が毎月新製品を投入する中、N organicのプレスリリースは3月（Sミルク）以降が確認されていない。消費者・メディアへの露出機会が失われている可能性がある。"
      }
    ];

    truths.forEach((t, i) => {
      const y = 1.85 + i * 0.98;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y, w: 12.3, h: 0.88,
        fill: { color: i % 2 === 0 ? COLOR.shade : COLOR.paper },
        line: { color: "FFFFFF", width: 0 }
      });
      s.addText(t.num, {
        x: 0.65, y: y + 0.1, w: 0.6, h: 0.35,
        fontFace: FONT_TITLE, fontSize: 14, color: COLOR.crimson, bold: true, margin: 0
      });
      s.addText(t.title, {
        x: 1.35, y: y + 0.07, w: 11.2, h: 0.38,
        fontFace: FONT_BODY, fontSize: 11, color: COLOR.ink, bold: true, margin: 0
      });
      s.addText(t.body, {
        x: 1.35, y: y + 0.45, w: 11.2, h: 0.37,
        fontFace: FONT_BODY, fontSize: 9.5, color: COLOR.textMuted, margin: 0
      });
    });

    addFooter(s, 24);
  }

  // =========================================================
  // SLIDE 25: リスクマトリクス + 次号予告
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.white };
    addSectionTag(s, "クロージング  ／  リスクと次号予告");
    addTitle(s, "リスクマトリクス + 次月モニタリング指標",
             "前号（Issue 05 / 7月）→ 本号（Issue 06 / 8月）の変化と、Issue No.07（9月号）の予告論点");

    const risks = [
      { item: "Qoo10メガ割での存在感喪失", prev: "中/中", curr: "高/高", change: "↑↑ 悪化", color: COLOR.crimson },
      { item: "医薬部外品VCのコモディティ化", prev: "中/中", curr: "高/高", change: "↑ 悪化（ブライトエイジ参入）", color: COLOR.crimson },
      { item: "Anua市場侵食", prev: "高/高", curr: "高/高", change: "→ 継続（秋攻勢中）", color: COLOR.gold },
      { item: "Layer 2データ空白（Drive接続不可）", prev: "中/低", curr: "高/高", change: "↑↑ 新規悪化", color: COLOR.crimson },
      { item: "ブランド体験投資の遅延", prev: "中/中", curr: "高/中", change: "↑ 悪化", color: COLOR.gold },
      { item: "直営店収益化", prev: "低/高", curr: "低/高", change: "→ 変化なし", color: COLOR.textMuted }
    ];

    const riskRows = [
      [
        { text: "リスク項目", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "前号（7月）評価", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "本号（8月）評価", options: { bold: true, color: COLOR.white, fill: COLOR.navy } },
        { text: "変化", options: { bold: true, color: COLOR.white, fill: COLOR.navy } }
      ],
      ...risks.map(r => [
        { text: r.item },
        { text: r.prev },
        { text: r.curr },
        { text: r.change, options: { color: r.color, bold: true } }
      ])
    ];

    s.addTable(riskRows, {
      x: 0.5, y: 1.95, w: 8.0, h: 3.15,
      fontFace: FONT_BODY, fontSize: 10,
      colW: [3.2, 1.5, 1.5, 1.8],
      border: { pt: 0.5, color: COLOR.divider }
    });

    s.addText("次号（Issue No.07 / 9月号）予告論点", {
      x: 8.8, y: 1.95, w: 4.3, h: 0.35,
      fontFace: FONT_BODY, fontSize: 11, color: COLOR.navy, bold: true, margin: 0
    });

    const nextTopics = [
      "Qoo10メガ割（8/28〜9/9）後の指名検索回復率検証",
      "ブライトエイジ参入後のSミルク指名vs カテゴリー検索比率",
      "秋体験投資テスト（9月1イベント）の初速評価",
      "Layer 2データ取得環境の修復確認（Drive接続問題）",
      "N organic秋新製品情報の有無と競合動向"
    ];

    nextTopics.forEach((t, i) => {
      s.addText("▸ " + t, {
        x: 8.8, y: 2.38 + i * 0.5, w: 4.3, h: 0.44,
        fontFace: FONT_BODY, fontSize: 10, color: COLOR.text, margin: 0
      });
    });

    addCallout(s, "最重要モニタリング指標（8月〜9月第1週）",
      "① N organic指名検索 — メガ割期（8/28〜9/9）の週次変化を追跡 / ② Qoo10メガ割後の自社EC直接流入率（前月比） / ③ Google Drive読み取り権限修復の確認（Layer 2データ取得環境）",
      0.5, 5.27, 12.3, 1.05, COLOR.navy);

    addFooter(s, 25);
  }

  // =========================================================
  // SLIDE 26: 付録 — データソース一覧
  // =========================================================
  {
    const s = pres.addSlide();
    s.background = { color: COLOR.shade };
    addSectionTag(s, "付録  ／  データソース一覧");
    addTitle(s, "データソース一覧 — Layer 1（公開情報）",
             "Layer 2（内部KPI）は「経営内部資料」として表記。8月号は接続エラーにより取得不可。");

    const sources = [
      { cat: "市場規模", items: ["KDマーケットインサイツ 日本オーガニック化粧品市場 CAGR5.1%（2025-2035）", "矢野経済研究所 自然派化粧品市場 2024年度1,835億円 +3.1%", "TBRC ダーマコスメティクス世界市場 CAGR9.6%（〜2030）", "GII / gii.co.jp オーガニックスキンケア市場 2026年版"] },
      { cat: "競合情報", items: ["第一三共ヘルスケアダイレクト プレスリリース ブライトエイジ ホワイト プレミアム（2026/6/1）", "週刊粧業 Anua Qoo10を軸に日本で急成長（2026年）", "Walkerplus Anua次世代型ビタミン美容液新発売（2026年）", "my-best.com ビタミンC美容液ランキング 2026年8月版"] },
      { cat: "@cosme", items: ["@cosmeベストコスメアワード2026 上半期新作 スキンケア（2026/5/20発表）", "@cosme 2026上半期トレンド「手応え×やさしさ」（istyle）"] },
      { cat: "SNS/チャネル", items: ["pricey.jp Qoo10メガ割2026年8月 第3回（8/28〜9/9）スケジュール予測", "BAILA 2026年8月メガ割 韓国コスメ・スキンケア・UV推薦記事", "note（beautychameleon）海外TikTok発 2026年バズ美容トレンド予想", "fashionsnap.com 2026年春 美白・ホワイトニング30選"] },
      { cat: "N organic公開情報", items: ["シロク株式会社 prtimes.jp プレスリリース一覧（直近確認：Sミルク 2026/3/24）", "sirok.jp N organic公式ブランドサイト（2026年8月時点）"] },
      { cat: "内部資料（Layer 2）", items: ["経営会議議事録 2026年8月6日（⚠️接続エラーにより未取得）", "経営会議議事録 2026年7月28日（⚠️接続エラーにより未取得）", "Issue 04（6月号）確定値をベースライン使用 — 更新が必要"] }
    ];

    let y = 1.88;
    sources.forEach(src => {
      s.addText(src.cat, {
        x: 0.5, y, w: 2.0, h: 0.3,
        fontFace: FONT_BODY, fontSize: 10, color: COLOR.navy, bold: true, margin: 0
      });
      s.addText(src.items.join("　|　"), {
        x: 2.6, y, w: 10.2, h: 0.28,
        fontFace: FONT_BODY, fontSize: 8.5, color: COLOR.text, margin: 0
      });
      y += 0.42;
      s.addShape(pres.shapes.LINE, {
        x: 0.5, y: y - 0.06, w: 12.3, h: 0,
        line: { color: COLOR.divider, width: 0.3 }
      });
    });

    s.addText("⚠️ 本号（Issue 06）のLayer 2（内部KPI）はGoogle Drive MCP接続エラーにより未取得。Issue 04（6月確定値）をチャートに使用。管理者に read_file_content 権限の確認を依頼してください。", {
      x: 0.5, y: 7.0, w: 12.3, h: 0.3,
      fontFace: FONT_BODY, fontSize: 8, color: COLOR.crimson, italic: true, margin: 0
    });

    addFooter(s, 26);
  }

  // ===== Write =====
  const suffix = isInternal ? "INTERNAL" : "EXTERNAL";
  const fileName = path.join(OUTPUT_DIR,
    `N_organic_戦略市場モニタリング_2026年8月号_Tier1_${suffix}.pptx`);

  return pres.writeFile({ fileName }).then(() => {
    console.log(`Saved: ${fileName}`);
    return fileName;
  });
}

// Generate both versions
Promise.all([makeDeck(true), makeDeck(false)])
  .then(files => {
    console.log("Done. Files:");
    files.forEach(f => console.log("  " + f));
  })
  .catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
  });
