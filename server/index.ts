import { static as expressStatic } from "express";
import axios from "axios";
import { Routes } from "./constants";
import { APIParams } from "./types";
import path from "path";
import { store } from "./store";
import { app } from "./setup";
import { gatherDataFromMessage } from "./handlers/incomingMessageHandler";
import { handleOperationByMessageType } from "./handlers/determineOperationHandler";

app.get(["/", "index.html"], (req, res) => {
  res.redirect("/menu");
});

app.get("/qr-code", (req, res) => {
  res.redirect(
    `https://wa.me/593985467110?text=${store.status.currentSong.name} - ${store.status.currentSong.artist}`
  );
});

app.get("/set-wifi-key", (req, res) => {
  const wifiKey = req.query.key;
  if (wifiKey) {
    store.status = {
      ...store.status,
      wifiKey: wifiKey as string,
    };
  }
  res.json(store.status);
});

app.get(Routes.APP_STATUS, (req, res) => {
  res.json(store.status);
});

app.get("/slider-info", (req, res) => {
  res.json(store.visualShow);
});

app.post("/webhook", async (req, res) => {
  try {
    const messageData = gatherDataFromMessage(req.body);
    const apiParams: APIParams = {
      whatsappToken: process.env.WHATSAPP_TOKEN as string,
      spotifyToken: store.auth.accessToken,
      ...messageData
    };

    await handleOperationByMessageType(apiParams);
    res.sendStatus(200);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }

  // if (req.body.object) {
  //   if (
  //     req.body.entry &&
  //     req.body.entry[0].changes &&
  //     req.body.entry[0].changes[0] &&
  //     req.body.entry[0].changes[0].value.messages &&
  //     req.body.entry[0].changes[0].value.messages[0]
  //   ) {
  //     console.log(JSON.stringify(req.body.entry, null, 2));
  //     const phoneNumberId =
  //       req.body.entry[0].changes[0].value.metadata.phone_number_id;

  //     const contact = req.body.entry[0].changes[0].value.contacts[0];
  //     const message = req.body.entry[0].changes[0].value.messages[0];
  //     const messageType = message?.type;
  //     const messageBody = message?.text?.body;
  //     const whatsappToken = process.env.WHATSAPP_TOKEN as string;
  //     const toPhoneNumber = message.from; // extract the phone number from the webhook payload
  //     const requesterName = contact.profile.name;

  //     let trackId: string = messageBody?.match(/track\/(\w+)/)?.[1];

  //     const apiParams: APIParams = {
  //       messageBody,
  //       messageType,
  //       whatsappToken,
  //       spotifyToken: store.auth.accessToken,
  //       phoneNumberId,
  //       toPhoneNumber,
  //       requesterName,
  //     };

  //     // try {
  //     //   const mediaURL = await fetchMediaURL(apiParams, message?.image?.id);
  //     //   const media = await fetchMediaObject(apiParams, mediaURL.data.url);
  //     //   imageData =
  //     //     "data:" +
  //     //     media.headers["content-type"] +
  //     //     ";base64," +
  //     //     Buffer.from(media.data).toString("base64");
  //     //   console.log(imageData);
  //     // } catch (err) {
  //     //   console.log(err);
  //     // }

  //     const operation = determineOperation(apiParams);

  //     switch (operation) {
  //       case "register":
  //         await registerUser(apiParams);
  //         break;
  //       case "receiptSongs":
  //         if (!apiParams.spotifyToken) {
  //           await replyTextMessage(apiParams, ErrorMessages.NOT_READY);
  //           return res.sendStatus(204);
  //         } else {
  //           if (messageType === "interactive" || trackId) {
  //             if (message?.interactive?.type) {
  //               trackId = message?.interactive[message?.interactive.type].id;
  //             }
  //             await handleQueueSong(apiParams, trackId);
  //           } else {
  //             await handleMusicSearchViaWhatsappMessage(apiParams);
  //           }
  //         }
  //         break;
  //       case "noAuth":
  //         break;
  //     }
  //   }
  //   res.sendStatus(200);
  // } else {
  //   // Return a '404 Not Found' if event is not from a WhatsApp API
  //   res.sendStatus(404);
  // }
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
  const scope = [
    "user-modify-playback-state",
    "user-read-private",
    "user-read-currently-playing",
  ];
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
    expiresAt: Date.now() + authResponse.data.expires_in * 1000,
  };
  store.updateAuthStatus();

  res.redirect("/player");
});

app.use(expressStatic(path.join(__dirname, "build")));

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "menu.pdf"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
