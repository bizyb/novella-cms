const utils = require("../../../../server-utils")

const handler = async (req, res) => {
  try {
    const {apiKey}  = req.query
    res.status(200).json({
      "posts": await utils.getAllDocumentsByApiKey(apiKey)
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;