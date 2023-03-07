import {v4 as uuidv4} from 'uuid';
import {DocumentDetail} from "@/types/types";
import {getEpochTime} from "@/components/utils";
const moment = require('moment')
const utils = require("../../../../server-utils")
const fs = require('fs')

const openFile = async (path: string) => {
  try {
    return await fs.promises.readFile(path, 'utf8')
  } catch (e) {
    return null
  }
}

const saveFile = async (file: string, slug: string, uid: string) => {
  await fs.promises.writeFile(utils.filePaths.dataFile, file)
  // map the slug to the uid for editor GET requests
  let data = await openFile(utils.filePaths.slugFile)
  let slugs = new Map<string, string>()
  if (data) {
    slugs = new Map<string, string>(Object.entries(JSON.parse(data)))
  }
  slugs.set(slug, uid)
  const slugStr = JSON.stringify(Object.fromEntries(slugs))
  await fs.promises.writeFile(utils.filePaths.slugFile, slugStr)
  console.log(`File ${uid} has been saved`);
}

const handler = async (req, res) => {
  const request: DocumentDetail = req.body as DocumentDetail
  let record: DocumentDetail
  try {
    const data = await openFile(utils.filePaths.dataFile)
    let documents = new Map<string, DocumentDetail>()
    if (data) {
      documents = new Map<string, DocumentDetail>(Object.entries(JSON.parse(data)))
    }
    record = documents.get(request.uid)
    if (record === undefined) {
      record = {
        uid: uuidv4(),
        createdAt: getEpochTime(),
      }
    }

    record.date = moment.unix(record.createdAt).format('dddd, MMMM Do, YYYY h:mm:ss A')
    record.updatedAt = getEpochTime()
    record.content = request.content
    record.title = request.title
    record.slug = request.slug
    record.published = request.published ? request.published : false
    documents.set(record.uid, record)
    res.status(200).json(JSON.stringify({
      "status": "ok",
      "uid": record.uid
    }));

    saveFile(JSON.stringify(Object.fromEntries(documents)), record.slug, record.uid)
    .then(_ => {
      utils.commitFiles()
    })
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;