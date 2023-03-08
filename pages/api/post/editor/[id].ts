import {DocumentDetail} from "@/types/types";
const utils = require("../../../../server-utils")

const handler = async (req, res) => {
  try {
    const {id, apiKey}  = req.query
    let p: DocumentDetail = {}
    const allDocuments = await utils.getAllDocuments(utils.filePaths.dataFile)
    const documentsByApiKey: Map<string, DocumentDetail> = utils.getDocumentsByApiKey(allDocuments, apiKey)
    if (documentsByApiKey.has(id)) {
      p = documentsByApiKey.get(id)
    }
    res.status(200).json(JSON.stringify({
      "post": p
    }));
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;