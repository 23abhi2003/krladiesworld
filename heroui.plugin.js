const { heroui } = require("@heroui/theme");

module.exports = heroui({
  themes: {
    light: {
      colors: {
        primary: {
          50: "#fdf2f4",
          100: "#fce7ea",
          200: "#f8cfd7",
          300: "#f2a7b6",
          400: "#e8738e",
          500: "#6B0021",
          600: "#5d001d",
          700: "#4e0018",
          800: "#400014",
          900: "#320010",
          DEFAULT: "#6B0021",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#faf6ea",
          100: "#f5edd5",
          200: "#ebdbab",
          300: "#dfc47b",
          400: "#d3aa4f",
          500: "#C99726",
          600: "#b5821f",
          700: "#93661b",
          800: "#77511c",
          900: "#63431b",
          DEFAULT: "#C99726",
          foreground: "#ffffff",
        },
        background: "#FFF5F7",
      }
    }
  }
});
