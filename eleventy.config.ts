import { renderToString } from "jsx-async-runtime";
import * as esbuild from "esbuild";
import { promises as fs } from "fs";
import { rimraf } from "rimraf";
import { glob } from "glob";
import postcss from 'postcss';
import postcssImport from "postcss-import";
import postcssNesting from "postcss-nesting";
import tailwindcss from "tailwindcss";
import postcssPresetEnv from "postcss-preset-env";

function convertJsxAttributes(html: string): string {
  return html.replace(/className=/g, 'class=');
}

export default function (eleventyConfig: any) {
  const ASSETS_DIR = "assets";
  const CSS_DIR = `${ASSETS_DIR}/css`;
  const JS_DIR = `${ASSETS_DIR}/js`;
  const IMAGES_DIR = `${ASSETS_DIR}/images`;



  // isProduction
  const isProduction = process.env.NODE_ENV === "production";
  const outputDir = isProduction ? "build" : "dist";
  const outputAssetsDir = `${outputDir}/${ASSETS_DIR}`;
  const outputCssDir = `${outputDir}/${CSS_DIR}`;
  const outputJsDir = `${outputDir}/${JS_DIR}`;
  const outputImagesDir = `${outputDir}/${IMAGES_DIR}`;

  eleventyConfig.on("eleventy.before", async () => {
    // await rimraf(outputDir);

    await fs.mkdir(`${outputCssDir}`, { recursive: true });
    await fs.mkdir(`${outputJsDir}`, { recursive: true });
    await fs.mkdir(`${outputImagesDir}`, { recursive: true });

    // PostCSS処理
    const css = await fs.readFile('src/css/style.css', 'utf8');
    
    const postcssPlugins = [
      postcssImport(),
      postcssNesting(),
      tailwindcss(),
      postcssPresetEnv({
        features: { "nesting-rules": false },
      }),
    ];

    const result = await postcss(postcssPlugins).process(css, {
      from: 'src/css/style.css',
      to: `${outputCssDir}/style.css`
    });

    await fs.writeFile(`${outputCssDir}/style.css`, result.css);
    if (result.map) {
      await fs.writeFile(`${outputCssDir}/style.css.map`, result.map.toString());
    }

    //js
    await esbuild.build({
      entryPoints: glob.sync("src/js/!(_)*.js"),
      bundle: true,
      minify: isProduction,
      sourcemap: !isProduction,
      target: isProduction ? ["es2015"] : ["esnext"],
      outdir: outputJsDir,
      logLevel: "info",
    });
  });



  // 11ty.jsx, 11ty.ts, 11ty.tsx
  eleventyConfig.addExtension(["11ty.jsx", "11ty.ts", "11ty.tsx"], {
    key: "11ty.js",
  });

  eleventyConfig.addTransform("tsx", async (content: any) => {
    const result = await renderToString(content);
    const convertedResult = convertJsxAttributes(result);
    return `<!doctype html>\n${convertedResult}`;
  });

  eleventyConfig.addTemplateFormats("11ty.jsx,11ty.tsx");

  //
  eleventyConfig.addWatchTarget("./src/js/");
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./src/images/");

  return {
    dir: {
      input: "src",
      layouts: "../_layouts",
      data: "_data",
      output: outputDir,
    },
  };
}
