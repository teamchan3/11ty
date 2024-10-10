import plugin from "tailwindcss/plugin";
import postcss from "postcss";
import themeExtensions from "./tailwindcss/config";
import customVariants from "./tailwindcss/plugins";

export default {
  content: [
    "./src/**/*.{html,js,njk,md,jsx,tsx}",
    "./src/components/**/*.{html,js,njk,md,jsx,tsx}",
  ],
  theme: {
    extend: {
      ...themeExtensions,
    },
  },
  plugins: [
    plugin(({ addVariant, addUtilities, e }) => {
      customVariants.forEach((variant) => {
        variant({ addVariant, e });
      });
    }),
  ],
};
