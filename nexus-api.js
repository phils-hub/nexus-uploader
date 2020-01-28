const fs = require('fs')
const axios = require('axios').default
const FormData = require('form-data')

/**
 * Publish a raw component to the given repository.
 * @param {FormData} form 
 */
function publishRawComponent(directory, pathToFile, filename) {
  var form = new FormData()
  form.append('raw.directory', directory)
  form.append('raw.asset1', fs.createReadStream(pathToFile))
  form.append('raw.asset1.filename', filename)

  return axios({
    method: 'POST',
    auth: {
      username: process.env.NEXUS3_AUTH_USER,
      password: process.env.NEXUS3_AUTH_PASS
    },
    headers: {
      'Accept': 'application/json',
      'content-type': `multipart/form-data; boundary=${form._boundary}`
    },
    maxContentLength: Infinity,
    url: process.env.NEXUS3_URL + `/v1/components?repository=${process.env.NEXUS3_REPOSITORY_ID}`,
    data: form
  })
}

module.exports = { 
  publishRawComponent
}