#!/usr/bin/env python3
"""クリエイティブDB ビジュアル一覧ツール ビルダー

3つのマスタCSVを正規化し、サムネイル付きの単一HTMLを生成する。
"""

from __future__ import annotations

import csv
import html as html_module
import io
import json
import re
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRENDS_DIR = ROOT / "output" / "trends"
CACHE_PATH = TRENDS_DIR / "thumbnails_cache.json"
CACHE_V2_PATH = TRENDS_DIR / "thumbnails_cache_v2.json"
OUTPUT_PATH = TRENDS_DIR / "creative-gallery.html"

SOURCES = [
    {
        "id": "news",
        "label": "競合ニュース",
        "path": TRENDS_DIR / "competitive-news-master.csv",
        "fields": {
            "date": "調査日",
            "brand": "ブランド",
            "category": "カテゴリー",
            "platform": "媒体",
            "url": "URL",
            "format": "タイトル",
            "description": "概要",
            "cast": "キャンペーン名",
            "tags": "情報種別",
        },
    },
    {
        "id": "domestic",
        "label": "競合クリエイティブ（国内）",
        "path": TRENDS_DIR / "competitive-creative-master.csv",
        "fields": {
            "date": "調査日",
            "brand": "ブランド",
            "category": "カテゴリー",
            "platform": "プラットフォーム",
            "url": "URL",
            "format": "フォーマット",
            "description": "クリエイティブポイント",
            "cast": "タレント_キャスト",
            "tags": "トレンドタグ",
        },
    },
    {
        "id": "video",
        "label": "競合映像",
        "path": TRENDS_DIR / "competitive-video-master.csv",
        "fields": {
            "date": "調査日",
            "brand": "ブランド",
            "category": "カテゴリー",
            "platform": "プラットフォーム",
            "url": "URL",
            "format": "フォーマット",
            "description": "映像表現手法",
            "cast": "キャスト",
            "tags": "トレンドタグ",
        },
    },
    {
        "id": "global",
        "label": "グローバル映像クリエイティブ",
        "path": TRENDS_DIR / "global-creative-master.csv",
        "fields": {
            "date": "調査日",
            "brand": "ブランド_アーティスト",
            "category": "カテゴリー",
            "platform": "国_地域",
            "url": "URL",
            "format": "タイトル_作品名",
            "description": "映像表現の特徴",
            "cast": "監督_クリエイター",
            "tags": "トレンドタグ",
        },
    },
    {
        "id": "global_skincare",
        "label": "グローバルスキンケア",
        "path": TRENDS_DIR / "global-skincare-master.csv",
        "fields": {
            "date": "調査日",
            "brand": "ブランド_アーティスト",
            "category": "カテゴリー",
            "platform": "国_地域",
            "url": "URL",
            "format": "タイトル_作品名",
            "description": "映像表現の特徴",
            "cast": "監督_クリエイター",
            "tags": "トレンドタグ",
        },
    },
]


# ─── サムネ取得 ──────────────────────────────

YOUTUBE_RE = re.compile(
    r"(?:youtube\.com/(?:watch\?v=|shorts/|embed/)|youtu\.be/)([A-Za-z0-9_-]{6,})"
)


def youtube_thumbnail(url: str) -> str | None:
    """YouTube URLからサムネURLを生成。"""
    m = YOUTUBE_RE.search(url or "")
    if not m:
        return None
    return f"https://img.youtube.com/vi/{m.group(1)}/hqdefault.jpg"


def fetch_page_html(page_url: str) -> str | None:
    """ページのHTMLを取得（失敗時None）。"""
    if not page_url:
        return None
    try:
        req = urllib.request.Request(
            page_url, headers={"User-Agent": "Mozilla/5.0 (compatible; CreativeGalleryBot)"}
        )
        with urllib.request.urlopen(req, timeout=12) as r:
            return r.read(900_000).decode("utf-8", errors="ignore")
    except Exception:
        return None


def _abs_url(img_url: str, page_url: str) -> str:
    img_url = img_url.strip()
    if img_url.startswith("//"):
        return "https:" + img_url
    if img_url.startswith("/"):
        p = urllib.parse.urlparse(page_url)
        return f"{p.scheme}://{p.netloc}{img_url}"
    if img_url.startswith("http"):
        return img_url
    return urllib.parse.urljoin(page_url, img_url)


def _og_image_from_html(raw: str, page_url: str) -> str | None:
    for pat in (
        r'<meta\s+property=["\']og:image(?::url)?["\']\s+content=["\']([^"\']+)["\']',
        r'<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']',
        r'<meta\s+name=["\']twitter:image(?::src)?["\']\s+content=["\']([^"\']+)["\']',
    ):
        m = re.search(pat, raw, re.IGNORECASE)
        if m:
            return _abs_url(html_module.unescape(m.group(1)), page_url)
    return None


def fetch_ogp_image(page_url: str) -> str | None:
    """後方互換：OGP画像だけを取得。"""
    raw = fetch_page_html(page_url)
    return _og_image_from_html(raw, page_url) if raw else None


# 明らかにコンテンツ画像でないもの（ロゴ・アイコン・広告・SNS共有・トラッキング等）を除外
_BAD_IMG = re.compile(
    r"(logo|sprite|icon|favicon|avatar|gravatar|placeholder|blank|spacer|1x1|pixel|"
    r"tracking|beacon|emoji|badge|loading|/ads?[/_-]|doubleclick|adsystem|"
    r"share|social|footer|header[-_]|nav[-_]|\.svg(\?|$))",
    re.IGNORECASE,
)
_IMG_TAG = re.compile(r"<img\b[^>]*>", re.IGNORECASE)


def _attr(tag: str, name: str):
    return re.search(rf'{name}\s*=\s*["\']([^"\']+)["\']', tag, re.IGNORECASE)


def _pick_src(tag: str) -> str | None:
    for a in ("data-src", "data-original", "data-lazy-src", "data-lazy", "data-image"):
        m = _attr(tag, a)
        if m and m.group(1).strip():
            return m.group(1).strip()
    m = _attr(tag, "srcset")
    if m:
        parts = [p.strip().split(" ")[0] for p in m.group(1).split(",") if p.strip()]
        if parts:
            return parts[-1]  # srcsetの最後＝最大解像度が通例
    m = _attr(tag, "src")
    return m.group(1).strip() if m and m.group(1).strip() else None


def _int_attr(tag: str, name: str):
    m = _attr(tag, name)
    if not m:
        return None
    try:
        return int(re.sub(r"[^\d]", "", m.group(1)) or 0)
    except Exception:
        return None


def extract_image_candidates(raw: str, page_url: str) -> list[dict]:
    """ページ内の候補画像を alt / 周辺テキスト / ファイル名つきで列挙。"""
    cands: list[dict] = []
    seen: set[str] = set()
    og = _og_image_from_html(raw, page_url)
    if og:
        cands.append({"src": og, "alt": "", "ctx": "", "w": 1200, "is_og": True})
        seen.add(og)
    for m in _IMG_TAG.finditer(raw):
        tag = m.group(0)
        src = _pick_src(tag)
        if not src or src.startswith("data:"):
            continue
        src = _abs_url(html_module.unescape(src), page_url)
        if not src.startswith("http") or _BAD_IMG.search(src) or src in seen:
            continue
        w, h = _int_attr(tag, "width"), _int_attr(tag, "height")
        if (w and w < 120) or (h and h < 120):
            continue
        alt_m = _attr(tag, "alt")
        alt = html_module.unescape(alt_m.group(1)) if alt_m else ""
        s, e = max(0, m.start() - 220), min(len(raw), m.end() + 220)
        ctx = html_module.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", raw[s:e])))
        seen.add(src)
        cands.append({"src": src, "alt": alt, "ctx": ctx, "w": w or 0, "is_og": False})
    return cands


_TOKEN_SPLIT = re.compile(r"[×xX&・,/\s（）()\"'’“”—\-–|:：。、！!?？]+")


def _tokens(rec: dict):
    brand_toks, prod_toks = set(), set()
    for chunk in _TOKEN_SPLIT.split(rec.get("brand", "")):
        c = chunk.strip().lower()
        if len(c) >= 3 and not c.isdigit():
            brand_toks.add(c)
    for chunk in _TOKEN_SPLIT.split(rec.get("format", "")):
        c = chunk.strip().lower()
        if len(c) >= 4 and not c.isdigit():
            prod_toks.add(c)
    return brand_toks, prod_toks


def _score(cand: dict, brand_toks: set, prod_toks: set) -> float:
    alt, fn, ctx = cand["alt"].lower(), cand["src"].lower(), cand["ctx"].lower()
    s = 0.0
    for t in brand_toks:
        if t in alt: s += 6
        elif t in fn: s += 5
        elif t in ctx: s += 2.5
    for t in prod_toks:
        if t in alt: s += 3
        elif t in fn: s += 2
        elif t in ctx: s += 1.2
    if cand["is_og"]:
        s += 1.0            # 手掛かりが無いときだけOGPが勝つ程度の下駄
    if cand["w"] and cand["w"] >= 500:
        s += 0.8
    return s


def _assign_group(recs: list[dict], cands: list[dict], legacy_img: str | None) -> dict:
    """同一URLを共有する複数エントリに、可能な限り別々の画像を割り当てる。"""
    out: dict = {}
    if not cands:
        for r in recs:
            out[id(r)] = legacy_img
        return out
    multi = len(recs) > 1
    og_src = next((c["src"] for c in cands if c["is_og"]), None)
    ranked_per = []
    for r in recs:
        bt, pt = _tokens(r)
        ranked = sorted(cands, key=lambda c: _score(c, bt, pt), reverse=True)
        best = _score(ranked[0], bt, pt) if ranked else 0.0
        ranked_per.append((r, bt, pt, ranked, best))
    # マッチが強いエントリから先に選ばせ、弱いエントリに残りを回す
    ranked_per.sort(key=lambda x: x[4], reverse=True)
    used: set[str] = set()
    for r, bt, pt, ranked, _best in ranked_per:
        chosen = None
        for c in ranked:
            sc = _score(c, bt, pt)
            if multi and (not c["is_og"]) and c["src"] in used:
                continue
            if sc <= 1.0 and not c["is_og"]:
                break                      # コンテンツ画像に手掛かり無し→打ち切り
            chosen = c["src"]
            if not c["is_og"]:
                used.add(c["src"])
            break
        if chosen is None:                 # フォールバック
            if og_src and (not multi or og_src not in used):
                chosen = og_src
            else:
                spare = next(
                    (c["src"] for c in cands if not c["is_og"] and c["src"] not in used),
                    None,
                )
                chosen = spare or og_src or legacy_img
                if spare:
                    used.add(spare)
        out[id(r)] = chosen
    return out


# ─── CSV正規化 ──────────────────────────────

def split_tags(raw: str) -> list[str]:
    if not raw:
        return []
    parts = re.split(r"[#\s,、・/]+", raw.strip())
    return [p.lstrip("#").strip() for p in parts if p.strip()]


def load_records() -> list[dict]:
    records: list[dict] = []
    for src in SOURCES:
        if not src["path"].exists():
            print(f"[warn] missing: {src['path']}", file=sys.stderr)
            continue
        with src["path"].open(encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                f_map = src["fields"]
                url = (row.get(f_map["url"]) or "").strip()
                if not url:
                    continue
                records.append({
                    "source": src["id"],
                    "source_label": src["label"],
                    "date": (row.get(f_map["date"]) or "").strip(),
                    "brand": (row.get(f_map["brand"]) or "").strip(),
                    "category": (row.get(f_map["category"]) or "").strip(),
                    "platform": (row.get(f_map["platform"]) or "").strip(),
                    "url": url,
                    "format": (row.get(f_map["format"]) or "").strip(),
                    "description": (row.get(f_map["description"]) or "").strip(),
                    "cast": (row.get(f_map["cast"]) or "").strip(),
                    "tags": split_tags(row.get(f_map["tags"]) or ""),
                })
    return records


# ─── キャッシュ管理 ───────────────────────────

def load_cache() -> dict:
    if CACHE_PATH.exists():
        try:
            return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def save_cache(cache: dict) -> None:
    CACHE_PATH.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def load_cache_v2() -> dict:
    if CACHE_V2_PATH.exists():
        try:
            return json.loads(CACHE_V2_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def save_cache_v2(cache: dict) -> None:
    CACHE_V2_PATH.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def _sig(rec: dict) -> str:
    """エントリ単位のキャッシュキー（同一URLでもブランド／作品名で別画像を持つため）。"""
    return f"{rec['url']}\x01{rec.get('brand', '')}\x01{rec.get('format', '')[:60]}"


def enrich_thumbnails(records: list[dict]) -> None:
    legacy = load_cache()        # 旧 url->img（フォールバック用に読むだけ）
    cache = load_cache_v2()      # sig->img（新方式）

    pending = []
    for rec in records:
        yt = youtube_thumbnail(rec["url"])
        if yt:                                   # YouTube等は動画固有サムネ
            rec["thumbnail_url"] = yt
            continue
        k = _sig(rec)
        if k in cache:
            rec["thumbnail_url"] = cache[k]
        else:
            pending.append(rec)

    print(f"[info] {len(records)} records, {len(pending)} to resolve (v2 cache: {len(cache)})")
    if not pending:
        return

    groups: dict[str, list[dict]] = {}
    for r in pending:
        groups.setdefault(r["url"], []).append(r)
    urls = list(groups)

    # ページHTMLはURL単位で1回だけ取得（共有URLの重複取得を防ぐ）
    html_map: dict[str, str | None] = {}
    done = 0
    with ThreadPoolExecutor(max_workers=12) as ex:
        fut = {ex.submit(fetch_page_html, u): u for u in urls}
        for f in as_completed(fut):
            u = fut[f]
            try:
                html_map[u] = f.result()
            except Exception:
                html_map[u] = None
            done += 1
            if done % 25 == 0 or done == len(urls):
                print(f"[info] fetched {done}/{len(urls)} pages")

    for u, recs in groups.items():
        raw = html_map.get(u)
        cands = extract_image_candidates(raw, u) if raw else []
        assign = _assign_group(recs, cands, legacy.get(u))
        for r in recs:
            img = assign.get(id(r)) or legacy.get(u)
            r["thumbnail_url"] = img
            cache[_sig(r)] = img

    save_cache_v2(cache)


# ─── HTML生成 ────────────────────────────────

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>クリエイティブDB</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, 'Hiragino Sans', 'Yu Gothic UI', sans-serif; display: flex; height: 100dvh; overflow: hidden; color: #1a1a1a; background: #f4f4f6; font-size: 13px; }

/* ── sidebar ── */
.sidebar { width: 232px; flex-shrink: 0; background: #fff; border-right: 1px solid #e8e8ec; display: flex; flex-direction: column; height: 100dvh; overflow: hidden; }
.sidebar-top { padding: 18px 16px 14px; border-bottom: 1px solid #ebebef; }
.sidebar-top h1 { font-size: 0.95em; font-weight: 700; letter-spacing: 0.03em; color: #111; }
.sidebar-top .db-meta { font-size: 0.72em; color: #999; margin-top: 3px; }
.sidebar-scroll { flex: 1; overflow-y: auto; padding: 14px 16px 0; display: flex; flex-direction: column; gap: 18px; }
.sidebar-scroll::-webkit-scrollbar { width: 4px; }
.sidebar-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
.sidebar-footer { padding: 12px 16px; border-top: 1px solid #ebebef; }

/* filter groups */
.fg label { display: block; font-size: 0.68em; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #aaa; margin-bottom: 8px; }
.search-input { width: 100%; padding: 7px 10px; font-size: 0.88em; border: 1px solid #e0e0e5; border-radius: 7px; outline: none; background: #fafafa; color: #1a1a1a; }
.search-input:focus { border-color: #888; background: #fff; }
.search-input.sm { font-size: 0.8em; padding: 5px 9px; margin-bottom: 6px; }

/* source chips */
.source-chips { display: flex; flex-direction: column; gap: 3px; }
.src-chip { display: flex; align-items: center; gap: 9px; padding: 7px 10px; border-radius: 7px; border: 1px solid transparent; background: #f6f6f8; cursor: pointer; user-select: none; transition: all 0.12s; }
.src-chip:hover { background: #efeff2; }
.src-chip.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.src-chip.active .src-count { color: rgba(255,255,255,0.55); }
.src-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.src-name { flex: 1; font-size: 0.83em; font-weight: 500; }
.src-count { font-size: 0.75em; color: #bbb; }

/* scroll lists (brand / platform) */
.scroll-list { max-height: 152px; overflow-y: auto; border: 1px solid #e8e8ec; border-radius: 7px; }
.scroll-list::-webkit-scrollbar { width: 4px; }
.scroll-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
.sl-item { display: flex; align-items: center; gap: 8px; padding: 5px 10px; border-bottom: 1px solid #f2f2f5; cursor: pointer; transition: background 0.1s; }
.sl-item:last-child { border-bottom: none; }
.sl-item:hover { background: #f8f8fa; }
.sl-item input[type=checkbox] { width: 13px; height: 13px; accent-color: #1a1a1a; flex-shrink: 0; cursor: pointer; }
.sl-name { flex: 1; font-size: 0.82em; color: #222; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sl-count { font-size: 0.72em; color: #bbb; flex-shrink: 0; }
.sl-empty { padding: 12px 10px; font-size: 0.78em; color: #ccc; text-align: center; }

/* sort */
.sort-select { width: 100%; padding: 7px 10px; font-size: 0.85em; border: 1px solid #e0e0e5; border-radius: 7px; background: #fafafa; outline: none; color: #1a1a1a; }

/* latest toggle */
.latest-toggle { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 7px; border: 1px solid #e0e0e5; background: #fafafa; cursor: pointer; user-select: none; transition: all 0.12s; }
.latest-toggle:hover { background: #f0f0f3; }
.latest-toggle.active { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
.latest-toggle.active .lt-sub { color: rgba(255,255,255,0.5); }
.lt-switch { width: 28px; height: 16px; background: #ddd; border-radius: 999px; position: relative; flex-shrink: 0; transition: background 0.15s; }
.lt-switch::after { content: ''; position: absolute; width: 12px; height: 12px; background: #fff; border-radius: 50%; top: 2px; left: 2px; transition: left 0.15s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.latest-toggle.active .lt-switch { background: #4CAF50; }
.latest-toggle.active .lt-switch::after { left: 14px; }
.lt-text { flex: 1; }
.lt-main { font-size: 0.83em; font-weight: 600; }
.lt-sub { font-size: 0.7em; color: #aaa; margin-top: 1px; }

/* reset */
.reset-btn { width: 100%; padding: 8px; background: #f6f6f8; border: 1px solid #e0e0e5; border-radius: 7px; font-size: 0.82em; cursor: pointer; color: #666; transition: all 0.12s; }
.reset-btn:hover { background: #ebebef; color: #1a1a1a; }

/* copy button */
.copy-btn { width: 100%; padding: 9px; background: #1a1a1a; border: none; border-radius: 7px; font-size: 0.82em; cursor: pointer; color: #fff; font-weight: 600; transition: all 0.12s; margin-bottom: 7px; display: flex; align-items: center; justify-content: center; gap: 6px; }
.copy-btn:hover:not(:disabled) { background: #333; }
.copy-btn:disabled { background: #ccc; cursor: default; color: #fff; }
.copy-btn .copy-count { font-size: 0.85em; opacity: 0.7; font-weight: 400; }
.copy-btn.copied { background: #2e7d32; }

/* card checkbox */
.card { position: relative; }
.card-check-wrap { position: absolute; top: 7px; right: 7px; z-index: 3; }
.card-check-wrap input[type=checkbox] { width: 17px; height: 17px; accent-color: #1a1a1a; cursor: pointer; border-radius: 3px; display: block; box-shadow: 0 1px 4px rgba(0,0,0,0.35); }
.card-selected { outline: 2px solid #1a1a1a; outline-offset: -2px; }

/* ── main ── */
.main-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; min-width: 0; }
.results-bar { padding: 9px 20px; background: #f4f4f6; border-bottom: 1px solid #e8e8ec; font-size: 0.78em; color: #888; position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 8px; }
.active-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.active-tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px 2px 10px; background: #1a1a1a; color: #fff; border-radius: 999px; font-size: 0.85em; cursor: pointer; }
.active-tag::after { content: "×"; opacity: 0.6; }

/* grid */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; padding: 16px 20px 48px; }
.card { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.07); display: flex; flex-direction: column; transition: transform 0.14s, box-shadow 0.14s; }
.card:hover { transform: translateY(-2px); box-shadow: 0 5px 18px rgba(0,0,0,0.1); }
.thumb { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: #e0e0e5; }
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb-ph { width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #5a6c7d 0%, #2c3e50 100%); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.8); font-weight: 600; font-size: 0.88em; text-align: center; padding: 10px; }
.card-body { padding: 11px 13px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
.brand-row { display: flex; align-items: center; gap: 6px; }
.brand-name { font-weight: 600; font-size: 0.9em; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.src-badge { font-size: 0.6em; padding: 2px 6px; border-radius: 3px; color: #fff; white-space: nowrap; flex-shrink: 0; }
.src-news { background: #e67e22; }
.src-domestic { background: #c0392b; }
.src-video { background: #2980b9; }
.src-global { background: #16a085; }
.meta-line { font-size: 0.7em; color: #999; }
.desc { font-size: 0.78em; color: #555; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.tag-row { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 2px; }
.tag { font-size: 0.66em; padding: 2px 6px; background: #f2f2f5; border-radius: 3px; color: #777; cursor: pointer; }
.tag:hover { background: #e5e5ea; }
.footer-link { font-size: 0.72em; color: #0066cc; text-decoration: none; margin-top: auto; padding-top: 6px; border-top: 1px solid #f2f2f5; }
.footer-link:hover { text-decoration: underline; }
.empty { padding: 80px 20px; text-align: center; color: #bbb; grid-column: 1/-1; font-size: 0.9em; }

/* mobile */
@media (max-width: 720px) {
  body { flex-direction: column; height: auto; overflow: auto; }
  .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid #e8e8ec; }
  .sidebar-scroll { max-height: 320px; }
  .main-content { overflow: visible; }
}
</style>
</head>
<body>
<aside class="sidebar">
  <div class="sidebar-top">
    <h1>Creative DB</h1>
    <div class="db-meta">__SUMMARY__</div>
  </div>
  <div class="sidebar-scroll">
    <div class="fg">
      <label>期間</label>
      <div class="latest-toggle" id="latest-toggle">
        <div class="lt-switch"></div>
        <div class="lt-text">
          <div class="lt-main">今週分（最新）のみ</div>
          <div class="lt-sub" id="latest-date-label"></div>
        </div>
      </div>
    </div>
    <div class="fg">
      <label>キーワード</label>
      <input type="text" class="search-input" id="search" placeholder="ブランド・説明・タグなど">
    </div>
    <div class="fg">
      <label>ソース</label>
      <div class="source-chips" id="source-chips"></div>
    </div>
    <div class="fg">
      <label>ブランド</label>
      <input type="text" class="search-input sm" id="brand-search" placeholder="絞り込み...">
      <div class="scroll-list" id="brand-list"></div>
    </div>
    <div class="fg">
      <label>プラットフォーム</label>
      <div class="scroll-list" id="platform-list"></div>
    </div>
    <div class="fg">
      <label>並び替え</label>
      <select class="sort-select" id="sort">
        <option value="date_desc">新しい順</option>
        <option value="date_asc">古い順</option>
        <option value="brand">ブランド名</option>
      </select>
    </div>
  </div>
  <div class="sidebar-footer">
    <button class="copy-btn" id="copy-btn" disabled>
      URLをコピー<span class="copy-count" id="copy-count"></span>
    </button>
    <button class="reset-btn" id="reset-btn">フィルタをリセット</button>
  </div>
</aside>
<main class="main-content">
  <div class="results-bar">
    <span id="summary-text"></span>
    <div class="active-tags" id="active-tags"></div>
  </div>
  <div class="grid" id="grid"></div>
</main>
<script>
const DATA = __DATA__;
const SOURCE_LABELS = __SOURCE_LABELS__;
const SRC_COLORS = { news: '#e67e22', domestic: '#c0392b', video: '#2980b9', global: '#16a085' };

// compute latest-week threshold from DATA
const ALL_DATES = DATA.map(r => r.date).filter(Boolean).sort();
const MAX_DATE = ALL_DATES[ALL_DATES.length - 1] || '';
const WEEK_START = MAX_DATE
  ? new Date(new Date(MAX_DATE).getTime() - 6 * 86400000).toISOString().slice(0, 10)
  : '';

const state = {
  search: '',
  sources: new Set(),
  brands: new Set(),
  platforms: new Set(),
  sort: 'date_desc',
  brandSearch: '',
  latestOnly: false,
  selectedUrls: new Set(),
};

function esc(s) {
  return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// matchesFilter excluding one field (for contextual counts)
function matchesWith(r, skip) {
  if (state.latestOnly && WEEK_START && (r.date||'') < WEEK_START) return false;
  if (skip !== 'source' && state.sources.size && !state.sources.has(r.source)) return false;
  if (skip !== 'brand' && state.brands.size && !state.brands.has(r.brand)) return false;
  if (skip !== 'platform' && state.platforms.size && !state.platforms.has(r.platform)) return false;
  if (state.search) {
    const q = state.search.toLowerCase();
    if (![r.brand, r.category, r.platform, r.format, r.description, r.cast, ...(r.tags||[])].join(' ').toLowerCase().includes(q)) return false;
  }
  return true;
}
function matchesAll(r) { return matchesWith(r, null); }

function counts(field, skip) {
  const m = {};
  DATA.filter(r => matchesWith(r, skip)).forEach(r => { const v = r[field]; if (v) m[v] = (m[v]||0)+1; });
  return m;
}

function sortRecords(recs) {
  return [...recs].sort((a, b) => {
    if (state.sort === 'brand') return (a.brand||'').localeCompare(b.brand||'', 'ja');
    if (state.sort === 'date_asc') return (a.date||'').localeCompare(b.date||'');
    return (b.date||'').localeCompare(a.date||'');
  });
}

/* ── render source chips ── */
function renderSources() {
  const el = document.getElementById('source-chips');
  const srcCounts = counts('source', 'source');
  el.innerHTML = '';
  Object.keys(SOURCE_LABELS).forEach(src => {
    const active = state.sources.has(src);
    const dot = `<span class="src-dot" style="background:${SRC_COLORS[src]||'#888'}"></span>`;
    const d = document.createElement('div');
    d.className = 'src-chip' + (active ? ' active' : '');
    d.innerHTML = `${dot}<span class="src-name">${esc(SOURCE_LABELS[src])}</span><span class="src-count">${srcCounts[src]||0}</span>`;
    d.addEventListener('click', () => {
      if (state.sources.has(src)) state.sources.delete(src); else state.sources.add(src);
      renderSources(); renderBrands(); renderPlatforms(); renderResults();
    });
    el.appendChild(d);
  });
}

/* ── render brand list ── */
function renderBrands() {
  const el = document.getElementById('brand-list');
  const bCounts = counts('brand', 'brand');
  const q = state.brandSearch.toLowerCase();
  let brands = Object.keys(bCounts).sort((a, b) => a.localeCompare(b, 'ja'));
  if (q) brands = brands.filter(b => b.toLowerCase().includes(q));
  if (!brands.length) { el.innerHTML = '<div class="sl-empty">該当なし</div>'; return; }
  el.innerHTML = brands.map(b =>
    `<label class="sl-item"><input type="checkbox" data-field="brand" data-value="${esc(b)}" ${state.brands.has(b) ? 'checked' : ''}><span class="sl-name" title="${esc(b)}">${esc(b)}</span><span class="sl-count">${bCounts[b]}</span></label>`
  ).join('');
  el.querySelectorAll('input[data-field=brand]').forEach(inp => {
    inp.addEventListener('change', () => {
      const v = inp.dataset.value;
      if (inp.checked) state.brands.add(v); else state.brands.delete(v);
      renderBrands(); renderPlatforms(); renderActiveTags(); renderResults();
    });
  });
}

/* ── render platform list ── */
function renderPlatforms() {
  const el = document.getElementById('platform-list');
  const pCounts = counts('platform', 'platform');
  const plats = Object.keys(pCounts).filter(Boolean).sort((a, b) => pCounts[b] - pCounts[a]);
  if (!plats.length) { el.innerHTML = '<div class="sl-empty">該当なし</div>'; return; }
  el.innerHTML = plats.map(p =>
    `<label class="sl-item"><input type="checkbox" data-field="platform" data-value="${esc(p)}" ${state.platforms.has(p) ? 'checked' : ''}><span class="sl-name" title="${esc(p)}">${esc(p)}</span><span class="sl-count">${pCounts[p]}</span></label>`
  ).join('');
  el.querySelectorAll('input[data-field=platform]').forEach(inp => {
    inp.addEventListener('change', () => {
      const v = inp.dataset.value;
      if (inp.checked) state.platforms.add(v); else state.platforms.delete(v);
      renderBrands(); renderPlatforms(); renderActiveTags(); renderResults();
    });
  });
}

/* ── active tag pills ── */
function renderActiveTags() {
  const el = document.getElementById('active-tags');
  const tags = [];
  state.brands.forEach(b => tags.push({ label: b, remove: () => { state.brands.delete(b); renderAll(); } }));
  state.platforms.forEach(p => tags.push({ label: p, remove: () => { state.platforms.delete(p); renderAll(); } }));
  if (!tags.length) { el.innerHTML = ''; return; }
  el.innerHTML = tags.map((t, i) => `<span class="active-tag" data-i="${i}">${esc(t.label)}</span>`).join('');
  el.querySelectorAll('.active-tag').forEach((span, i) => {
    span.addEventListener('click', () => { tags[i].remove(); });
  });
}

/* ── copy button state ── */
function updateCopyBtn() {
  const btn = document.getElementById('copy-btn');
  const cnt = document.getElementById('copy-count');
  const n = state.selectedUrls.size;
  btn.disabled = n === 0;
  cnt.textContent = n > 0 ? ` (${n}件)` : '';
}

/* ── render grid ── */
function renderResults() {
  const filtered = DATA.filter(matchesAll);
  const sorted = sortRecords(filtered);
  document.getElementById('summary-text').textContent = `${DATA.length}件中 ${filtered.length}件表示`;
  const grid = document.getElementById('grid');
  if (!sorted.length) { grid.innerHTML = '<div class="empty">該当するクリエイティブがありません</div>'; return; }
  grid.innerHTML = sorted.map(r => {
    const sel = state.selectedUrls.has(r.url);
    const thumb = r.thumbnail_url
      ? `<div class="thumb"><img loading="lazy" src="${esc(r.thumbnail_url)}" alt="${esc(r.brand)}" onerror="this.parentElement.outerHTML='<div class=thumb-ph>${esc(r.brand||'—')}</div>'"></div>`
      : `<div class="thumb-ph">${esc(r.brand || r.format || '—')}</div>`;
    const tags = (r.tags||[]).slice(0,5).map(t => `<span class="tag" data-tag="${esc(t)}">${esc(t)}</span>`).join('');
    return `<div class="card${sel ? ' card-selected' : ''}" data-url="${esc(r.url)}">
      <div class="card-check-wrap"><input type="checkbox" class="card-check" data-url="${esc(r.url)}"${sel ? ' checked' : ''}></div>
      ${thumb}<div class="card-body">
      <div class="brand-row"><span class="brand-name">${esc(r.brand || r.format || '—')}</span><span class="src-badge src-${r.source}">${SOURCE_LABELS[r.source]}</span></div>
      <div class="meta-line">${esc(r.date)} · ${esc(r.platform)}</div>
      <div class="desc">${esc(r.description)}</div>
      <div class="tag-row">${tags}</div>
      <a class="footer-link" href="${esc(r.url)}" target="_blank" rel="noopener">元URLを開く →</a>
    </div></div>`;
  }).join('');
  grid.querySelectorAll('.tag').forEach(el => {
    el.addEventListener('click', () => {
      state.search = el.dataset.tag;
      document.getElementById('search').value = el.dataset.tag;
      renderBrands(); renderPlatforms(); renderActiveTags(); renderResults();
    });
  });
  grid.querySelectorAll('.card-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const url = cb.dataset.url;
      if (cb.checked) state.selectedUrls.add(url); else state.selectedUrls.delete(url);
      cb.closest('.card').classList.toggle('card-selected', cb.checked);
      updateCopyBtn();
    });
  });
}

function renderAll() {
  renderSources(); renderBrands(); renderPlatforms(); renderActiveTags(); renderResults();
}

/* ── init ── */
// init latest toggle label
(function() {
  const lbl = document.getElementById('latest-date-label');
  if (WEEK_START && MAX_DATE) lbl.textContent = WEEK_START + ' 〜 ' + MAX_DATE;
})();

document.getElementById('latest-toggle').addEventListener('click', () => {
  state.latestOnly = !state.latestOnly;
  document.getElementById('latest-toggle').classList.toggle('active', state.latestOnly);
  renderSources(); renderBrands(); renderPlatforms(); renderActiveTags(); renderResults();
});
document.getElementById('search').addEventListener('input', e => {
  state.search = e.target.value;
  renderBrands(); renderPlatforms(); renderActiveTags(); renderResults();
});
document.getElementById('brand-search').addEventListener('input', e => {
  state.brandSearch = e.target.value;
  renderBrands();
});
document.getElementById('sort').addEventListener('change', e => { state.sort = e.target.value; renderResults(); });
document.getElementById('reset-btn').addEventListener('click', () => {
  state.search = ''; state.brandSearch = ''; state.latestOnly = false;
  state.sources.clear(); state.brands.clear(); state.platforms.clear();
  document.getElementById('search').value = '';
  document.getElementById('brand-search').value = '';
  document.getElementById('latest-toggle').classList.remove('active');
  renderAll();
});

document.getElementById('copy-btn').addEventListener('click', () => {
  if (!state.selectedUrls.size) return;
  const text = [...state.selectedUrls].join('\\n');
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    const cnt = document.getElementById('copy-count');
    btn.classList.add('copied');
    btn.firstChild.textContent = 'コピー済み ✓';
    cnt.textContent = '';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.firstChild.textContent = 'URLをコピー';
      updateCopyBtn();
    }, 2000);
  });
});

renderAll();
</script>
</body>
</html>
"""


def build_html(records: list[dict]) -> str:
    by_source: dict[str, int] = {}
    for r in records:
        by_source[r["source"]] = by_source.get(r["source"], 0) + 1
    summary = f"全{len(records)}件　" + " / ".join(
        f"{s['label']} {by_source.get(s['id'], 0)}件" for s in SOURCES
    )
    source_labels = {s["id"]: s["label"] for s in SOURCES}

    return (HTML_TEMPLATE
        .replace("__SUMMARY__", html_module.escape(summary))
        .replace("__DATA__", json.dumps(records, ensure_ascii=False))
        .replace("__SOURCE_LABELS__", json.dumps(source_labels, ensure_ascii=False))
    )


# ─── メイン ──────────────────────────────────

def main() -> int:
    records = load_records()
    enrich_thumbnails(records)
    html_out = build_html(records)
    OUTPUT_PATH.write_text(html_out, encoding="utf-8")
    with_thumb = sum(1 for r in records if r.get("thumbnail_url"))
    print(f"[done] {OUTPUT_PATH} — {len(records)} records, {with_thumb} with thumbnails")
    return 0


if __name__ == "__main__":
    sys.exit(main())
