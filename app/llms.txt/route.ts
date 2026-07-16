import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.igs-glass.co.uk';

const content = `# IGS — Innovative Glass Solutions

> Bespoke architectural glass specialists. Oversized glass units, rooflights, structural glazing and bespoke IGUs manufactured in London. Supplied across the UK and internationally.

IGS is a family-run business with over 20 years of experience manufacturing high-performance glass units for architects, builders, contractors and complex residential or commercial projects.

## Products

- [Double Glazed Units](${BASE_URL}/products/double-glazed-units): High-performance insulated glass units. Typical centre-pane U-values from 1.0–1.2 W/m²K.
- [Triple Glazed Units](${BASE_URL}/products/triple-glazed-units): Premium insulated glazing for excellent thermal performance. Typical centre-pane U-values from 0.5–0.7 W/m²K.
- [Oversized Units](${BASE_URL}/products/oversized-units): Large-format glazing manufactured to project-specific dimensions and performance requirements.
- [Rooflights](${BASE_URL}/products/rooflights): Bespoke rooflight glazing systems designed to maximise daylight and thermal performance.
- [Laminated Glass](${BASE_URL}/products/laminated-glass): Structural and safety laminated glass units.
- [Walk-On Glass](${BASE_URL}/products/walk-on-glass): Certified walk-on glazing for floors, bridges and terraces.
- [Structural Glass](${BASE_URL}/products/structural-glass): Structural glazing for facades, fins and frameless systems.
- [Balustrades](${BASE_URL}/products/balustrades): Frameless and semi-frameless glass balustrade systems.

## Shop

- [Shop Rooflights](${BASE_URL}/shop-rooflights): Order standard-size fixed rooflight glass units online with 14-day lead times.
- [Marketplace](${BASE_URL}/marketplace): Browse all available glazing products.

## Services

- [Get a Quote](${BASE_URL}/get-a-quote): Submit project details for bespoke specification, pricing and technical guidance.
- [Contact](${BASE_URL}/contact): Speak with the team directly.

## Optional

- [Privacy Policy](${BASE_URL}/privacy-policy)
- [Terms and Conditions](${BASE_URL}/terms-and-conditions)
- [Full content (llms-full.txt)](${BASE_URL}/llms-full.txt)

## About

This website is powered by [Managewise](https://managewise.app) — a modern business management platform for the construction and glazing industry.
`;

export function GET() {
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
