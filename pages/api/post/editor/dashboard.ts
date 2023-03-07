import {DocumentDetail} from "@/types/types";
import {toArray} from "@/components/utils";
const fs = require('fs')
const utils = require("../../../../server-utils")

const openFile = async (path: string) => {
  try {
    return await fs.promises.readFile(path, 'utf8')
  } catch (e) {
    return null
  }
}

const handler = async (_req, res) => {
  try {
    let posts = []
    const data = await openFile(utils.filePaths.dataFile)
    if (data) {
      const map = new Map<string, DocumentDetail>(Object.entries(JSON.parse(data)))
      const documents: DocumentDetail[] = toArray(map.values())
      posts = documents.sort((a, b) => b.createdAt - a.createdAt)
    }
    res.status(200).json(JSON.stringify({
      "posts": posts
    }));
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;