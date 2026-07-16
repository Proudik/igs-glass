import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.igs-glass.co.uk';

const content = `# IGS — Innovative Glass Solutions: Full Content

> Bespoke architectural glass specialists. Oversized glass units, rooflights, structural glazing and bespoke IGUs manufactured in London. Supplied across the UK and internationally.

## About IGS

IGS specialises in oversized, high-performance glass units for architects, builders, contractors and complex residential or commercial projects. Manufactured in London and supplied across the UK and internationally, our glazing solutions are produced with close attention to detail, reliable lead times and the technical requirements of each project.

As a family-run business with over 20 years of experience, we believe in responsive service, careful communication and long-term relationships built on trust. We manufacture glazing solutions where scale, clarity, structure and detail matter.

**Contact:**
- Email: info@igs-projects.com
- Telephone: 01895 762795
- Location: London, UK
- Lead times: From 14 working days

## Products

### Double Glazed Units
URL: ${BASE_URL}/products/double-glazed-units

High-performance insulated glass units (IGUs) for residential, commercial and architectural projects. Typical centre-pane U-values from 1.0–1.2 W/m²K depending on specification. Available with a range of glass types including toughened, laminated, Low-E coated and solar control options.

### Triple Glazed Units
URL: ${BASE_URL}/products/triple-glazed-units

Premium triple-glazed insulated units engineered for excellent thermal performance, acoustic comfort and energy efficiency. Typical centre-pane U-values from 0.5–0.7 W/m²K depending on build-up. Suitable for Passivhaus and high-performance building envelopes.

### Oversized Units
URL: ${BASE_URL}/products/oversized-units

Large-format glazing manufactured for ambitious architectural projects where scale, clarity and visual impact matter. Engineered to project-specific dimensions and performance requirements. IGS specialises in non-standard sizes that exceed the limits of standard manufacturing.

### Rooflights
URL: ${BASE_URL}/products/rooflights

Bespoke rooflight glazing systems designed to maximise daylight and thermal performance. IGS can supply both insulated glass units and supporting frames where required. Suitable for flat roof extensions, orangeries and commercial buildings.

### Laminated Glass
URL: ${BASE_URL}/products/laminated-glass

Structural and safety laminated glass units manufactured using PVB or SGP interlayers. Suitable for overhead glazing, walk-on applications, balustrades and any situation where retained glazing under failure is required.

### Walk-On Glass
URL: ${BASE_URL}/products/walk-on-glass

Certified walk-on glazing for floors, staircases, bridges and terraces. Manufactured to meet BS EN 1991-1-1 loading requirements. Anti-slip surface options available.

### Structural Glass
URL: ${BASE_URL}/products/structural-glass

Structural glazing for curtain wall facades, glass fins, frameless systems and point-fixed assemblies. Engineered in collaboration with structural engineers and facade consultants.

### Balustrades
URL: ${BASE_URL}/products/balustrades

Frameless and semi-frameless glass balustrade systems for interior and exterior applications. Toughened and laminated safety glass to BS 6180 and BS EN 1991-1-1.

## Shop — Standard Rooflights (Online Orders)
URL: ${BASE_URL}/shop-rooflights

Standard-size fixed rooflight glass units available to order online with 14-day lead times.

### Fixed Rooflight 1000 x 1500mm
URL: ${BASE_URL}/shop-rooflights/fixed-rooflight-1000x1500
SKU: IGS-FRL-1000-1500
Price: £395.00
Lead time: 14 working days

Specification:
- Outer pane: 6mm heat soak tested toughened glass
- Cavity: 16mm argon filled with warm edge spacer
- Inner pane: 9.5mm Low-E heat soak tested toughened PVB laminated glass
- Suitable for external kerb dimensions of 1000 x 1500mm

### Fixed Rooflight 1500 x 2000mm
URL: ${BASE_URL}/shop-rooflights/fixed-rooflight-1500x2000
SKU: IGS-FRL-1500-2000
Price: £545.00
Lead time: 14 working days

Specification:
- Outer pane: Heat soak tested toughened glass
- Cavity: Argon filled with warm edge spacer
- Inner pane: Low-E laminated safety glass
- Suitable for external kerb dimensions of 1500 x 2000mm

## Services

### Get a Quote
URL: ${BASE_URL}/get-a-quote

Send project details — dimensions, specification requirements, drawings and reference images — for bespoke pricing, technical guidance and specification advice from the IGS team.

### Contact
URL: ${BASE_URL}/contact

Speak directly with the IGS sales and technical team regarding any enquiry.

## Capabilities

- Oversized architectural glass units beyond standard manufacturing dimensions
- Bespoke IGU specification including glass types, coatings, interlayers and cavity fills
- Structural glazing for facades and point-fixed systems
- Rooflight glazing and frame supply
- Technical drawing review and specification advice
- Supply to architects, main contractors, specialist subcontractors and developers
- UK-wide delivery; international supply available

## Key Facts

- 20+ years of experience in the glass industry
- Family-run business based in London
- Supply across the UK and internationally
- Lead times from 14 working days
- 5-year warranty on standard products

## Legal

- [Privacy Policy](${BASE_URL}/privacy-policy)
- [Terms and Conditions](${BASE_URL}/terms-and-conditions)
`;

export function GET() {
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
