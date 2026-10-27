// Lab concept: NativeWind tokens — Tailwind theme built from src/theme/tokens.ts.
const { colors, spacing, radius } = require('./src/theme/tokens');

const px = (scale) =>
  Object.fromEntries(Object.entries(scale).map(([key, value]) => [key, `${value}px`]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      spacing: px(spacing),
      borderRadius: px(radius),
    },
  },
  plugins: [],
};
