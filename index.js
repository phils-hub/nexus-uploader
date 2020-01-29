const path = require('path')
const fs = require('fs')
const program = require('commander')
const convert = require('xml-js')
const jsonpath = require('jsonpath')

const nexusApi = require('./nexus-api')
const utils = require('./utils')

program
  .version('1.0.0')
  .description(`A command line application for uploading components to the Nexus 3 repository manager.
  Note that sometimes certain components fail to get uploaded due to a server error (502). In such cases either re-run the application or manually upload the missing component.
  Resuming of failed uploads is currently not supported.
  Example usage: npm run start -- -d some/dir/copy-of-nexus-2-site-repo`)
  .requiredOption('-d, --directory <path>', 'Relative path to the directory (namely the path\'s basename) that is to be uploaded. This directory will be used as the top level directory for the target repository upload.')
  .option('-s, --simulate', 'Exclude actual transfer to the remote repository.')
program.parse(process.argv)

if (! utils.validateArgs(program.directory)) {
  process.exit()
}

// 1. Find all poms (done)
// 2. Extract all dependencies (done)
// 3. Download all dependencies from Nexus2
// 4. Upload all dependencies to Nexus3

function extractDependenciesFromPom(pomAsJson) {
  let dependenciesNodes = jsonpath.query(pomAsJson, '$..dependencies')
  return dependenciesNodes
    .map(dependencies => dependencies.dependency)
    .reduce((prev, curr) => prev.concat(curr))
    .map(dependency => {
      return {
        groupId: dependency.groupId._text,
        artifactId: dependency.artifactId._text,
        version: dependency.version._text
      }
    })
}

function extractDependenciesFromDir(directory, pomFilter = 'superpom.xml') {
  // let pomFilter = /(\w*|\d*)pom\.xml/
  let pomPaths = utils.filePaths(directory, pomFilter)
  let allDependencies = pomPaths.map(pomPath => {
    let pomFile = fs.readFileSync(pomPath, { encoding: 'utf-8' })    
    let pomAsJson = convert.xml2js(pomFile, { trim: true, compact: true})
    let dependencies = extractDependenciesFromPom(pomAsJson)   
    return dependencies
  }).reduce((prev, curr) => prev.concat(curr))
  return allDependencies
}

let dependencies = extractDependenciesFromDir(program.directory)
console.log(dependencies)