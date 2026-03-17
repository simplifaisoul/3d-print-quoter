# 3D Print Everything — Auto-Quoter

Instant 3D printing quote tool for [3D Print Everything](https://www.3dprinteverything.net/) (Frisco, TX).

Upload a 3D model (STL/OBJ/3MF) → See it in an interactive 3D viewer → Get an instant price → Pay via Stripe.

## Features

- **Drag & Drop Upload** — STL, OBJ, 3MF file support
- **Interactive 3D Viewer** — Three.js-powered preview with orbit controls
- **Instant Auto-Quoting** — Client-side volume/time analysis, real-time pricing
- **5 Printing Technologies** — FDM, SLA, SLS, MJF, and Metal (SLM)
- **20+ Materials** — PLA, ABS, PETG, TPU, Nylon, Carbon Fiber, Resins, Metals
- **Smart Pricing** — FDM by print time (in-house), all others by volume (outsourced)
- **Quantity Discounts** — 5-25% off for bulk orders
- **Rush Orders** — Priority production at 50% surcharge
- **Manual Review** — "Escape hatch" form for complex projects
- **Stripe Checkout** — Ready for payment integration
- **Embeddable** — Drop into any website via iFrame

## Tech Stack

- **Vite + React** — Fast, modern frontend
- **Three.js** — 3D model rendering
- **Vanilla CSS** — Custom dark theme
- **Stripe** — Payment processing (config-ready)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5174

## Embed in Your Website

```html
<iframe 
  src="https://your-quoter-domain.com/?embed=true" 
  width="100%" 
  height="800" 
  frameborder="0"
></iframe>
```

## Pricing Configuration

Edit `src/config/materials.js` to adjust:
- Material rates ($/hr for FDM, $/cm³ for others)
- Setup fees
- Minimum prices
- Quantity discount tiers
- Shipping rates

## License

Private — Built for 3D Print Everything by SimplifAI.
