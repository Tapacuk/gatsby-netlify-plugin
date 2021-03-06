const { registerType } = require("./typeRegistry")
const fetchAndValidateSitemap = require("./fetch-and-validate-sitemap")
const loadRemoteFiles = require("./load-remote-files")
const handleForeignKeyFields = require("./handle-foreign-key-fields")

const asyncForEach = require("../util/asyncForEach")
const formatMessage = require("../util/formatMessage")

module.exports = async helpers => {
  const sitemap = await fetchAndValidateSitemap(helpers)
  helpers.gatsby.reporter.verbose(formatMessage(`Fetching nodes from Umbraco`))
  return loadNodeRecursive(helpers, sitemap.root)
}

async function loadNodeRecursive(helpers, sitemapNode, parent) {
  const node = await loadNode(helpers, sitemapNode, parent)
  if (sitemapNode.children.length > 0) {
    await asyncForEach(sitemapNode.children, async child =>
      loadNodeRecursive(helpers, child, node)
    )
  }
}

async function loadNode(helpers, sitemapNode, parent) {
  const { gatsby } = helpers
  const data = await fetchDataForSitemapNode(helpers, sitemapNode)
  const nodeMeta = createGatsbyNodeMeta(gatsby, data, sitemapNode, parent, helpers.options)
  let fields = await loadRemoteFiles(helpers, data, nodeMeta)
  fields = handleForeignKeyFields(helpers, fields)

  const node = {
    ...fields,
    ...nodeMeta,
  }

  gatsby.actions.createNode(node)
  registerType(node.internal.type)
  if (parent) gatsby.actions.createParentChildLink({ parent, child: node })

  return node
}

async function fetchDataForSitemapNode(helpers, sitemapNode) {
  const { gatsby, axios } = helpers
  gatsby.reporter.verbose(
    formatMessage(`Fetching node data from: ${sitemapNode.path}`)
  )
  try {
    const response = await axios.get(sitemapNode.path)
    return response.data
  } catch (error) {
    const message = formatMessage(
      `Problem fetching node data from: ${sitemapNode.path}.`
    )
    gatsby.reporter.panic(message, error)
  }
}

function createGatsbyNodeMeta(gatsby, content, sitemapNode, parent = {}, options) {
  return {
    id: gatsby.createNodeId(sitemapNode.id),
    parent: parent.id,
    children: [],
    internal: {
      type: sitemapNode.type + options.url.substr(23, 25).toUpperCase(),
      contentDigest: gatsby.createContentDigest(content),
    },
  }
}
