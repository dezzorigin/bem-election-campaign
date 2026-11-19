#!/usr/bin/env python3
"""Generate og-image.png 1200x630 for bem-election-campaign (PIL, local only).

Design follows the site's own language (docs/DESIGN.md):
paper #FDFBF3, teal almamater #0E7C7B, ink #14201E, red #C1121F,
yellow highlight #FFD60A. No gradients, no emoji — a plain campaign card.
The candidate photo is NOT embedded (kept as the site's own asset);
this is a designed preview card, not a screenshot.
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAPER = (253, 251, 243)  # #FDFBF3
TEAL = (14, 124, 123)    # #0E7C7B
INK = (20, 32, 30)       # #14201E
RED = (193, 18, 31)      # #C1121F
YELLOW = (255, 214, 10)  # #FFD60A
GREY = (92, 107, 102)    # #5C6B66

SANS_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONO_B = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img)

# teal band at top + red rule under it
d.rectangle([0, 0, W, 12], fill=TEAL)
d.rectangle([0, 12, W, 16], fill=RED)

# kicker
f_kick = ImageFont.truetype(MONO_B, 30)
d.text((72, 58), "PEMILIHAN KETUA BEM  ·  2026", font=f_kick, fill=TEAL)

# number badge (red square) + name
f_num = ImageFont.truetype(MONO_B, 44)
d.rectangle([72, 128, 190, 238], fill=RED)
d.text((96, 152), "01", font=f_num, fill=PAPER)

f_title = ImageFont.truetype(SANS_B, 132)
d.text((216, 118), "Hamdan", font=f_title, fill=INK)

# slogan with yellow highlight bar behind "kerja"
f_slogan = ImageFont.truetype(SANS_B, 52)
d.rectangle([72, 268, 660, 330], fill=YELLOW)
d.text((72, 270), "BEM yang kerja,", font=f_slogan, fill=INK)
d.text((72, 334), "bukan sekadar janji.", font=f_slogan, fill=INK)

# program chips row
f_chip = ImageFont.truetype(MONO_B, 26)
chips = ["5 PROGRAM KERJA", "SIMULASI COBLOS", "VISI & MISI"]
x = 72
y = 436
for label in chips:
    tw = d.textlength(label, font=f_chip)
    pad_x, pad_y = 22, 12
    d.rectangle([x, y, x + tw + pad_x * 2, y + 52], outline=INK, width=3)
    d.text((x + pad_x, y + 11), label, font=f_chip, fill=INK)
    x += tw + pad_x * 2 + 20

# red stamp circle, right side
cx, cy, r = 1010, 480, 92
d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=RED, width=6)
d.ellipse([cx - r + 14, cy - r + 14, cx + r - 14, cy + r - 14], outline=RED, width=3)
f_stamp = ImageFont.truetype(MONO_B, 34)
tw = d.textlength("COBLOS", font=f_stamp)
d.text((cx - tw / 2, cy - 20), "COBLOS", font=f_stamp, fill=RED)

# footer url
f_url = ImageFont.truetype(MONO_B, 28)
d.text((72, 540), "bem-election-campaign.pages.dev", font=f_url, fill=GREY)

img.save("/home/hatch/workspace/bem-election-campaign/og-image.png", "PNG", optimize=True)
print("saved og-image.png")
