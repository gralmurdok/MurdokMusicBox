"use strict";
//import request from 'request';
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import { replyTextMessage } from "./whatsapp";
import { ErrorMessages, Routes } from "./constants";
import { authorizeUser, determineOperation, getCurrentUser, handleMusicSearchViaWhatsappMessage, handleQueueSong, registerUser, updateAppStatus } from "./core";
import { APIParams } from "./types";
import path from "path";
import { store } from "./store";

dotenv.config();
console.log(path.join(__dirname, 'build'));
const app = express().use(bodyParser.json()).use(express.static(path.join(__dirname, 'build')));

// Sets server port and logs message on success

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening ", process.env.PORT));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get(Routes.APP_STATUS, (req, res) => {
  if (store.auth.accessToken) {
    updateAppStatus();
  }
  res.json(store.status);
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
      
      const contact = req.body.entry[0].changes[0].value.contacts[0];
      const message = req.body.entry[0].changes[0].value.messages[0];
      const messageType = message?.type;
      const messageBody = message?.text?.body;
      const whatsappToken = process.env.WHATSAPP_TOKEN as string;
      const toPhoneNumber = message.from; // extract the phone number from the webhook payload
      const requesterName = contact.profile.name;
      
      let trackId: string = messageBody?.match(/track\/(\w+)/)?.[1];

      const apiParams: APIParams = {
        messageBody,
        whatsappToken,
        spotifyToken: store.auth.accessToken,
        phoneNumberId,
        toPhoneNumber,
        requesterName,
      }

      const operation = determineOperation(apiParams);

      switch(operation) {
        case 'register':
          registerUser(apiParams);
          break;
        case 'authorizeUser':
          authorizeUser(apiParams);
          break;
        case 'receiptSongs':
          if (!apiParams.spotifyToken) {
            await replyTextMessage(
              apiParams,
              ErrorMessages.NOT_READY
            );
            return res.sendStatus(204);
          } else {
            if (messageType === 'interactive' || trackId) {
              if (message?.interactive?.type) {
                trackId = message?.interactive[message?.interactive.type].id;
              }
              await handleQueueSong(apiParams, trackId)
            } else {
              await handleMusicSearchViaWhatsappMessage(apiParams);
            }
          }
      }

      console.log(operation, getCurrentUser(apiParams))
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

app.get("/spotify-login", (req, res) => {
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

  store.auth = {
    accessToken: authResponse.data.access_token,
    refreshToken: authResponse.data.refresh_token,
    expiresIn: authResponse.data.expires_in,
  };

  res.redirect('/');
});