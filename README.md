# Arbafix - Video Game Console Repair

Professional video game console repair service website built with Next.js 14.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aha124/Arbafix-Website.git
cd Arbafix-Website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Landing page
└── components/
    ├── Header.tsx       # Sticky navigation header
    ├── Hero.tsx         # Hero section with CTA
    ├── TrustBar.tsx     # Trust indicators section
    ├── Services.tsx     # Services cards section
    ├── HowItWorks.tsx   # Process steps section
    ├── WhyChooseUs.tsx  # Features grid section
    ├── CTASection.tsx   # Call-to-action section
    └── Footer.tsx       # Site footer
```

## Features

- Fully responsive design
- Smooth scroll navigation
- Mobile-friendly hamburger menu
- Hover animations on interactive elements
- SEO optimized with metadata
- Accessible semantic HTML

## Deployment

This project is configured for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Deploy

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Color Scheme

- **Background**: White (#ffffff) and Light Gray (#f8fafc)
- **Text Dark**: #1e293b
- **Text Body**: #64748b
- **Primary (Blue)**: #2563eb
- **Success (Green)**: #16a34a

## License

All rights reserved.
