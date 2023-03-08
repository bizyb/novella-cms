require('dotenv').config()
const shelljs = require('shelljs');
const fs = require('fs')

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

const toArray = (documentDetails) => {
  const records = []
  let record = documentDetails.next()
  while (!record.done) {
    records.push(record.value)
    record = documentDetails.next()
  }
  return records;
}

const getTargetDocument = (data, currentRecord, prev) => {
  try {
    const records = toArray(data.values())
    const sortedRecords = records.filter(it => it.slug)
    .sort((a, b) => a.createdAt - b.createdAt)
    for (let i = 0; i < sortedRecords.length; i++) {
      const r = sortedRecords[i]
      if (r.uid === currentRecord.uid) {
        let index = i + 1
        if (prev) {
          index = i - 1
        }
        if (index < sortedRecords.length && index >= 0) {
          const targetRecord = sortedRecords[index]
          return {
            uid: targetRecord.uid,
            slug: targetRecord.slug,
            createdAt: targetRecord.createdAt,
            title: targetRecord.title,
            description: targetRecord.description,
            thumbnail: targetRecord.thumbnail
          }
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
  return null
}

const getNextDocument = (data, currentRecord) => {
  return getTargetDocument(data, currentRecord, false)

}

const getPrevDocument = (data, currentRecord) => {
  return getTargetDocument(data, currentRecord, true)
}

const getIpAddress = (req) => {
  let ip = req.ip
  if (ip === undefined) {
    ip = req.socket?.remoteAddress
  }
  if (ip.substring(0, 7) === "::ffff:") {
    ip = ip.substring(7)
  }
  return ip
}

const getEpochTime = () => {
  return Math.round(Date.now() / 1000)
}

const randomId = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const openFile = async (path) => {
  try {
    return await fs.promises.readFile(path, 'utf8')
  } catch (e) {
    return null
  }
}

const getIdFromSlug = async (slug, apiKey) => {
  const slugData = await openFile(filePaths.slugFile)
  const slugs = new Map(Object.entries(JSON.parse(slugData)))
  const slugsByApiKey = slugs.get(apiKey)
  if (slugsByApiKey) {
    try {
      return (new Map(Object.entries(JSON.parse(slugsByApiKey)))).get(slug)
    } catch (e) {

    }
  }
  return null
}

const getAllDocumentsByApiKey = async (apiKey) => {
  const allDocuments = await getAllDocuments(filePaths.dataFile)
  const documentsByApiKey = getDocumentsByApiKey(allDocuments, apiKey)
  if (documentsByApiKey) {
    const documents = toArray(documentsByApiKey.values())
    return documents.sort((a, b) => b.createdAt - a.createdAt)
  }
  return []
}

const getAllDocuments = async (path) => {
  const data = await openFile(path)
  if (data) {
    return new Map(Object.entries(JSON.parse(data)))
  }
  return new Map()
}

const getDocumentsByApiKey = (allDocuments, apiKey) => {
  if (allDocuments.has(apiKey)) {
    const documentsByApiKeyStr = allDocuments.get(apiKey)
    try {
      return new Map(Object.entries(JSON.parse(documentsByApiKeyStr)))
    } catch (e) {
      console.log(e)
    }
  }
  return new Map()
}

const saveFile = async (file, slug, uid, apiKey) => {
  await fs.promises.writeFile(filePaths.dataFile, file)
  // map the slug to the uid for editor GET requests
  let data = await openFile(filePaths.slugFile)
  let allSlugs = new Map()
  if (data) {
    allSlugs = new Map(Object.entries(JSON.parse(data)))
  }
  let slugsByApiKey = new Map()
  if (allSlugs) {
    try {
      slugsByApiKey = new Map(Object.entries(JSON.parse(allSlugs.get(apiKey))))
    } catch (e) {
      console.log(e)
    }
  }
  slugsByApiKey.set(slug, uid)
  allSlugs.set(apiKey, JSON.stringify(Object.fromEntries(slugsByApiKey)))
  const slugStr = JSON.stringify(Object.fromEntries(allSlugs))
  await fs.promises.writeFile(filePaths.slugFile, slugStr)
  console.log(`File ${uid} has been saved`);
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
  saveFile,
  getAllDocuments,
  getDocumentsByApiKey,
  getAllDocumentsByApiKey,
  getIdFromSlug,
  getNextDocument,
  getPrevDocument,
  getIpAddress,
  randomId,
  getEpochTime,
  filePaths,
  creds,
}



