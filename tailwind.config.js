module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        
        navy: "var(--navy)",
        "navy-light": "var(--navy-light)",
        "chart-grid": "var(--chart-grid)",
        "candle-up": "var(--candle-up)",
        "candle-down": "var(--candle-down)",

        app: "var(--bg-app)",
        card: "var(--bg-card)",
        muted: "var(--bg-muted)",

        primary: "var(--primary)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",

        buy: "var(--buy)",
        sell: "var(--sell)",

        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },

        border: {
          DEFAULT: "var(--border-default)",
        },
      },
    },
  },
  plugins: [],
};
