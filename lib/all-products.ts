export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  titleLines: string[];
  copy: string;
  specs: { label: string; value: string }[];
  image: string;
  category?: string;
}

export const ALL_PRODUCTS: ProductDetail[] = [
  {
    id: 'double-glazed-units',
    slug: 'double-glazed-units',
    name: 'Double Glazed Units',
    titleLines: ['DOUBLE', 'GLAZED', 'UNITS'],
    copy: 'High-performance insulated glass units manufactured for residential, commercial and architectural applications. Designed to provide excellent thermal efficiency, clarity and long-term durability. Available in a wide range of glass specifications including solar control, laminated and acoustic options. Typical centre-pane U-values from 1.0–1.2 W/m²K, depending on glass specification.',
    specs: [
      { label: 'Applications', value: 'Residential glazing, commercial projects, façades, windows, doors and specialist architectural applications.' },
      { label: 'Performance', value: 'Thermal, acoustic, solar control and safety options available depending on the required specification.' },
    ],
    image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Insulated Glass Units',
  },
  {
    id: 'triple-glazed-units',
    slug: 'triple-glazed-units',
    name: 'Triple Glazed Units',
    titleLines: ['TRIPLE', 'GLAZED', 'UNITS'],
    copy: 'Premium insulated glazing engineered to achieve exceptional thermal performance and energy efficiency. Ideal for projects where comfort, sustainability and specification requirements are paramount. Available with a range of coatings, spacer bars and performance glass combinations. Typical centre-pane U-values from 0.5–0.7 W/m²K, depending on glass build-up and coatings.',
    specs: [
      { label: 'Applications', value: 'Low-energy homes, premium residential projects, commercial buildings and specifications requiring enhanced thermal performance.' },
      { label: 'Performance', value: 'Can be tailored with Low-E coatings, argon or krypton cavities, acoustic glass and laminated safety glass.' },
    ],
    image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Insulated Glass Units',
  },
  {
    id: 'oversized-units',
    slug: 'oversized-units',
    name: 'Oversized Units',
    titleLines: ['OVERSIZED', 'UNITS'],
    copy: 'Large-format glazing manufactured for ambitious architectural projects where scale and uninterrupted views are essential. Designed to maximise natural light while maintaining structural integrity and thermal performance. Suitable for luxury residential, commercial and façade applications.',
    specs: [
      { label: 'Applications', value: 'Oversized windows, sliding systems, façades, entrance glazing, premium homes and architectural statement features.' },
      { label: 'Performance', value: 'Manufactured to suit project-specific sizes, coatings, interlayers, spacer bars and performance requirements.' },
    ],
    image: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Architectural Glass',
  },
  {
    id: 'solar-control-glass',
    slug: 'solar-control-glass',
    name: 'Solar Control Glass',
    titleLines: ['SOLAR', 'CONTROL', 'GLASS'],
    copy: 'Advanced coated glass engineered to control solar gain while maintaining excellent daylight transmission. Helps improve occupant comfort, reduce cooling requirements and minimise overheating in highly glazed buildings. Available in a range of performance levels and visual appearances, and can be combined with Low-E coatings to achieve enhanced thermal performance and improved U-values.',
    specs: [
      { label: 'Applications', value: 'Large elevations, south-facing glazing, commercial buildings, roof glazing, residential extensions and high-performance façades.' },
      { label: 'Performance', value: 'Solar control performance varies by coating, light transmission, g-value and overall insulated glass unit specification.' },
    ],
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Performance Glass',
  },
  {
    id: 'laminated-glass-units',
    slug: 'laminated-glass-units',
    name: 'Laminated Glass Units',
    titleLines: ['LAMINATED', 'GLASS', 'UNITS'],
    copy: 'Safety and security glazing combining multiple layers of glass with specialist interlayers. Provides enhanced impact resistance, acoustic performance and UV protection. Suitable for overhead glazing, balustrades, façades and high-specification architectural projects.',
    specs: [
      { label: 'Applications', value: 'Rooflights, balustrades, overhead glazing, walk-on glass, façades, security glazing and acoustic applications.' },
      { label: 'Performance', value: 'Available with PVB, acoustic, structural and specialist interlayers depending on project requirements.' },
    ],
    image: 'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Safety Glass',
  },
  {
    id: 'walk-on-glass-floors',
    slug: 'walk-on-glass-floors',
    name: 'Walk-On Glass Floors',
    titleLines: ['WALK-ON', 'GLASS', 'FLOORS'],
    copy: 'Structural glazed floor panels engineered for strength, transparency and architectural impact. Designed to bring natural light into lower levels while creating striking design features. Manufactured to meet project-specific loading requirements and intended use.',
    specs: [
      { label: 'Applications', value: 'Luxury interiors, roof terraces, light wells, stair landings, basement glazing and architectural floor features.' },
      { label: 'Performance', value: 'Glass thickness, interlayer and support requirements must be assessed according to loading and project conditions.' },
    ],
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Structural Glass',
  },
  {
    id: 'rooflights',
    slug: 'rooflights',
    name: 'Rooflights',
    titleLines: ['ROOF', 'LIGHTS'],
    copy: 'Bespoke rooflight glazing systems designed to maximise daylight and create bright, open interior spaces. Available in fixed, walk-on and oversized configurations. IGS can supply both the insulated glass unit and supporting frame where required, providing a complete rooflight solution tailored to your project.',
    specs: [
      { label: 'Applications', value: 'Flat roofs, extensions, premium residential projects, commercial roof glazing and daylight-led architecture.' },
      { label: 'Performance', value: 'High-performance glazing specifications can be tailored for thermal performance, solar control, safety and acoustic requirements.' },
    ],
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Rooflights',
  },
  {
    id: 'painted-glass',
    slug: 'painted-glass',
    name: 'Painted Glass',
    titleLines: ['PAINTED', 'GLASS'],
    copy: 'Back-painted glass panels manufactured to provide a sleek and durable decorative finish. Suitable for feature walls, splashbacks, reception areas and bespoke interior applications. Available in a wide range of colours and finishes.',
    specs: [
      { label: 'Applications', value: 'Feature walls, splashbacks, reception desks, decorative panels, commercial interiors and bespoke design details.' },
      { label: 'Performance', value: 'Painted glass can be combined with toughened or laminated safety glass depending on application.' },
    ],
    image: 'https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Decorative Glass',
  },
  {
    id: 'balustrades',
    slug: 'balustrades',
    name: 'Balustrades',
    titleLines: ['BALUS', 'TRADES'],
    copy: 'Frameless and structural glass balustrade systems for contemporary residential and commercial environments. Designed to provide safety without compromising views or architectural intent. Suitable for staircases, balconies, terraces and internal features.',
    specs: [
      { label: 'Applications', value: 'Staircases, terraces, balconies, landings, galleries and contemporary interior features.' },
      { label: 'Performance', value: 'Glass specification depends on loading, fixing method, height, location and relevant safety requirements.' },
    ],
    image: 'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Structural Glass',
  },
  {
    id: 'structural-bonding',
    slug: 'structural-bonding',
    name: 'Structural Bonding',
    titleLines: ['STRUCTURAL', 'BONDING'],
    copy: 'Specialist structural glazing solutions creating clean, seamless glass installations with minimal visible fixings. Allows architects to achieve elegant, contemporary designs without compromising performance. Suitable for façades, canopies and bespoke glazing applications.',
    specs: [
      { label: 'Applications', value: 'Structural glazing, façades, bonded panels, canopies, glass features and architectural installations.' },
      { label: 'Performance', value: 'Bonding method and sealant specification must be selected according to project design and environmental exposure.' },
    ],
    image: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Specialist Glass',
  },
  {
    id: 'uv-bonding',
    slug: 'uv-bonding',
    name: 'UV Bonding',
    titleLines: ['UV', 'BONDING'],
    copy: 'Precision UV bonding technology used to create strong and visually seamless glass-to-glass connections. Ideal for architectural features, display systems and specialist interior applications. Produces exceptionally clean joints with outstanding clarity.',
    specs: [
      { label: 'Applications', value: 'Display cases, glass furniture, interior features, decorative glass assemblies and specialist installations.' },
      { label: 'Performance', value: 'Best suited for controlled interior applications where clarity and clean detailing are important.' },
    ],
    image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Specialist Glass',
  },
  {
    id: 'curved-glass',
    slug: 'curved-glass',
    name: 'Curved Glass',
    titleLines: ['CURVED', 'GLASS'],
    copy: 'Custom curved glazing manufactured for distinctive architectural forms and specialist design requirements. Available in a range of radii, thicknesses and performance specifications. Creates visually striking features while maintaining high performance standards.',
    specs: [
      { label: 'Applications', value: 'Curved façades, feature windows, staircases, balustrades, interiors and bespoke architectural forms.' },
      { label: 'Performance', value: 'Specification depends on radius, size, thickness, heat treatment and intended application.' },
    ],
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Specialist Glass',
  },
  {
    id: 'fire-rated-glass',
    slug: 'fire-rated-glass',
    name: 'Fire Rated Glass',
    titleLines: ['FIRE', 'RATED', 'GLASS'],
    copy: 'Specialist fire-resistant glazing designed to provide integrity and insulation during fire events. Available in a range of certified fire ratings and glass constructions to suit project requirements. Suitable for doors, screens, partitions and high-specification commercial buildings.',
    specs: [
      { label: 'Applications', value: 'Fire-rated doors, screens, partitions, escape routes, commercial buildings and protected internal spaces.' },
      { label: 'Performance', value: 'Thermal and fire performance vary depending on the certified fire-rated system specified.' },
    ],
    image: 'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Safety Glass',
  },
  {
    id: 'switchable-glass',
    slug: 'switchable-glass',
    name: 'Switchable Glass',
    titleLines: ['SWITCH', 'ABLE', 'GLASS'],
    copy: 'Innovative privacy glass that changes from transparent to opaque at the touch of a button. Ideal for meeting rooms, residential interiors and premium architectural spaces. Combines modern aesthetics with practical privacy control.',
    specs: [
      { label: 'Applications', value: 'Meeting rooms, bathrooms, partitions, offices, luxury homes, healthcare spaces and contemporary interiors.' },
      { label: 'Performance', value: 'Available in double and triple glazed configurations with thermal performance tailored to project requirements.' },
    ],
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Smart Glass',
  },
  {
    id: 'heated-glass',
    slug: 'heated-glass',
    name: 'Heated Glass',
    titleLines: ['HEATED', 'GLASS'],
    copy: 'Advanced electrically heated glazing that provides radiant warmth while maintaining clear views. Helps eliminate condensation and can contribute to a building\'s heating strategy. Ideal for luxury residential projects, rooflights and large glazed elevations.',
    specs: [
      { label: 'Applications', value: 'Luxury homes, rooflights, swimming pool areas, large elevations, condensation-prone spaces and specialist projects.' },
      { label: 'Performance', value: 'Available with a range of performance specifications; U-values vary depending on overall glass configuration.' },
    ],
    image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Smart Glass',
  },
  {
    id: 'glass-spacer-bar-units',
    slug: 'glass-spacer-bar-units',
    name: 'Units With Glass Spacer Bars',
    titleLines: ['UNITS WITH', 'GLASS', 'SPACER BARS'],
    copy: 'Premium insulated glass units using glass spacer details for a cleaner, more refined edge appearance. Designed for projects where visual quality, transparency and architectural detailing are especially important. Suitable for high-end residential and specialist glazing applications.',
    specs: [
      { label: 'Applications', value: 'Architectural glazing, premium residential projects, display-led glazing and areas where the edge detail is visible.' },
      { label: 'Performance', value: 'Final performance depends on the unit build-up, spacer design, coatings and cavity configuration.' },
    ],
    image: 'https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Insulated Glass Units',
  },
  {
    id: 'georgian-bar-insulated-units',
    slug: 'georgian-bar-insulated-units',
    name: 'Georgian Bar Insulated Units',
    titleLines: ['GEORGIAN', 'BAR', 'UNITS'],
    copy: 'Create the appearance of traditional divided glazing while benefiting from modern thermal performance. Georgian Bar insulated glass units incorporate precision-manufactured spacer bars within the cavity, producing the classic multi-pane aesthetic without compromising energy efficiency. Available in a range of bar widths, colours and layouts to complement heritage renovations and contemporary developments.',
    specs: [
      { label: 'Applications', value: 'Heritage-style windows, residential projects, conservation-inspired design and modern developments requiring traditional detailing.' },
      { label: 'Performance', value: 'Can be supplied with Low-E, laminated, acoustic and solar control glass depending on project requirements.' },
    ],
    image: 'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Insulated Glass Units',
  },
];

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}
