import axios from "axios";

export const generateZoomToken = async () => {
  const params = new URLSearchParams({
    grant_type: "account_credentials",
    account_id: process.env.ZOOM_ACCOUNT_ID,
  });

  const auth = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    "https://zoom.us/oauth/token",
    params,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return res.data.access_token;
};