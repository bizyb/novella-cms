import {v4 as uuidv4} from 'uuid';
import {DocumentDetail} from "@/types/types";
import {getEpochTime} from "@/components/utils";
const moment = require('moment')
const utils = require("../../../../server-utils")

const handler = async (req, res) => {
  const request: DocumentDetail = req.body as DocumentDetail
  let record: DocumentDetail
  try {
    const allDocuments = await utils.getAllDocuments(utils.filePaths.dataFile)
    const documentsByApiKey: Map<string, DocumentDetail> = utils.getDocumentsByApiKey(allDocuments, request.apiKey)
    if (documentsByApiKey.has(request.uid)) {
      record = documentsByApiKey.get(request.uid)
    }
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
    record.apiKey = request.apiKey
    record.published = request.published ? request.published : false
    documentsByApiKey.set(record.uid, record)
    allDocuments.set(record.apiKey, JSON.stringify(Object.fromEntries(documentsByApiKey)))
    res.status(200).json(JSON.stringify({
      "status": "ok",
      "uid": record.uid
    }));

    utils.saveFile(JSON.stringify(Object.fromEntries(allDocuments)), record.slug, record.uid, record.apiKey)
    .then(_ => {
      utils.commitFiles()
    })
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;