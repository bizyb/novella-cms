import {getEpochTime, randomId} from "@/components/utils";

const handler = async (_req, res) => {
  const PADDING_LENGTH = 3
  try {
    const time = getEpochTime()
    const ip = '' //getIpAddress(req)
    const uniquePadding = randomId(PADDING_LENGTH)
    const apiKey = `${time}:${ip}`
    const apiKeyEncoded = uniquePadding + btoa(apiKey)
    console.log("New API Key generated: ", apiKey, " encoded: ", apiKeyEncoded)
    res.status(200).json({
      "apiKey": apiKeyEncoded
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;