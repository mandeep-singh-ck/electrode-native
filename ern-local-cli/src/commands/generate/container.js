import {
  generateMiniAppsComposite
} from '@walmart/ern-container-gen'
import {
  explodeNapSelector
} from '@walmart/ern-util'
import {
  runContainerGen
} from '../../lib/publication'
import _ from 'lodash'
import cauldron from '../../lib/cauldron'
import inquirer from 'inquirer'

exports.command = 'container'
exports.desc = 'Run the container generator'

exports.builder = function (yargs) {
  return yargs
    .option('verbose', {
      type: 'bool',
      describe: 'verbose output'
    })
    .option('fullNapSelector', {
      type: 'string',
      alias: 'n',
      describe: 'Full native application selector'
    })
    .option('containerVersion', {
      type: 'string',
      alias: 'v',
      describe: 'Version of the generated container'
    })
    .option('jsOnly', {
      type: 'bool',
      alias: 'js',
      describe: 'Generates JS only (composite app)'
    })
    .group(['outputFolder, miniapps'], 'jsOnly Options:')
    .option('outputFolder', {
      type: 'string',
      alias: 'out',
      describe: 'Output folder path'
    })
    .option('miniapps', {
      type: 'array',
      alias: 'm',
      describe: 'A list of one or more miniapps'
    })
}

exports.handler = async function (argv) {
  let {
    fullNapSelector,
    containerVersion,
    jsOnly,
    outputFolder,
    verbose,
    miniapps
  } = argv

  let explodedNapSelector

  //
  // Full native application selector was not provided.
  // Ask the user to select a fullNapSelector from a list
  // containing all the native applications versions in the cauldron
  // Not needed if miniapps are provided with jsOnly flag
  if (!fullNapSelector && !miniapps) {
    const nativeApps = await cauldron.getAllNativeApps()

    // Transform native apps from the cauldron to an Array
    // of fullNapSelector strings
    // [Should probably move to a Cauldron util class for reusability]
    let result = _.flattenDeep(
                  _.map(nativeApps, nativeApp =>
                    _.map(nativeApp.platforms, platform =>
                      _.map(platform.versions, version =>
                       `${nativeApp.name}:${platform.name}:${version.name}`))))

    const { userSelectedFullNapSelector } = await inquirer.prompt([{
      type: 'list',
      name: 'userSelectedFullNapSelector',
      message: 'Choose a native application version for which to generate container',
      choices: result
    }])

    fullNapSelector = userSelectedFullNapSelector
    explodedNapSelector = explodeNapSelector(fullNapSelector)
  }

  //
  // If the user wants to generates a complete container (not --jsOnly)
  // user has to provide a container version
  // If not specified in command line, we ask user to input the version
  if (!containerVersion && !jsOnly) {
    const { userSelectedContainerVersion } = await inquirer.prompt([{
      type: 'input',
      name: 'userSelectedContainerVersion',
      message: 'Enter version for the generated container'
    }])

    containerVersion = userSelectedContainerVersion
  }

  //
  // --jsOnly switch
  // Ony generates the composite miniapp to a provided output folder
  if (jsOnly) {
    if (!miniapps) {
      miniapps = await cauldron.getContainerMiniApps(...explodedNapSelector)
    }

    if (!outputFolder) {
      const { userSelectedOutputFolder } = await inquirer.prompt([{
        type: 'input',
        name: 'userSelectedOutputFolder',
        message: 'Enter output folder path'
      }])

      outputFolder = userSelectedOutputFolder
    }

    await generateMiniAppsComposite(miniapps, outputFolder)
  } else {
    await runContainerGen(
      explodedNapSelector[0], /* nativeAppName */
      explodedNapSelector[1], /* nativeAppPlatform */
      explodedNapSelector[2], /* nativeAppVersion */
      containerVersion,
      verbose)
  }
}
