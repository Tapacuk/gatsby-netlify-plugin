const loadUmbracoNodes = require("./lib/load-umbraco-nodes")
const createAndRegisterCommonInterface = require("./lib/create-common-interface")
const validateAndPrepOptions = require("./lib/validate-and-prep-options")
const createAndConfigureAxios = require("./lib/create-and-configure-axios")
const asyncForEach = require("./util/asyncForEach")

exports.sourceNodes = async (gatsby, pluginOptions) => {
  await asyncForEach(pluginOptions.urls, async url => {
          pluginOptions.url = url;
          await loadAsync(gatsby, pluginOptions);
      }
    )
}

async function loadAsync(gatsby, pluginOptions) {
  const options = await validateAndPrepOptions(pluginOptions, gatsby.reporter)
  const axios = createAndConfigureAxios(gatsby, options)

  const helpers = {
    gatsby,
    axios,
    options,
  }
  await loadUmbracoNodes(helpers)
  createAndRegisterCommonInterface(gatsby, options)
}