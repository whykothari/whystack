---
name: logo
description: Create or refine brand logos, marks, wordmarks and favicons in a soft sculptural matte style. Use for identity exploration and production assets, not general interface design.
---

# Soft sculptural logos

Create an identity for the requested brand. Transfer material and light, not another brand's mascot or lettering.

## Brief

Read local brand files, assets, style guides and user selections before asking questions. Ask only when missing information changes the design. State reversible assumptions.

For existing brands, preserve approved geometry, spacing and colors unless the user requests a redesign. Keep proposed changes as drafts until approved.

## Explore or refine

Show distinct silhouettes and visual ideas when asked for more options. After a user selects a direction, keep new options within that direction. Your recommendation is not a user selection. Keep concept names stable across rounds.

For mark comparisons, keep lettering, material, camera and scale consistent. Show the options visually. Recommend one with a concrete reason.

## Shared style

- Prefer simple rounded forms, restrained asymmetry and a clear silhouette in one color for new marks.
- Use fine matte grain, soft volume, broad highlights, upper-left studio light, warm neutral surroundings and gentle contact shadows.
- Match texture scale and lighting across a set. Use the brand palette or propose colors for approval.
- Avoid coarse foam, fur, wet gloss and excessive detail unless requested. Explicit briefs override these defaults.

For other brands, describe the material or use a faceless material reference. Do not attach a whole mascot as a generic style reference.

## Build the identity

- Mark: derive an original symbol from the brief. Check its flat silhouette and openings. Fix accidental kinks.
- Wordmark: preserve exact spelling and deliberate spacing. Use original vector lettering or a font with suitable usage rights.
- Logo: combine the mark and wordmark with consistent spacing. Keep standalone versions.
- Presentation: use the current vector master, approved or labeled draft. Render textured lettering from its geometry or exact masks. Reject unrequested changes to contours, spacing or openings.
- Board: generate artwork separately. Assemble it with unchanged vector wordmarks, miniatures and native text labels. Use [render_board.py](scripts/render_board.py), or equivalent native layout. Read its `--help` for the input format. Render the resulting SVG with an available tool and show the preview.
- Favicon: inspect real 16 and 32 pixel exports on light and dark backgrounds. Size and alpha checks do not prove recognition. Label simplifications as drafts.
- Transparency: preserve the body. Add any required shadow as a separate translucent layer. Check halos and clipping.

## Deliver and check

Deliver SVG masters and requested PNG exports, including inverse variants where needed. Keep source files separate from presentations.

Compare spelling, geometry, spacing, color and material with the brief and references. Review renders visually. Report actual checks and limitations. Do not promise an editable 3D model from an image.

Get approval before adopting an identity, publishing it or replacing an approved master.
