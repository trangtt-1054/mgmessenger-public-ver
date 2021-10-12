module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          light: "#2ffadb",
          DEFAULT: "#013e6a",
          dark: "#001e2f",
        },
        pink: {
          light: "",
          DEFAULT: "#ff6189",
          dark: "",
        },
      },
      maxWidth: {
        "4/5": "80%",
        sidebar: "240px",
        sidebarMd: "200px",
      },
      minWidth: {
        sidebar: "240px",
        sidebarMd: "200px",
        icon: "20px",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
