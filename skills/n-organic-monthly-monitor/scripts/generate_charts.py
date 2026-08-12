"""Generate Tier 1 quality charts for N organic monthly report.

使い方:
    python3 generate_charts.py [output_dir]
    output_dir 省略時: カレントディレクトリ

月次更新時に変える箇所:
    - Chart 1: growth_rates の数値（矢野経済/富士経済/IMARC/TBRC最新値）
    - Chart 2: competitors の位置（特にAnuaの売上規模 size 値）
    - Chart 3: timeline の年代表記（必要に応じてフェーズ説明を更新）
    - Chart 4: GAP_DATA（毎月の内部KPIに更新 ← 最重要）

依存:
    pip install matplotlib  (CCR: pip install matplotlib)
    フォント: macOS → Hiragino Sans (OS標準), Linux → Noto Sans CJK JP (要 apt install)
"""
import sys
import os
import platform
import matplotlib
matplotlib.use('Agg')  # ヘッドレス環境対応
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Rectangle, FancyArrowPatch
import matplotlib.font_manager as fm
import numpy as np

# =====================================================================
# 出力先ディレクトリ（引数 or 環境変数 or カレントディレクトリ）
# =====================================================================
OUTPUT_DIR = (
    sys.argv[1] if len(sys.argv) > 1
    else os.environ.get('CHART_OUTPUT_DIR', '.')
)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# =====================================================================
# 日本語フォント自動検出
# =====================================================================
def _detect_jp_font():
    available = {f.name for f in fm.fontManager.ttflist}
    candidates = (
        ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Osaka']
        if platform.system() == 'Darwin'
        else ['Noto Sans CJK JP', 'Noto Sans JP', 'IPAexGothic', 'TakaoGothic',
              'VL Gothic', 'WenQuanYi Micro Hei']
    )
    for c in candidates:
        if c in available:
            return c
    # フォールバック: matplotlib のデフォルト (日本語は豆腐になるが動作はする)
    print("[WARN] Japanese font not found. Install fonts-noto-cjk on Linux or use macOS.", file=sys.stderr)
    return None

jp_font = _detect_jp_font()
if jp_font:
    plt.rcParams['font.family'] = jp_font
plt.rcParams['axes.unicode_minus'] = False

NAVY  = "#1F3A6B"
RED   = "#C04040"
GOLD  = "#C49F00"
GREEN = "#2E8B57"
GRAY  = "#707070"
LIGHT = "#F5F7FB"

# ====================================================================
# Chart 1: Market growth comparison (2024-2026)
# ====================================================================
fig, ax = plt.subplots(figsize=(10, 5.8), dpi=180)

segments = [
    "自然派・オーガニック\n(N organic主戦場)",
    "スキンケア化粧品全体",
    "医薬部外品スキンケア\n(CAGR予測値)",
    "ダーマコスメ\n(グローバル予測値)"
]
growth_rates = [3.1, 3.5, 8.35, 9.7]
colors = [RED, GRAY, GOLD, NAVY]
sources = ["矢野経済(2024年度)", "富士経済(2025年見込)", "IMARC(2025-34CAGR)", "TBRC(2025-26)"]

y_pos = np.arange(len(segments))
bars = ax.barh(y_pos, growth_rates, color=colors, alpha=0.85, height=0.55,
               edgecolor='white', linewidth=2)

for i, (bar, rate, source) in enumerate(zip(bars, growth_rates, sources)):
    ax.text(rate + 0.15, i, f"+{rate}%", va='center', ha='left',
            fontsize=14, fontweight='bold', color=colors[i])
    ax.text(rate + 1.4, i, f"({source})", va='center', ha='left',
            fontsize=9, color=GRAY)

ax.set_yticks(y_pos)
ax.set_yticklabels(segments, fontsize=11)
ax.invert_yaxis()
ax.set_xlabel("年成長率 (%)", fontsize=11, color=GRAY)
ax.set_xlim(0, 14)
ax.set_title("【図表1】N organic主戦場の構造的劣後",
             fontsize=15, fontweight='bold', color=NAVY, pad=15, loc='left')
ax.text(0, -0.95, "N organicが立つセグメントは、上位3セグメントすべてに劣後する成長率",
        fontsize=10, color=GRAY, style='italic')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#CCCCCC')
ax.spines['bottom'].set_color('#CCCCCC')
ax.grid(axis='x', alpha=0.2, linestyle='--')
ax.axvline(x=3.1, color=RED, linestyle=':', alpha=0.5, linewidth=1.5)

plt.tight_layout()
out1 = os.path.join(OUTPUT_DIR, 'chart1_market_growth.png')
plt.savefig(out1, dpi=180, bbox_inches='tight', facecolor='white')
plt.close()
print(f"Chart 1 saved: {out1}")


# ====================================================================
# Chart 2: Competitive Positioning Map (2x2)
# ====================================================================
fig, ax = plt.subplots(figsize=(10, 8), dpi=180)

ax.add_patch(Rectangle((0, 0), 5, 5, facecolor='#FFF9F0', alpha=0.4, zorder=0))
ax.add_patch(Rectangle((5, 0), 5, 5, facecolor='#FFE8E0', alpha=0.4, zorder=0))
ax.add_patch(Rectangle((0, 5), 5, 5, facecolor='#F0F4FB', alpha=0.4, zorder=0))
ax.add_patch(Rectangle((5, 5), 5, 5, facecolor='#FFE8E0', alpha=0.4, zorder=0))

ax.axhline(y=5, color='#888888', linewidth=1.2, zorder=1)
ax.axvline(x=5, color='#888888', linewidth=1.2, zorder=1)

ax.text(2.5, 9.5, "①自然派×プレミアム", fontsize=11, fontweight='bold',
        ha='center', color=NAVY, alpha=0.6)
ax.text(7.5, 9.5, "②機能×プレミアム", fontsize=11, fontweight='bold',
        ha='center', color=RED, alpha=0.8)
ax.text(2.5, 0.4, "③自然派×ボリューム", fontsize=11, fontweight='bold',
        ha='center', color=GOLD, alpha=0.7)
ax.text(7.5, 0.4, "④機能×ボリューム / K-Beauty", fontsize=11, fontweight='bold',
        ha='center', color=RED, alpha=0.8)

competitors = [
    {"name": "SHIRO",        "x": 3.2, "y": 7.5, "size": 600,  "color": NAVY},
    {"name": "THREE",        "x": 3.8, "y": 8.2, "size": 800,  "color": NAVY},
    {"name": "ジョンマスター", "x": 2.5, "y": 7.0, "size": 400,  "color": NAVY},
    {"name": "POLA",         "x": 8.5, "y": 9.0, "size": 2000, "color": RED},
    {"name": "ORBIS U",      "x": 7.5, "y": 6.8, "size": 1500, "color": RED},
    {"name": "Drunk Elephant","x": 8.7, "y": 7.5, "size": 500,  "color": RED},
    {"name": "ETVOS",        "x": 7.0, "y": 4.5, "size": 700,  "color": GOLD},
    {"name": "ミノン",        "x": 7.5, "y": 3.0, "size": 1000, "color": GOLD},
    {"name": "La Roche-Posay","x": 8.5, "y": 4.0, "size": 800,  "color": RED},
    {"name": "CeraVe",       "x": 8.0, "y": 2.8, "size": 600,  "color": RED},
    {"name": "Anua",         "x": 7.8, "y": 3.5, "size": 2500, "color": RED},
    {"name": "魔女工場",      "x": 7.2, "y": 3.2, "size": 1200, "color": RED},
    {"name": "COSRX",        "x": 8.2, "y": 2.5, "size": 800,  "color": RED},
]
n_organic = {"name": "N organic", "x": 4.7, "y": 6.5, "size": 2500, "color": NAVY}

for c in competitors:
    ax.scatter(c["x"], c["y"], s=c["size"], color=c["color"], alpha=0.55,
               edgecolors='white', linewidths=1.5, zorder=3)
    offset_y = 0.35 if c["size"] < 1000 else 0.5
    ax.text(c["x"], c["y"] - offset_y, c["name"], fontsize=9.5,
            ha='center', va='top', color='#333333', zorder=4)

ax.scatter(n_organic["x"], n_organic["y"], s=n_organic["size"], color=NAVY,
           alpha=0.85, edgecolors=GOLD, linewidths=3.5, zorder=5)
ax.text(n_organic["x"], n_organic["y"] + 0.05, n_organic["name"],
        fontsize=11, fontweight='bold', ha='center', va='center',
        color='white', zorder=6)

ax.annotate("", xy=(5.5, 6.0), xytext=(7.5, 3.8),
            arrowprops=dict(arrowstyle='->', color=RED, lw=2.5, alpha=0.7,
                          connectionstyle="arc3,rad=-0.3"), zorder=4)
ax.text(6.8, 5.2, "Anua\n+200%↗\n100億円突破", fontsize=8.5, color=RED,
        fontweight='bold', ha='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='white',
                  edgecolor=RED, linewidth=1))

ax.set_xlim(0, 10); ax.set_ylim(0, 10)
ax.set_xlabel("← 自然派・世界観志向         機能性・エビデンス志向 →",
              fontsize=11, color=GRAY, labelpad=10)
ax.set_ylabel("← マス・ボリューム価格         プレミアム価格 →",
              fontsize=11, color=GRAY, labelpad=10)
ax.set_xticks([]); ax.set_yticks([])
ax.set_title("【図表2】競合ポジショニング・マップ — Anuaが構造的最大脅威",
             fontsize=14, fontweight='bold', color=NAVY, pad=15, loc='left')
ax.text(0.2, -0.7,
        "● バブルサイズ = 日本市場推定売上規模  /  ◯ Anua 日本売上 約100億円（前年比+200%）= N organicと同等規模",
        fontsize=9, color=GRAY, transform=ax.transData)
for spine in ['top', 'right', 'left', 'bottom']:
    ax.spines[spine].set_visible(False)

plt.tight_layout()
out2 = os.path.join(OUTPUT_DIR, 'chart2_competitive_map.png')
plt.savefig(out2, dpi=180, bbox_inches='tight', facecolor='white')
plt.close()
print(f"Chart 2 saved: {out2}")


# ====================================================================
# Chart 3: Strategic thesis - "Beyond Derma" timeline
# ====================================================================
fig, ax = plt.subplots(figsize=(11, 6), dpi=180)

phases = [
    {"period": "2024-2025", "phase": "ダーマコスメ\n勃興期",
     "actors": "L'Oréal系\nK-Beauty先行", "color": "#FFE5E5"},
    {"period": "2026-2027", "phase": "ダーマコスメ\n本格化",
     "actors": "資生堂・カネボウ\nコーセー総力戦", "color": "#FFB8B8"},
    {"period": "2028-2030", "phase": "ダーマコスメ\n疲弊・コモディティ化",
     "actors": "成分過剰・\n敏感肌反動", "color": "#FF8585"},
    {"period": "2030-",     "phase": "ポストダーマ\n自然回帰",
     "actors": "「肌と心」\n「ありのまま」", "color": GOLD},
]

for i, p in enumerate(phases):
    x_start = 0.5 + i * 2.7
    rect = FancyBboxPatch((x_start, 5.5), 2.2, 2.0,
                          boxstyle="round,pad=0.05",
                          facecolor=p["color"],
                          edgecolor=NAVY if i == 3 else 'white',
                          linewidth=2.5 if i == 3 else 1, alpha=0.8)
    ax.add_patch(rect)
    ax.text(x_start + 1.1, 7.1, p["period"], ha='center', fontsize=10,
            fontweight='bold', color=NAVY)
    ax.text(x_start + 1.1, 6.55, p["phase"], ha='center', fontsize=11,
            fontweight='bold')
    ax.text(x_start + 1.1, 5.95, p["actors"], ha='center', fontsize=9, color=GRAY)

arrow = FancyArrowPatch((0.7, 5.2), (10.5, 5.2),
                        arrowstyle='->', mutation_scale=20,
                        color=GRAY, lw=1.5)
ax.add_patch(arrow)

ax.text(5.5, 4.7, "N organicの戦略的選択", fontsize=12, fontweight='bold',
        ha='center', color=NAVY)

ax.add_patch(FancyBboxPatch((0.5, 2.5), 5.0, 1.8,
                             boxstyle="round,pad=0.1",
                             facecolor='white', edgecolor=RED,
                             linewidth=2, alpha=0.95))
ax.text(3.0, 3.95, "選択肢A：ダーマコスメ追随", ha='center',
        fontsize=11, fontweight='bold', color=RED)
ax.text(3.0, 3.45, "「闘う美容乳液」のような機能訴求を全シリーズへ展開",
        ha='center', fontsize=9.5, color='#444444')
ax.text(3.0, 3.0, "→ 短期売上↑、ただし2028年以降に資産毀損リスク",
        ha='center', fontsize=9, color=RED, style='italic')
ax.text(3.0, 2.65, "→ 資生堂・L'Oréal・Anua全社と正面衝突",
        ha='center', fontsize=9, color=RED, style='italic')

ax.add_patch(FancyBboxPatch((5.7, 2.5), 5.0, 1.8,
                             boxstyle="round,pad=0.1",
                             facecolor='#FFFAF0', edgecolor=GOLD,
                             linewidth=3, alpha=0.95))
ax.text(8.2, 3.95, "選択肢B：「ポストダーマ」先取り (推奨)",
        ha='center', fontsize=11, fontweight='bold', color="#8B5A00")
ax.text(8.2, 3.45, "Sミルク機能訴求は維持しつつ、ブランド資産は",
        ha='center', fontsize=9.5, color='#444444')
ax.text(8.2, 3.1, "「ありのまま×日本×心」に二重投資",
        ha='center', fontsize=9.5, color='#444444', fontweight='bold')
ax.text(8.2, 2.65, "→ 2028年以降の自然回帰需要を独占する位置取り",
        ha='center', fontsize=9, color="#8B5A00", style='italic')

ax.text(5.5, 1.6, "Our Thesis", ha='center', fontsize=10, fontweight='bold',
        color=NAVY)
ax.text(5.5, 1.05,
        "「N organicの戦略的勝ち筋は、ダーマコスメ勝者になることではなく、ポストダーマコスメ時代の自然回帰需要を",
        ha='center', fontsize=10, color='#222222')
ax.text(5.5, 0.6,
        "独占する位置取りである。Sミルクは戦術として正解、ブランド資産投資は戦略として別軌道で進めるべきだ。」",
        ha='center', fontsize=10, color='#222222')

ax.set_xlim(0, 11); ax.set_ylim(0, 8.5)
ax.set_title("【図表3】N organic戦略仮説 — 「ポストダーマコスメ」への二重投資",
             fontsize=14, fontweight='bold', color=NAVY, pad=15, loc='left')
ax.set_xticks([]); ax.set_yticks([])
for spine in ax.spines.values():
    spine.set_visible(False)

plt.tight_layout()
out3 = os.path.join(OUTPUT_DIR, 'chart3_strategic_thesis.png')
plt.savefig(out3, dpi=180, bbox_inches='tight', facecolor='white')
plt.close()
print(f"Chart 3 saved: {out3}")

print("Charts 1-3 generated.")


# ====================================================================
# Chart 4: External x Internal GAP Dashboard (Layer 2 CONFIDENTIAL)
# ====================================================================
# ★ 月次実行時に以下の GAP_DATA を当月の内部KPI実績値に更新してから実行すること
# このチャートは社内向けスライド専用。外部配布資料には含めない。
# ★ 更新箇所：
#   - "internal_actual": 当月の実績値（目標比%）に差し替え
#   - "gap_notes": 実績に対する1行解釈を差し替え
GAP_DATA = {
    "metrics": [
        "定期UU達成率",
        "トライアルCPA達成率",
        "AF引き上げ率達成率",
        "Sミルク目標比",
        "Kyoto売上目標比",
    ],
    # 外部期待値（市場成長率・競合ベンチマークから推計）単位: %
    "external_expectation": [100, 100, 100, 120, 110],
    # ↓ ★ 毎月更新する箇所 ★
    # 内部実績値（議事録から取得・8月号）単位: %（目標比または昨対%）
    # ⚠️ 注意: 2026-08-12時点でGoogle Drive接続エラーにより最新議事録取得不可
    # 以下は6月号（Issue 04）確定値を暫定使用。実データ入手後に要更新。
    # 定期UU: 14224/17000=83.7%, CPA: 18000/20174=89.2%, AF: 22%/15%=146.7%
    # Sミルク: 356M/320M=111.3%, Kyoto: 2.19億/2.02億=108.4%
    "internal_actual": [84, 89, 147, 111, 108],
    # ↓ ★ 毎月更新する箇所 ★
    "gap_notes": [
        "※要更新 — 最新議事録未取得（6月実績: 83.7%）",
        "※要更新 — 最新議事録未取得（6月実績: CPA¥20,174）",
        "※要更新 — 最新議事録未取得（6月実績: AF 22%）",
        "※要更新 — 最新議事録未取得（6月実績: 目標+11%超）",
        "※要更新 — 最新議事録未取得（6月実績: 目標比108%）",
    ],
}

fig, (ax_left, ax_right) = plt.subplots(1, 2, figsize=(14, 7), dpi=180,
                                         gridspec_kw={'width_ratios': [1, 1.2]})
fig.patch.set_facecolor('white')

# === Left: External expectations ===
ax_left.set_facecolor('#F8F9FB')
y_pos = np.arange(len(GAP_DATA["metrics"]))
bars_ext = ax_left.barh(y_pos, GAP_DATA["external_expectation"],
                        color=NAVY, alpha=0.55, height=0.5,
                        edgecolor='white', linewidth=1.5)
for i, (bar, val) in enumerate(zip(bars_ext, GAP_DATA["external_expectation"])):
    ax_left.text(val + 1, i, f"{val}%", va='center', ha='left',
                fontsize=10, color=NAVY, fontweight='bold')
ax_left.set_yticks(y_pos)
ax_left.set_yticklabels(GAP_DATA["metrics"], fontsize=10)
ax_left.invert_yaxis()
ax_left.set_xlim(0, 160)
ax_left.set_xlabel("目標比・昨対 (%)", fontsize=10, color=GRAY)
ax_left.set_title("外部が期待する水準\n（市場成長・競合ベンチマーク）",
                  fontsize=11, fontweight='bold', color=NAVY, pad=10)
ax_left.axvline(x=100, color=GRAY, linestyle='--', alpha=0.5, linewidth=1)
ax_left.spines['top'].set_visible(False)
ax_left.spines['right'].set_visible(False)
ax_left.text(101, -0.8, "基準線\n(100%)", fontsize=8, color=GRAY)

# === Right: Internal actuals with GAP coloring ===
ax_right.set_facecolor('#FFF9F5')
colors_actual = []
for actual, expected in zip(GAP_DATA["internal_actual"], GAP_DATA["external_expectation"]):
    gap = actual - expected
    if gap >= 10:
        colors_actual.append(GREEN)
    elif gap >= -5:
        colors_actual.append(GOLD)
    else:
        colors_actual.append(RED)

bars_int = ax_right.barh(y_pos, GAP_DATA["internal_actual"],
                         color=colors_actual, alpha=0.80, height=0.5,
                         edgecolor='white', linewidth=1.5)
for i, (bar, val, note) in enumerate(zip(bars_int, GAP_DATA["internal_actual"],
                                          GAP_DATA["gap_notes"])):
    gap = val - GAP_DATA["external_expectation"][i]
    gap_str = f"+{gap}%" if gap >= 0 else f"{gap}%"
    gap_color = GREEN if gap >= 0 else RED
    ax_right.text(val + 1, i - 0.18, f"{val}%", va='center', ha='left',
                 fontsize=10, color='#333333', fontweight='bold')
    ax_right.text(val + 1, i + 0.18, f"({gap_str})", va='center', ha='left',
                 fontsize=9, color=gap_color, style='italic')
    ax_right.text(2, i, note, va='center', ha='left',
                 fontsize=7.5, color='#555555',
                 bbox=dict(boxstyle='round,pad=0.2', facecolor='white',
                           edgecolor='none', alpha=0.7))
ax_right.set_yticks(y_pos)
ax_right.set_yticklabels([""] * len(GAP_DATA["metrics"]))
ax_right.invert_yaxis()
ax_right.set_xlim(0, 170)
ax_right.set_xlabel("実績値 (%)", fontsize=10, color=GRAY)
ax_right.set_title("内部KPI実績\n（議事録より — 社内資料）",
                   fontsize=11, fontweight='bold', color="#8B0000", pad=10)
ax_right.axvline(x=100, color=GRAY, linestyle='--', alpha=0.5, linewidth=1)
ax_right.spines['top'].set_visible(False)
ax_right.spines['right'].set_visible(False)

legend_patches = [
    mpatches.Patch(color=GREEN, alpha=0.8, label='+10%以上（外部期待超過）'),
    mpatches.Patch(color=GOLD,  alpha=0.8, label='-5%〜+10%（概ね整合）'),
    mpatches.Patch(color=RED,   alpha=0.8, label='-5%以下（外部との乖離大）'),
]
ax_right.legend(handles=legend_patches, loc='lower right', fontsize=8.5,
                framealpha=0.9, edgecolor='#CCCCCC')

fig.text(0.5, 0.5, 'CONFIDENTIAL\nINTERNAL USE ONLY',
         fontsize=38, color='#CCCCCC', ha='center', va='center',
         rotation=30, alpha=0.25, fontweight='bold')
fig.suptitle("【図表4】外部×内部 GAPダッシュボード — 市場期待と内部現実の乖離分析",
             fontsize=13, fontweight='bold', color=NAVY, y=0.98)

plt.tight_layout(rect=[0, 0, 1, 0.95])
out4 = os.path.join(OUTPUT_DIR, 'chart4_gap_dashboard.png')
plt.savefig(out4, dpi=180, bbox_inches='tight', facecolor='white')
plt.close()
print(f"Chart 4 (CONFIDENTIAL) saved: {out4}")
print("All charts generated successfully.")