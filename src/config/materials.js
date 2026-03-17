/*
 * Materials Configuration for 3D Print Everything
 * 
 * FDM = In-house printing, priced by PRINT TIME
 * SLA/SLS/MJF/SLM = Outsourced via WeNext, priced by VOLUME with markup
 * 
 * Pricing structure mirrors WeNext with ~40-60% markup for profit margin
 */

export const TECHNOLOGIES = {
    FDM: {
        id: 'fdm',
        name: 'FDM (Fused Deposition Modeling)',
        shortName: 'FDM',
        description: 'Affordable, strong parts for prototyping and functional use',
        pricingModel: 'time', // Price by print time
        inHouse: true,
        leadTime: '2-5 business days',
        icon: '🔧',
        layerHeights: [0.1, 0.15, 0.2, 0.3],
        defaultLayerHeight: 0.2,
        defaultInfill: 20,
    },
    SLA: {
        id: 'sla',
        name: 'SLA (Stereolithography)',
        shortName: 'SLA',
        description: 'High detail resin printing — smooth surfaces, fine features',
        pricingModel: 'volume', // Price by cm³
        inHouse: false,
        leadTime: '3-5 business days',
        icon: '💎',
    },
    SLS: {
        id: 'sls',
        name: 'SLS (Selective Laser Sintering)',
        shortName: 'SLS',
        description: 'Strong nylon parts — no supports needed, great for functional parts',
        pricingModel: 'volume',
        inHouse: false,
        leadTime: '4-7 business days',
        icon: '⚡',
    },
    MJF: {
        id: 'mjf',
        name: 'MJF (Multi Jet Fusion)',
        shortName: 'MJF',
        description: 'HP technology for strong, detailed nylon parts with fast turnaround',
        pricingModel: 'volume',
        inHouse: false,
        leadTime: '3-5 business days',
        icon: '🚀',
    },
    SLM: {
        id: 'slm',
        name: 'SLM (Metal 3D Printing)',
        shortName: 'Metal',
        description: 'Industrial metal parts — aluminum, stainless steel, titanium',
        pricingModel: 'volume',
        inHouse: false,
        leadTime: '7-12 business days',
        icon: '🏗️',
    },
}

export const MATERIALS = {
    // ═══════════════════════════════════════════════════
    // FDM Materials — Priced by PRINT TIME (in-house)
    // ═══════════════════════════════════════════════════
    'fdm-pla': {
        id: 'fdm-pla',
        tech: 'FDM',
        name: 'PLA',
        fullName: 'PLA (Polylactic Acid)',
        description: 'Most popular — easy to print, eco-friendly, great for prototypes',
        color: '#4CAF50',
        // FDM pricing: $/hour of print time + material weight cost
        pricePerHour: 8.00,        // Labor + machine time per hour
        pricePerGram: 0.05,        // Material cost per gram
        density: 1.24,              // g/cm³
        setupFee: 5.00,
        minPrice: 15.00,
    },
    'fdm-abs': {
        id: 'fdm-abs',
        tech: 'FDM',
        name: 'ABS',
        fullName: 'ABS (Acrylonitrile Butadiene Styrene)',
        description: 'Tough and heat resistant — great for functional parts',
        color: '#FF9800',
        pricePerHour: 9.00,
        pricePerGram: 0.06,
        density: 1.04,
        setupFee: 5.00,
        minPrice: 18.00,
    },
    'fdm-petg': {
        id: 'fdm-petg',
        tech: 'FDM',
        name: 'PETG',
        fullName: 'PETG (Polyethylene Terephthalate Glycol)',
        description: 'Strong, flexible, and chemical resistant — food safe options',
        color: '#2196F3',
        pricePerHour: 9.00,
        pricePerGram: 0.06,
        density: 1.27,
        setupFee: 5.00,
        minPrice: 18.00,
    },
    'fdm-tpu': {
        id: 'fdm-tpu',
        tech: 'FDM',
        name: 'TPU',
        fullName: 'TPU (Thermoplastic Polyurethane)',
        description: 'Flexible and rubber-like — ideal for gaskets, grips, and cases',
        color: '#9C27B0',
        pricePerHour: 12.00,
        pricePerGram: 0.10,
        density: 1.21,
        setupFee: 8.00,
        minPrice: 25.00,
    },
    'fdm-nylon': {
        id: 'fdm-nylon',
        tech: 'FDM',
        name: 'Nylon',
        fullName: 'Nylon (PA6/PA12)',
        description: 'Extremely durable and wear-resistant — gears, hinges, clips',
        color: '#607D8B',
        pricePerHour: 14.00,
        pricePerGram: 0.12,
        density: 1.14,
        setupFee: 8.00,
        minPrice: 30.00,
    },
    'fdm-cf': {
        id: 'fdm-cf',
        tech: 'FDM',
        name: 'Carbon Fiber',
        fullName: 'Carbon Fiber Reinforced Nylon',
        description: 'Lightweight and extremely strong — aerospace-grade performance',
        color: '#212121',
        pricePerHour: 18.00,
        pricePerGram: 0.25,
        density: 1.15,
        setupFee: 12.00,
        minPrice: 45.00,
    },

    // ═══════════════════════════════════════════════════
    // SLA Materials — Priced by VOLUME (outsourced)
    // WeNext base rates + 45% markup
    // ═══════════════════════════════════════════════════
    'sla-standard': {
        id: 'sla-standard',
        tech: 'SLA',
        name: 'Standard Resin',
        fullName: 'Standard Resin (Somos® GP Plus)',
        description: 'Smooth surface, high detail — great for visual prototypes',
        color: '#E0E0E0',
        pricePerCm3: 0.35,         // Outsourced rate with markup
        setupFee: 12.00,
        minPrice: 25.00,
        density: 1.12,
    },
    'sla-tough': {
        id: 'sla-tough',
        tech: 'SLA',
        name: 'Tough Resin',
        fullName: 'Tough Resin (ABS-Like)',
        description: 'High impact resistance — functional prototypes and snap fits',
        color: '#78909C',
        pricePerCm3: 0.45,
        setupFee: 12.00,
        minPrice: 30.00,
        density: 1.18,
    },
    'sla-clear': {
        id: 'sla-clear',
        tech: 'SLA',
        name: 'Clear Resin',
        fullName: 'Clear Resin (WaterShed XC)',
        description: 'Optically clear — lenses, light guides, transparent enclosures',
        color: '#B3E5FC',
        pricePerCm3: 0.55,
        setupFee: 15.00,
        minPrice: 35.00,
        density: 1.12,
    },
    'sla-dental': {
        id: 'sla-dental',
        tech: 'SLA',
        name: 'Dental Resin',
        fullName: 'Dental/Castable Resin',
        description: 'Biocompatible and castable — dental models, jewelry casting',
        color: '#FFF9C4',
        pricePerCm3: 0.75,
        setupFee: 18.00,
        minPrice: 40.00,
        density: 1.10,
    },

    // ═══════════════════════════════════════════════════
    // SLS Materials — Priced by VOLUME (outsourced)
    // ═══════════════════════════════════════════════════
    'sls-pa12': {
        id: 'sls-pa12',
        tech: 'SLS',
        name: 'Nylon PA12',
        fullName: 'Nylon PA12 (White)',
        description: 'Strong, versatile nylon — functional parts, no support marks',
        color: '#FAFAFA',
        pricePerCm3: 0.40,
        setupFee: 15.00,
        minPrice: 30.00,
        density: 1.01,
    },
    'sls-pa12-gf': {
        id: 'sls-pa12-gf',
        tech: 'SLS',
        name: 'Glass-Filled Nylon',
        fullName: 'PA12 Glass Filled',
        description: 'Enhanced stiffness and heat resistance — structural components',
        color: '#B0BEC5',
        pricePerCm3: 0.55,
        setupFee: 18.00,
        minPrice: 40.00,
        density: 1.22,
    },

    // ═══════════════════════════════════════════════════
    // MJF Materials — Priced by VOLUME (outsourced)
    // ═══════════════════════════════════════════════════
    'mjf-pa12': {
        id: 'mjf-pa12',
        tech: 'MJF',
        name: 'HP PA12',
        fullName: 'HP PA12 (Black)',
        description: 'HP Multi Jet Fusion nylon — strong, detailed, fast production',
        color: '#37474F',
        pricePerCm3: 0.38,
        setupFee: 12.00,
        minPrice: 25.00,
        density: 1.01,
    },
    'mjf-pa12-gb': {
        id: 'mjf-pa12-gb',
        tech: 'MJF',
        name: 'HP PA12 Glass Beads',
        fullName: 'HP PA12 Glass Beads',
        description: 'Glass bead reinforced — higher stiffness and dimensional stability',
        color: '#546E7A',
        pricePerCm3: 0.50,
        setupFee: 15.00,
        minPrice: 30.00,
        density: 1.36,
    },

    // ═══════════════════════════════════════════════════
    // SLM (Metal) Materials — Priced by VOLUME (outsourced)
    // ═══════════════════════════════════════════════════
    'slm-aluminum': {
        id: 'slm-aluminum',
        tech: 'SLM',
        name: 'Aluminum',
        fullName: 'Aluminum (AlSi10Mg)',
        description: 'Lightweight metal — aerospace, automotive, heat exchangers',
        color: '#CFD8DC',
        pricePerCm3: 2.80,
        setupFee: 45.00,
        minPrice: 95.00,
        density: 2.68,
    },
    'slm-ss316l': {
        id: 'slm-ss316l',
        tech: 'SLM',
        name: 'Stainless Steel 316L',
        fullName: 'Stainless Steel 316L',
        description: 'Corrosion resistant metal — medical, marine, industrial',
        color: '#90A4AE',
        pricePerCm3: 3.50,
        setupFee: 55.00,
        minPrice: 120.00,
        density: 7.99,
    },
    'slm-ms1': {
        id: 'slm-ms1',
        tech: 'SLM',
        name: 'Mold Steel MS1',
        fullName: 'Maraging Steel MS1 (18Ni300)',
        description: 'Ultra-hard tool steel — molds, dies, tooling inserts',
        color: '#78909C',
        pricePerCm3: 4.00,
        setupFee: 65.00,
        minPrice: 150.00,
        density: 8.05,
    },
}

// Get all materials for a given technology
export function getMaterialsByTech(techId) {
    return Object.values(MATERIALS).filter(m => m.tech === techId)
}

// Quantity discount tiers
export const QUANTITY_DISCOUNTS = [
    { min: 1, max: 4, discount: 0, label: '1-4 units' },
    { min: 5, max: 9, discount: 0.05, label: '5-9 units (5% off)' },
    { min: 10, max: 24, discount: 0.10, label: '10-24 units (10% off)' },
    { min: 25, max: 49, discount: 0.15, label: '25-49 units (15% off)' },
    { min: 50, max: 99, discount: 0.20, label: '50-99 units (20% off)' },
    { min: 100, max: Infinity, discount: 0.25, label: '100+ units (25% off)' },
]

// Rush order multiplier
export const RUSH_MULTIPLIER = 1.5

// Shipping estimate (flat rate based on WeNext typical + handling)
export const SHIPPING_RATES = {
    standard: { price: 15.00, label: 'Standard Shipping (7-10 days)', days: '7-10' },
    express: { price: 35.00, label: 'Express Shipping (3-5 days)', days: '3-5' },
    priority: { price: 65.00, label: 'Priority Shipping (1-2 days)', days: '1-2' },
}
