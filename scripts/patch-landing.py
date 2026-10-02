#!/usr/bin/env python3
"""Patch the design-tool export of the previous front page.

The site's front page is now the hand-built index.html and site/. This script is kept
in case the design-tool version is wanted again. It never writes to index.html.

Usage: python3 scripts/patch-landing.py

Reads  design/Genesis Landing Page.html  (the untouched export)
Writes design/Genesis Landing Page.patched.html  (the previous design-tool version of the front page)

Re-run this after every re-export. It applies four fixes and stops with an error
if the export no longer matches what a fix expects.

1. Moves the <div> out of the <noscript> in <head>. That is invalid HTML and
   Vite's HTML parser rejects it.
2. Repairs the icon masks. The export mangles `mask:url("{{ x }}")` inside a
   double-quoted style attribute, so the menu, theme, proof-tab and FAQ icons
   are blank.
3. Adds a "Log in" link to the header (desktop) and to the mobile menu. It
   points to /app/, the demo workspace.
4. Fixes the phone header, which is wider than a 375px screen: the theme toggle
   moves from the header into the mobile menu on narrow screens.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design" / "Genesis Landing Page.html"
OUT = ROOT / "design" / "Genesis Landing Page.patched.html"
APP_URL = "/app/"


def fail(msg):
    sys.exit(f"patch-landing: {msg}")


def once(text, old, new, label):
    if text.count(old) != 1:
        fail(f"{label}: expected exactly one match, found {text.count(old)}")
    return text.replace(old, new)


html = SRC.read_text(encoding="utf-8")

# 1. noscript in head -------------------------------------------------------
m = re.search(r"<noscript>\s*(<style>.*?</style>)\s*(<div.*?</div>)\s*</noscript>", html, re.S)
if not m:
    fail("noscript block not found")
html = html.replace(m.group(0), f"<noscript>{m.group(1)}</noscript>", 1)
html = once(html, '<body>\n  <div id="__bundler_thumbnail">', f'<body>\n  <noscript>{m.group(2)}</noscript>\n  <div id="__bundler_thumbnail">', "body tag")

# the template is a JSON string in its own script block
tm = re.search(r'(<script type="__bundler/template">)(.*?)(</script>)', html, re.S)
if not tm:
    fail("template block not found")
tpl = json.loads(tm.group(2))

# 2. icon masks ---------------------------------------------------------------
CASE = {"themeicon": "themeIcon", "menuicon": "menuIcon"}
mask_re = re.compile(
    r'-webkit-mask:url\(" \{\{="" (\S+?)="" \}\}"\)="" center="" (\d+)px="" '
    r'no-repeat;mask:url\("\{\{="" no-repeat"=""'
)
def fix_mask(m):
    expr = CASE.get(m.group(1), m.group(1))
    size = m.group(2)
    one = f"url('{{{{ {expr} }}}}') center/{size}px no-repeat"
    return f'-webkit-mask:{one};mask:{one}"'
tpl, n_masks = mask_re.subn(fix_mask, tpl)
if n_masks != 13:
    fail(f"icon masks: expected 13, fixed {n_masks}")

# 3 and 4. header ---------------------------------------------------------------
h0, h1 = tpl.index("<header"), tpl.index("</header>") + len("</header>")
header = tpl[h0:h1]

# theme toggle: wide screens only
bt = re.search(r'      <button type="button" sc-camel-on-click="\{\{ toggleTheme \}\}".*?</button>\n', header, re.S)
if not bt:
    fail("theme toggle button not found")
header = header.replace(
    bt.group(0),
    '      <sc-if value="{{ wide }}" hint-placeholder-val="{{ true }}">\n' + bt.group(0) + '      </sc-if>\n',
    1,
)

# desktop Log in link, before "Book a demo"
login = (
    '      <sc-if value="{{ wide }}" hint-placeholder-val="{{ true }}">\n'
    f'        <a href="{APP_URL}" style="height:44px;padding:0 14px;display:inline-flex;align-items:center;border-radius:8px;'
    'color:var(--text);font-weight:500;font-size:.9375rem;text-decoration:none;white-space:nowrap" '
    'style-hover="background:var(--bg-tint)">Log in</a>\n'
    '      </sc-if>\n'
)
header = once(header, '      <a href="#book" sc-camel-on-click="{{ go.book }}"', login + '      <a href="#book" sc-camel-on-click="{{ go.book }}"', "book button")

# mobile menu: Log in and theme toggle
item = "min-height:48px;display:flex;align-items:center;color:var(--text);text-decoration:none;font-weight:500;border-top:1px solid var(--border)"
menu_add = (
    f'      <a href="{APP_URL}" style="{item}">Log in</a>\n'
    '      <button type="button" sc-camel-on-click="{{ toggleTheme }}" '
    f'style="{item};width:100%;background:none;border-left:0;border-right:0;border-bottom:0;cursor:pointer;'
    'font-family:Roboto,system-ui,sans-serif;font-size:1rem;text-align:left;padding:0">{{ themeLabel }}</button>\n'
)
header = once(header, "    </nav>\n  </sc-if>\n</header>", menu_add + "    </nav>\n  </sc-if>\n</header>", "mobile menu end")

tpl = tpl[:h0] + header + tpl[h1:]

# re-encode exactly as the loader expects
encoded = json.dumps(tpl, ensure_ascii=True).replace("</script", "<\\/script")
html = html[: tm.start(2)] + "\n" + encoded + "\n" + html[tm.end(2):]

OUT.write_text(html, encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB): {n_masks} icon masks fixed, Log in added")
