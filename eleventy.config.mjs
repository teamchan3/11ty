import beautify from "js-beautify";
import * as esbuild from "esbuild";
import path from "path";
import postcss from "postcss";
import { promises as fs } from "fs";
import { rimraf } from "rimraf";
import { glob } from "glob";
import "tsx/esm";
import { renderToStaticMarkup } from "react-dom/server";

export default function (eleventyConfig) {
  console.log("Eleventy config is running");
  console.log("Current working directory:", process.cwd());
  console.log("_includes directory:", path.resolve("src/_includes"));

  const isProd = process.env.ELEVENTY_ENV === "production";
  const outputDir = isProd ? "build" : "dist";

  console.log(`Building for ${isProd ? "production" : "development"}`);
  console.log(`Output directory: ${outputDir}`);

  // HTML Beautifier設定
  eleventyConfig.addTransform("beautify", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      let beautified = beautify.html(content, {
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

  eleventyConfig.on("eleventy.before", async () => {
    console.log(`Cleaning ${outputDir} directory...`);
    await rimraf(outputDir);
    console.log(`${outputDir} directory cleaned.`);

    await fs.mkdir(`${outputDir}/css`, { recursive: true });
    await fs.mkdir(`${outputDir}/js`, { recursive: true });
    await fs.mkdir(`${outputDir}/images`, { recursive: true });

    await esbuild.build({
      entryPoints: ["src/js/script.js"],
      bundle: true,
      minify: isProd,
      sourcemap: !isProd,
      target: isProd ? ["es2015"] : ["esnext"],
      outfile: `${outputDir}/js/bundle.js`,
      logLevel: "info",
    });

    const postcssConfig = (await import("./postcss.config.js")).default({
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

    if (isProd) {
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
      const imageFiles = await glob("src/images/**/*.{jpg,png,svg}");
      for (const file of imageFiles) {
        const destPath = file.replace("src/", `${outputDir}/`);
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(file, destPath);
      }
      console.log("画像のコピーが完了しました:", imageFiles.length);
    }
  });

  eleventyConfig.addExtension(["11ty.jsx", "11ty.ts", "11ty.tsx"], {
    key: "11ty.js",
    compile: function () {
      return async function (data) {
        let content = await this.defaultRenderer(data);
        return renderToStaticMarkup(content);
      };
    },
  });
  eleventyConfig.addTemplateFormats("11ty.jsx,11ty.tsx");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: outputDir,
    },
  };
}
