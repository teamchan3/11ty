import React from 'react';

interface DataProps {
  layout: string;
  title: string;
}

export const data: DataProps = {
  layout: "layouts/base.njk",
  title: "aaa",
};

export default function Index(): React.ReactElement {
  return <h1>Hello ESMabcaaabca</h1>;
}