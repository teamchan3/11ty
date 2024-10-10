import { Heading } from "../components/Heading";

export type ViewProps = {
  content: string;
  title: string;
  scripts?: string[];
  styles?: string[];
};

export function BaseLayout({ content, title, scripts = [], styles = [] }: ViewProps): JSX.Element {
  return (
    <html lang="ja">
      <head>
        <title>{title}</title>
        {styles.map((style, index) => (
          <link key={index} rel="stylesheet" href={style} />
        ))}
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body>
        <Heading name={title} />
        <p>hoge</p>
        {content}

        {scripts.map((script, index) => (
          <script key={index} src={script}></script>
        ))}
        <script src="/assets/js/script.js"></script>
      </body>
    </html>
  );
}

export const render = BaseLayout;
