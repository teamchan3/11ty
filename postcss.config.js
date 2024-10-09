module.exports = (ctx) => ({
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    ctx.env === "production"
      ? require("cssnano")({
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        })
      : false,
  ].filter(Boolean),
});
