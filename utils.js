const fs = require('fs')
const path = require('path')
const colors = require('colors')

function validateArgs(directory) {
  let isValid = true
  try {
    path.parse(directory)
    if (! fs.existsSync(directory)) {
      throw new Error(`The given directory ${directory} does not exist.`)
    }
  } catch (e) {    
    console.log(colors.red(e.message))
    isValid = false
  }  
  return isValid
}

/**
 * Obtain a list of flattened file paths of all files within the given directory.
 * Adapted from the source: https://gist.github.com/kethinov/6658166
 * @param {*} dir relative or absolute directory path
 * @param {RegExp|String} filter to optionally filter based on the filename
 * @returns {String[]} of file paths 
 */
function filePaths(dir, filter) { 
  function extractFilePaths(dir, fileList = []) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const stat = fs.statSync(path.join(dir, file))
      if (stat.isDirectory()) {
        fileList = extractFilePaths(path.join(dir, file), fileList)
      } else {        
        fileList.push(path.join(dir, file))
      }
    }
    return fileList
  }
  let filePaths = extractFilePaths(dir)
  return filter ? filePaths.filter(filename => filename.match(filter)) : filePaths
}

function normalizePath(inputPath) {
  return inputPath.replace(/\\/g, '/').replace('C:', '/')
}  

/**
 * Get the index of the folder depth of the basename in the given path.
 * @param {String} inputPath 
 */
function getBasenameIndex(inputPath) {
  return normalizePath(inputPath)
    .split('/')
    .findIndex(e => e === path.parse(inputPath).base)
}

module.exports = {
  validateArgs,
  filePaths,
  normalizePath,
  getBasenameIndex
}