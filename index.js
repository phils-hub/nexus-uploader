const path = require('path')
const program = require('commander')
const colors = require('colors/safe')

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

let idxOfBasename = utils.getBasenameIndex(program.directory)
let components = utils.filePaths(program.directory)
components.map(compPath => {
  let directory = utils.normalizePath(path.dirname(compPath)).split('/')
    .filter((e, idx) => idx >= idxOfBasename).join('/')
  let pathToFile = compPath
  let filename = path.basename(compPath)
  console.log(`${program.simulate ? 'Simulating upload of' : 'Uploading'} component:
  \tdirectory: ${directory}
  \tpathToFile: ${pathToFile}
  \tfilename: ${filename}
  `)
  
  if (! program.simulate) {
    nexusApi.publishRawComponent(directory, pathToFile, filename)
    .catch(error => {
      console.error(colors.red(`
      Error occurred when processing file ${pathToFile}.
      Error message: ${error.message}
      `))
    })
  }
})

/*
.then(response => response.data.data)
  .catch(err => console.error(err))
*/
/*
axios.get(process.env.NEXUS_URL+'/all_repositories',
  {
    auth: {
      username: process.env.NEXUS_AUTH_USER,
      password: process.env.NEXUS_AUTH_PASS
    },
    headers: {
      'Accept': 'application/json'
    },
  })
  .then(response => response.data.data)
  .then(repositories => {
    console.log(repositories)
    return repositories
  })
  .then(repositories => {
    let tmpDirName = './tmp-' + new Date().getTime()
    repositories.forEach(repo => fs.mkdirSync(path.resolve(tmpDirName, repo.id), { recursive: true }))
    return repositories
  })
  .catch(err => console.error(err))
  */