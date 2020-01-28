# Nexus Uploader
## Description
A command line application for uploading components to the Nexus 3 repository manager.

## Installation
Clone the repository and install dependencies:
```
git clone https://github.com/phils-hub/nexus-uploader.git
npm install
```
Provide the necessary access details in a *.env* file located within the current working directory:
```
NEXUS3_AUTH_USER=$rest_basicauth_username
NEXUS3_AUTH_PASS=$rest_basicauth_password
NEXUS3_URL=$rest_api_endpoint
NEXUS3_REPOSITORY_ID=$repository_id
```

## Quick Start
Upload files located under a certain directory:
```
npm run start -- -d some/dir/copy-of-nexus-2-site-repo
```
The basename of the provided path will serve as the top level directory in the target Nexus 3 repository.

Simulate uploading of files by omitting the actual REST based upload to Nexus 3:
```
npm run start -- -d some/dir/copy-of-nexus-2-site-repo --simulate
```

## Example
```
npm run start -- -d some/dir/copy-of-nexus-2-site-repo
```

## FAQ
* Sometimes certain components fail to get uploaded due to a server error (502). In such cases either re-run the application or manually upload the missing component.
* Resuming of failed uploads is currently not supported.
