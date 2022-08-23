import axios from "axios";

function replyMusicBackToUser(
  whatsappToken: string,
  phoneNumberId: string,
  from: string,
  trackId: string
) {
  return replyMessageBackToUser(whatsappToken, phoneNumberId, from, `${process.env.HOST}/queue?trackId=${trackId}`);
}

function replyMessageBackToUser(
  whatsappToken: string,
  phoneNumberId: string,
  from: string,
  message: string
) {
  return axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phoneNumberId +
      "/messages?access_token=" +
      whatsappToken,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: { body: message },
    },
    headers: { "Content-Type": "application/json" },
  });
}

export { replyMusicBackToUser, replyMessageBackToUser };
