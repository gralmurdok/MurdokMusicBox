import { static as expressStatic } from "express";
import axios from "axios";
import { EVENT_SONGS, Routes } from "./constants";
import { APIParams } from "./types";
import path from "path";
import { store } from "./store";
import { app } from "./setup";
import { gatherDataFromMessage } from "./handlers/incomingMessageHandler";
import { handleOperationByMessageType } from "./handlers/determineOperationHandler";
import { handleExecuteAction } from "./handlers/handleExecuteAction";
import { normalizeOwnerPhone } from "./utils";
import { replyMessageBackToUser, replyTextMessage } from "./messaging/whatsapp";
import {
  interactiveListMessage,
  interactiveReplyButtonsMessage,
  suggestionConfirmationTemplate,
} from "./messaging/whatsappMessageBuilder";
import { persistGuest, persistSuggestion, retrieveGuest } from "./database/databaseHandler";

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

app.post("/update-party-owner", async (req, res) => {
  await handleExecuteAction(
    async () => {
      store.config.owner = normalizeOwnerPhone(req.body.owner);
      await replyMessageBackToUser(
        interactiveListMessage(
          store.config.owner,
          "Host de evento!",
          `Estas registrado como host de evento crossroads, por favor escribe el nombre de la cancion que deseas reproducir o elige una de la lista.`,
          EVENT_SONGS
        )
      );
      res.sendStatus(200);
    },
    () => {
      res.sendStatus(500);
    }
  );
});

app.post("/approve-party", async (req, res) => {
  await handleExecuteAction(
    async () => {
      await replyMessageBackToUser(
        interactiveReplyButtonsMessage(
          store.config.owner,
          "Presiona el siguiente boton para iniciar tu evento",
          store.config.specialSong.imgUrl
        )
      );
    },
    () => {}
  );
  console.log("approved");
});

app.post("/suggest", async (req, res) => {
  await handleExecuteAction(
    async () => {
      const normalizedPhone = normalizeOwnerPhone(req.body.phone);
      await persistSuggestion(
        req.body.name,
        normalizedPhone,
        req.body.suggestion
      );
      if (req.body.phone) {
        await replyMessageBackToUser(
          suggestionConfirmationTemplate(normalizedPhone)
        );
      }
    },
    () => {}
  );
  res.sendStatus(200);
});

app.post("/register_guest", async (req, res) => {
  console.log(req.body);
  await handleExecuteAction(
    async () => {
      await persistGuest(
        req.body.name,
        req.body.phone,
        req.body.level
      );
    },
    () => {}
  );
  res.sendStatus(200);
});

app.get("/wedding_guest/:id", async (req, res) => {
  let result = null;
  await handleExecuteAction(
    async () => {
      result = await retrieveGuest(
        req.params.id
      );
    },
    () => {}
  );
  res.json(result);
});

app.post("/webhook", async (req, res) => {
  console.log(JSON.stringify(req.body));

  await handleExecuteAction(
    async () => {
      const messageData = gatherDataFromMessage(req.body);
      console.log(messageData);
      const apiParams: APIParams = {
        spotifyToken: store.auth.accessToken,
        ...messageData,
      };

      await handleOperationByMessageType(apiParams);
    },
    () => {}
  );

  res.sendStatus(200);
});

app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

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
