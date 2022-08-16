import axios from "axios";

function replyBackToUser(
  whatsappToken: string,
  phoneNumberId: string,
  from: string,
  trackId: string
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
      text: { body: `${process.env.HOST}/queue?trackId=${trackId}` },
    },
    headers: { "Content-Type": "application/json" },
  });
}

export { replyBackToUser };
