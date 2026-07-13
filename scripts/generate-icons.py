"""Generate app icons: blue elegant background with white "GH" initials."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ICONS_DIR = Path(__file__).resolve().parent.parent / "src-tauri" / "icons"
BG_COLOR = (37, 99, 235)  # #2563eb — elegant blue
TEXT_COLOR = (255, 255, 255)  # white

# PNG files to generate: filename -> size
PNG_SIZES = {
    "32x32.png": 32,
    "128x128.png": 128,
    "128x128@2x.png": 256,
    "Square30x30Logo.png": 30,
    "Square44x44Logo.png": 44,
    "Square71x71Logo.png": 71,
    "Square89x89Logo.png": 89,
    "Square107x107Logo.png": 107,
    "Square142x142Logo.png": 142,
    "Square150x150Logo.png": 150,
    "Square284x284Logo.png": 284,
    "Square310x310Logo.png": 310,
    "StoreLogo.png": 50,
}

# ICO sizes to embed
ICO_SIZES = [32, 48, 64, 128, 256]


def get_font(draw: ImageDraw.ImageDraw, text: str, max_width: int, max_height: int):
    """Try to load a system font, fall back to default."""
    font_paths = [
        "C:/Windows/Fonts/seguiemj.ttf",   # Segoe UI Emoji
        "C:/Windows/Fonts/seguisb.ttf",    # Segoe UI Semibold
        "C:/Windows/Fonts/segoeui.ttf",    # Segoe UI
        "C:/Windows/Fonts/arial.ttf",      # Arial
        "C:/Windows/Fonts/calibri.ttf",    # Calibri
    ]

    # Start with a large size and shrink until text fits
    size = min(max_width, max_height)
    while size > 8:
        for fp in font_paths:
            if Path(fp).exists():
                try:
                    font = ImageFont.truetype(fp, size)
                except Exception:
                    continue
                bbox = draw.textbbox((0, 0), text, font=font)
                tw = bbox[2] - bbox[0]
                th = bbox[3] - bbox[1]
                if tw <= max_width * 0.82 and th <= max_height * 0.75:
                    return font
        size -= 2

    # Ultimate fallback
    return ImageFont.load_default()


def draw_rounded_rect(draw, xy, radius, fill):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def make_png(size: int) -> Image.Image:
    """Create a square RGBA image with rounded blue bg and white GH text."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded rectangle background (radius proportional to size)
    radius = max(2, int(size * 0.18))
    draw_rounded_rect(draw, (0, 0, size - 1, size - 1), radius=radius, fill=BG_COLOR)

    # Draw "GH" text centered
    text = "GH"
    font = get_font(draw, text, size, size)

    # Center the text
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1]

    draw.text((x, y), text, fill=TEXT_COLOR, font=font)

    return img


def make_ico(images: dict[int, Image.Image]) -> bytes:
    """
    Build a .ico file containing multiple sizes.
    Pillow's save(..., format="ICO") with append_images handles this.
    """
    # Sort by size descending (largest first for base image)
    sorted_sizes = sorted(images.keys(), reverse=True)
    base_img = images[sorted_sizes[0]]
    extra_imgs = [images[s] for s in sorted_sizes[1:]]

    import io
    buf = io.BytesIO()
    base_img.save(buf, format="ICO", sizes=[(s, s) for s in sorted_sizes])
    return buf.getvalue()


def main():
    ICONS_DIR.mkdir(parents=True, exist_ok=True)

    # Generate all PNGs
    images = {}
    for fname, size in PNG_SIZES.items():
        img = make_png(size)
        images[size] = img
        out_path = ICONS_DIR / fname
        img.save(out_path, "PNG")
        print(f"  ✓ {fname} ({size}×{size})")

    # Generate icon.ico with multiple sizes
    ico_sizes_available = {s: images[s] for s in ICO_SIZES if s in images}
    # We need 48 and 64 too — generate them on-the-fly
    for extra in [48, 64]:
        if extra not in ico_sizes_available:
            ico_sizes_available[extra] = make_png(extra)

    ico_path = ICONS_DIR / "icon.ico"
    ico_data = make_ico(ico_sizes_available)
    # Pillow save with sizes parameter
    sorted_ico = sorted(ico_sizes_available.keys(), reverse=True)
    base = ico_sizes_available[sorted_ico[0]]
    base.save(str(ico_path), format="ICO", sizes=[(s, s) for s in sorted_ico])
    print(f"  ✓ icon.ico ({sorted_ico})")

    print(f"\nDone! {len(PNG_SIZES)} PNGs + 1 ICO generated in {ICONS_DIR}")


if __name__ == "__main__":
    main()