"use strict";
//import request from 'request';
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import { queueSong, searchTracks } from './spotify';

dotenv.config();

const token = process.env.WHATSAPP_TOKEN;
const app = express().use(bodyParser.json());

let appState = {
  accessToken: '',
  refreshToken: '',
  expiresIn: 0,
};

// Sets server port and logs message on success

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

app.get("/", (req, res) => {
  res.send("hey");
});

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("ADSDASDAS");
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: " + msg_body },
        },
        headers: { "Content-Type": "application/json" },
      });
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  console.log("ADSDASDAS GET");
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

const redirect_uri = "http://localhost:3000/callback";

app.get("/spotifyLogin", (req, res) => {
  const scope = ["user-modify-playback-state", "user-read-private"];
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.CLIENT_ID as string,
    scope: scope.join(" "),
    redirect_uri,
  }).toString();
  //res.send(`<a href="https://facebook.com">Login with Spotify</a>`);
  res.redirect("https://accounts.spotify.com/authorize?" + params);
});

app.get("/callback", async (req, res) => {
  const authCredentials = Buffer.from(
    process.env.CLIENT_ID + ":" + process.env.SECRET_ID
  ).toString("base64");
  const code = req.query.code;
  const authResponse = await axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authCredentials}`,
    },
    params: {
      code,
      grant_type: "authorization_code",
      redirect_uri,
    },
  });

  appState = {
    accessToken: authResponse.data.access_token,
    refreshToken: authResponse.data.refresh_token,
    expiresIn: authResponse.data.expires_in,
  }

  res.send("success " + JSON.stringify(authResponse.data, null, 2));
});

app.get("/queue", async (req, res) => {
  res.send("TOKEN " + JSON.stringify(appState, null, 2));
  await queueSong(appState.accessToken, req.query.trackId as string);
})

app.get("/search", async (req, res) => {
  const search = await searchTracks(appState.accessToken, req.query.searchString as string);
  console.log(JSON.stringify(search.data.tracks.items, null, 2));
  res.json(search.data.tracks.items);
})
