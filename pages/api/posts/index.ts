import {DocumentDetail} from "@/types/types";
import { toArray} from "@/components/utils";
const utils = require("../../../server-utils")
const fs = require('fs')

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
      const map = toArray((new Map<string, DocumentDetail>(Object.entries(JSON.parse(data)))).values())
      posts = map.sort((a, b) => b.createdAt - a.createdAt)
    }
    res.status(200).json(JSON.stringify({
      "posts": posts
    }));
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;