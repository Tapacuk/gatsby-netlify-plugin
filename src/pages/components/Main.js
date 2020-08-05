import React from 'react';
import { useStaticQuery, graphql } from "gatsby";

export default function useSiteMetadata() {
  const site = useStaticQuery(
    graphql`
      query MyQuery {
  allHomePageUa {
    nodes {
      description
      title
    }
  }
}
`);
console.log(site);
  return (
        <div></div>
  );
}