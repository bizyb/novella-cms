import {DocumentDetail} from "@/types/types";
const utils = require("../../../server-utils")

const handler = async (req, res) => {
  try {
    let p: DocumentDetail = null
    const {slug, apiKey}  = req.query
    const allDocuments = await utils.getAllDocuments(utils.filePaths.dataFile)
    const documentsByApiKey: Map<string, DocumentDetail> = utils.getDocumentsByApiKey(allDocuments, apiKey)

    if (documentsByApiKey) {
      const id = await utils.getIdFromSlug(slug, apiKey)
      p = documentsByApiKey.get(req.params.slug)
      if (p === undefined && id !== undefined) {
        // If the document cannot be located by its slug, then treat the slug as its uid
        p = documentsByApiKey.get(id)
      }
      if (p) {
        p.next = utils.getNextDocument(documentsByApiKey, p)
        p.prev = utils.getPrevDocument(documentsByApiKey, p)
      }
    }
    res.status(200).json({
      "post": p
    })
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;