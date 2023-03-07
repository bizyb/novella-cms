import {DocumentDetail} from "@/types/types";
import {getNextDocument, getPrevDocument} from "@/components/utils";
const utils = require("../../../server-utils")

const fs = require('fs')

const openFile = async (path: string) => {
  try {
    return await fs.promises.readFile(path, 'utf8')
  } catch (e) {
    return null
  }
}

const handler = async (req, res) => {
  try {
    let p: DocumentDetail = null
    const slugData = await openFile(utils.filePaths.slugFile)
    const data = await openFile(utils.filePaths.dataFile)
    if (slugData && data) {
      const slugs = new Map<string, string>(Object.entries(JSON.parse(slugData)))
      const map = new Map<string, DocumentDetail>(Object.entries(JSON.parse(data)))
      p = map.get(slugs.get(req.params.slug))
      if (p === undefined) {
        // If the document cannot be located by its slug, then treat the slug as a uid
        p = map.get(req.params.slug)
      }
      p.next = getNextDocument(map, p)
      p.prev = getPrevDocument(map, p)
    }
    res.status(200).json({
      "post": p
    })
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;