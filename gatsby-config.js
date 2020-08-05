/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    // {
    //   resolve: "gatsby-source-umbraco",
    //   options: {
    //     url: "http://localhost:53565/ua",
    //   },
    // },
    {
      resolve: "gatsby-source-umbraco-rest",
      options: {
        url: "http://localhost:53565/",
        urls: [
          "http://localhost:53565/",
          "http://localhost:53565/ua",
          "http://localhost:53565/ru"
        ]
      },
    },
    {
      resolve: `gatsby-plugin-trigger-deploy`,
      options: {
        secretKey: 'secret',
        addressCallback: 'http://localhost/endpoint/for/notifying',
      },
    },
  ],
}
