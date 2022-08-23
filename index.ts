"use strict";
//import request from 'request';
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import { queueSong } from "./spotify";
import { replyTextMessage } from "./whatsapp";
import { ErrorMessages } from "./constants";
import { handleMusicSearchViaWhatsappMessage, handleQueueSong } from "./core";
import { APIParams } from "./types";

dotenv.config();
const app = express().use(bodyParser.json());

let appState = {
  accessToken: "",
  refreshToken: "",
  expiresIn: 0,
};

// Sets server port and logs message on success

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

app.get("/", (req, res) => {
  res.send("hey");
});

app.post("/webhook", async (req, res) => {
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      console.log(JSON.stringify(req.body.entry, null, 2));
      const phoneNumberId =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      const toPhoneNumber = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      const message = req.body.entry[0].changes[0].value.messages[0];
      const messageType = message?.type;
      const messageBody = message?.text?.body;
      const whatsappToken = process.env.WHATSAPP_TOKEN as string;
      
      let trackId: string = messageBody.match(/track\/(\w+)/)?.[1];

      const apiParams: APIParams = {
        whatsappToken,
        spotifyToken: appState.accessToken,
        phoneNumberId,
        toPhoneNumber,
      }

      if (!apiParams.spotifyToken) {
        await replyTextMessage(
          apiParams,
          ErrorMessages.NOT_READY
        );
        return res.sendStatus(204);
      } else {
        if (messageType === 'interactive' || trackId) {
          trackId = message?.interactive.button_reply.id;
          await handleQueueSong(apiParams, trackId)
        } else {
          await handleMusicSearchViaWhatsappMessage(apiParams, messageBody);
        }
      }
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

const redirect_uri = `${process.env.HOST}/callback`;

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
  };

  res.send("success " + JSON.stringify(authResponse.data, null, 2));
});

app.get("/queue", async (req, res) => {
  await queueSong(appState.accessToken, req.query.trackId as string);
  res.send("DONE!");
});

// app.get("/search", async (req, res) => {
//   const search = await searchTracks(appState.accessToken, req.query.searchString as string);
//   console.log(JSON.stringify(search.data.tracks.items, null, 2));
//   res.json(search.data.tracks.items);
// })
