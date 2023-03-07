import {DocumentDetail} from "@/types/types";
const utils = require("../../../../server-utils")
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
    const data = await openFile(utils.filePaths.dataFile)
    let p: DocumentDetail = null
    if (data) {
      const map = new Map<string, DocumentDetail>(Object.entries(JSON.parse(data)))
      p = map.get(req.params.id)
    }
    res.status(200).json(JSON.stringify({
      "post": p
    }));
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;