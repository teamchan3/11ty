import clsx from 'clsx';

export const data = {
  layout: "BaseLayout",
  title: "ページタイトル"
};

export function render(): JSX.Element {
  return <h1 className={clsx(`c-hoge`)}>aaa</h1>;
}