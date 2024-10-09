# My 11ty Project

このプロジェクトは、11ty と Tailwind CSS を使用した静的サイトジェネレーターのプロジェクトです。

## 必要条件

- Node.js (推奨バージョン: `.node-version`ファイルに指定されたバージョン)
- npm (Node.js に含まれています)

## セットアップ

1. リポジトリをクローンします。

   ```bash
   git clone <リポジトリのURL>
   cd my-11ty-project
   ```

2. `.node-version`ファイルに指定された Node.js のバージョンを使用します。`nvm`を使用している場合は、以下のコマンドでバージョンを切り替えられます。

   ```bash
   nvm use
   ```

3. 依存関係をインストールします。

   ```bash
   npm install
   ```

## スクリプト

- `npm run clean:dist`: `dist`ディレクトリを削除します。
- `npm run clean:build`: `build`ディレクトリを削除します。
- `npm run build:eleventy`: Eleventy を使用してサイトをビルドします。
- `npm run build:tailwind`: Tailwind CSS をビルドして`dist/css/style.css`に出力します。
- `npm run build`: 開発環境で Eleventy をビルドします。
- `npm run build:prod`: 本番環境で Eleventy をビルドします。
- `npm run dev`: 開発サーバーを起動し、Eleventy を監視モードで実行します。
- `npm start`: 開発サーバーを起動します（`npm run dev`のエイリアス）。

## 依存関係

- **@11ty/eleventy**: 静的サイトジェネレーター
- **concurrently**: 複数のコマンドを同時に実行するためのツール
- **tailwindcss**: ユーティリティファーストの CSS フレームワーク

## 開発依存関係

- **autoprefixer**: CSS にベンダープレフィックスを自動的に追加
- **cross-env**: 環境変数をクロスプラットフォームで設定
- **cssnano**: CSS の最適化と圧縮
- **esbuild**: 高速な JavaScript バンドラー
- **html-minifier**: HTML の最適化と圧縮
- **imagemin**: 画像の最適化
- **imagemin-mozjpeg**: JPEG 画像の最適化
- **imagemin-pngquant**: PNG 画像の最適化
- **imagemin-svgo**: SVG 画像の最適化
- **js-beautify**: JavaScript の整形
- **postcss**: CSS の変換ツール
- **postcss-cli**: PostCSS のコマンドラインインターフェース
- **rimraf**: ディレクトリの削除ツール
