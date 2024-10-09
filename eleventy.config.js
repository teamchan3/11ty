const beautify = require("js-beautify").html;
const esbuild = require("esbuild");
const path = require("path");
const postcss = require("postcss");
const fs = require("fs").promises;
const { rimraf } = require("rimraf");
const { glob } = require("glob");

module.exports = function (eleventyConfig) {
  console.log("Eleventy config is running");
  console.log("Current working directory:", process.cwd());
  console.log("_includes directory:", path.resolve("src/_includes"));

  // 環境変数を取得（デフォルトは開発環境）
  const isProd = process.env.ELEVENTY_ENV === "production";
  const outputDir = isProd ? "build" : "dist";

  console.log(`Building for ${isProd ? "production" : "development"}`);
  console.log(`Output directory: ${outputDir}`);

  // HTML Beautifier設定
  eleventyConfig.addTransform("beautify", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      let beautified = beautify(content, {
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 1,
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: "keep",
        brace_style: "collapse,preserve-inline",
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: true,
        wrap_line_length: 0,
        indent_inner_html: false,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false,
      });
      return beautified;
    }
    return content;
  });

  // ビルド前のクリーンアップとアセット処理
  eleventyConfig.on("eleventy.before", async () => {
    // 出力ディレクトリのクリーンアップ
    console.log(`Cleaning ${outputDir} directory...`);
    await rimraf(outputDir);
    console.log(`${outputDir} directory cleaned.`);

    // 必要なディレクトリを作成
    await fs.mkdir(`${outputDir}/css`, { recursive: true });
    await fs.mkdir(`${outputDir}/js`, { recursive: true });
    await fs.mkdir(`${outputDir}/images`, { recursive: true });

    // JavaScript処理
    await esbuild.build({
      entryPoints: ["src/js/script.js"],
      bundle: true,
      minify: isProd,
      sourcemap: !isProd,
      target: isProd ? ["es2015"] : ["esnext"],
      outfile: `${outputDir}/js/bundle.js`,
      logLevel: "info",
    });

    // CSS処理
    const postcssConfig = require("./postcss.config.js")({
      env: isProd ? "production" : "development",
    });
    const css = await fs.readFile("src/css/tailwind.css", "utf8");
    const result = await postcss(postcssConfig.plugins).process(css, {
      from: "src/css/tailwind.css",
      to: `${outputDir}/css/style.css`,
    });
    await fs.writeFile(`${outputDir}/css/style.css`, result.css);
    if (result.map) {
      await fs.writeFile(
        `${outputDir}/css/style.css.map`,
        result.map.toString()
      );
    }

    // 画像の処理
    if (isProd) {
      // 本番環境: 画像の最適化
      const imagemin = (await import("imagemin")).default;
      const imageminMozjpeg = (await import("imagemin-mozjpeg")).default;
      const imageminPngquant = (await import("imagemin-pngquant")).default;
      const imageminSvgo = (await import("imagemin-svgo")).default;

      const files = await imagemin(["src/images/**/*.{jpg,png,svg}"], {
        destination: `${outputDir}/images`,
        plugins: [
          imageminMozjpeg({ quality: 80 }),
          imageminPngquant({ quality: [0.6, 0.8] }),
          imageminSvgo({
            plugins: [{ removeViewBox: false }],
          }),
        ],
      });
      console.log("画像の最適化が完了しました:", files.length);
    } else {
      // 開発環境: 画像を単純にコピー
      const imageFiles = await glob("src/images/**/*.{jpg,png,svg}");
      for (const file of imageFiles) {
        const destPath = file.replace("src/", `${outputDir}/`);
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(file, destPath);
      }
      console.log("画像のコピーが完了しました:", imageFiles.length);
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: outputDir,
    },
  };
};
