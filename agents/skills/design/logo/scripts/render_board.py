#!/usr/bin/env python3
"""Assemble a self-contained SVG board without regenerating its source artwork."""

import argparse
import base64
import json
import math
import textwrap
from html import escape
from pathlib import Path
from xml.etree import ElementTree


def text(value, label):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{label} must be a non-empty string")
    return value


def lines(value, label, width, font_size):
    return textwrap.wrap(text(value, label), width=max(1, width // font_size),
                         break_on_hyphens=False)


def label(parts, content, x, y, font_size, step, bold=False):
    weight = ' font-weight="600"' if bold else ""
    for index, line in enumerate(content):
        parts.append(f'<text x="{x}" y="{y+index*step}" font-size="{font_size}"{weight}>{escape(line)}</text>')


def image(value, folder, x, y, width, height):
    if not isinstance(value, str) or not value:
        raise ValueError("Asset paths must be non-empty strings")
    path = folder / value
    data = path.read_bytes()
    if path.suffix.lower() == ".svg":
        if ElementTree.fromstring(data).tag != "{http://www.w3.org/2000/svg}svg":
            raise ValueError(f"Not an SVG image: {path}")
        mime = "image/svg+xml"
    elif data.startswith(b"\x89PNG\r\n\x1a\n"):
        mime = "image/png"
    elif data.startswith(b"\xff\xd8\xff"):
        mime = "image/jpeg"
    elif data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        mime = "image/webp"
    else:
        raise ValueError(f"Unsupported image: {path}. Use SVG, PNG, JPEG or WebP.")
    encoded = base64.b64encode(data).decode("ascii")
    return (
        f'<image x="{x}" y="{y}" width="{width}" height="{height}" '
        f'preserveAspectRatio="xMidYMid meet" href="data:{mime};base64,{encoded}"/>'
    )


def board(spec, folder):
    if not isinstance(spec, dict):
        raise ValueError("The spec must be a JSON object")
    title = text(spec.get("title"), "title")
    cards = spec.get("concepts")
    if not isinstance(cards, list) or not cards:
        raise ValueError("concepts must be a non-empty array")
    columns = spec.get("columns", min(len(cards), 4))
    if type(columns) is not int or not 1 <= columns <= 4:
        raise ValueError("columns must be an integer from 1 to 4")
    rows = math.ceil(len(cards) / columns)
    width = 100 + columns * 560
    title_lines = lines(title, "title", width-100, 32)
    status_lines = lines(spec.get("status", "DRAFT CONCEPTS"), "status", width-100, 17)
    status_y = 70 + 38 * (len(title_lines)-1) + 28
    header = status_y + 22 * (len(status_lines)-1) + 25
    names, captions = [], []
    for card in cards:
        if not isinstance(card, dict):
            raise ValueError("Each concept must be a JSON object")
        names.append(lines(card.get("name"), "concept name", 474, 22))
        captions.append(lines(card["caption"], "caption", 330, 16)
                        if card.get("caption") is not None else [])
    art_y = 80 + 26 * (max(map(len, names))-1)
    word_y, foot_y = art_y + 410, art_y + 585
    card_height = foot_y + max(110, max(map(len, captions))*20+25)
    stride = card_height + 30
    height = header + rows * stride + 20
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}">',
        f"<title>{escape(title)}</title>",
        f'<rect width="{width}" height="{height}" fill="#F7F6F3"/>',
        '<g font-family="sans-serif" fill="#1D1C1A">',
    ]
    label(parts, title_lines, 50, 70, 32, 38, bold=True)
    label(parts, status_lines, 50, status_y, 17, 22)
    for index, card in enumerate(cards):
        x, y = 50 + index % columns * 560, header + index // columns * stride
        parts.extend([
            f'<rect x="{x}" y="{y}" width="530" height="{card_height}" rx="20" fill="white"/>',
            image(card.get("artwork"), folder, x+28, y+art_y, 474, 390),
        ])
        label(parts, names[index], x+28, y+48, 22, 26)
        wordmark = card.get("wordmark", spec.get("wordmark"))
        if wordmark is not None:
            parts.append(image(wordmark, folder, x+75, y+word_y, 380, 125))
        if card.get("mark") is not None:
            parts.append(image(card["mark"], folder, x+390, y+foot_y, 90, 90))
        label(parts, captions[index], x+28, y+foot_y+18, 16, 20)
    return "".join(parts) + "</g></svg>\n"


def main():
    parser = argparse.ArgumentParser(
        description=__doc__,
        epilog='Spec: {"title":"Brand / studies", "wordmark":"wordmark.svg", '
        '"concepts":[{"name":"Gate", "artwork":"gate.png", '
        '"mark":"gate.svg", "caption":"Open frame"}]}. '
        'Paths are relative to the spec. Each concept may override wordmark. '
        'wordmark, mark and caption are optional. columns defaults to at most four. '
        'status defaults to DRAFT CONCEPTS; set it to match the actual approval state. Labels wrap. '
        'Existing output files are never overwritten. Preview the SVG with an available renderer.',
    )
    parser.add_argument("spec", type=Path, help="JSON board specification")
    parser.add_argument("output", type=Path, help="New self-contained .svg output")
    args = parser.parse_args()
    try:
        if args.output.suffix.lower() != ".svg":
            raise ValueError("Output must end in .svg")
        result = board(json.loads(args.spec.read_text()), args.spec.parent)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with args.output.open("x", encoding="utf-8") as output:
            output.write(result)
    except (OSError, ValueError, ElementTree.ParseError) as error:
        parser.error(str(error))
    print(args.output)


if __name__ == "__main__":
    main()
