/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            code: {
              backgroundColor: theme("colors.gray.100"),
              color: theme("colors.gray.800"),
              fontFamily: theme("fontFamily.mono").join(", "),
              borderRadius: theme("borderRadius.md"),
              paddingTop: "0.15rem",
              paddingBottom: "0.15rem",
              paddingLeft: "0.35rem",
              paddingRight: "0.35rem",
            },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            pre: {
              backgroundColor: theme("colors.gray.900"),
              color: theme("colors.gray.100"),
              borderRadius: theme("borderRadius.md"),
              padding: theme("spacing.4"),
              overflowX: "auto",
            },
            "pre code": {
              backgroundColor: "transparent",
              color: "inherit",
              padding: "0",
              fontSize: "0.875em",
            },
          },
        },
        invert: {
          css: {
            code: {
              backgroundColor: theme("colors.gray.800"),
              color: theme("colors.gray.100"),
            },
            pre: {
              backgroundColor: theme("colors.gray.800"),
              color: theme("colors.gray.100"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
