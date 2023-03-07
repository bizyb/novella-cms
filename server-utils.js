require('dotenv').config()
const shelljs = require('shelljs');

const creds = {
  email: process.env.REACT_APP_GIT_EMAIL,
  name: process.env.REACT_APP_GIT_OWNER_FULL_NAME,
  username: process.env.REACT_APP_GIT_USERNAME,
  password: process.env.REACT_APP_GIT_PA_TOKEN
}

const filePaths = {
  gitProvider: process.env.REACT_APP_GIT_PROVIDER_DOMAIN,
  gitRepo: process.env.REACT_APP_GIT_REPO,
  gitRepoFullName: process.env.REACT_APP_GIT_REPO_OWNER + "/" + process.env.REACT_APP_GIT_REPO,
  localRoot: process.env.REACT_APP_LOCAL_ROOT,
  dataLocalRoot: process.env.REACT_APP_LOCAL_ROOT + "/" + process.env.REACT_APP_GIT_REPO,
  dataFile:  process.env.REACT_APP_LOCAL_ROOT + "/" + process.env.REACT_APP_GIT_REPO + "/" + process.env.REACT_APP_DATA_FILE,
  slugFile: process.env.REACT_APP_LOCAL_ROOT + "/" + process.env.REACT_APP_GIT_REPO + "/" + process.env.REACT_APP_SLUG_FILE,
}

const commitFiles = () => {
  shelljs.cd(filePaths.dataLocalRoot)
  shelljs.exec(`git add --all`);
  shelljs.exec(`git commit -m "Update files"`);
  shelljs.exec(`git pull --ff-only`);
  shelljs.exec(`git pull https://${creds.username}:${creds.password}@${filePaths.gitProvider}/${filePaths.gitRepoFullName}`);
  shelljs.exec(`git push origin main`)
  console.log("Files have been committed")
}


const initGitRepo = async () => {
  console.log("******Initializing git repo******")
  console.log("Paths: ")
  console.log(filePaths)
  shelljs.exec("rm -rf " + filePaths.dataLocalRoot)
  shelljs.exec("git config --global pull.ff only")
  const cloneCommand = `git clone https://${creds.username}:${creds.password}@${filePaths.gitProvider}/${filePaths.gitRepoFullName}`
  shelljs.cd(filePaths.localRoot)
  shelljs.exec(cloneCommand)
  shelljs.cd(filePaths.dataLocalRoot)
  shelljs.exec(`git config --global user.email "${creds.email}"`)
  shelljs.exec(`git config --global user.name "${creds.name}"`)
}
module.exports = {
  commitFiles,
  initGitRepo,
  filePaths,
  creds: creds
}



