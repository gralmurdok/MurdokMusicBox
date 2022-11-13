"use strict";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import WebSocket from "ws";
import { WebsocketsActions, TimeDefaults } from "./constants";
import { store } from "./store";
import { updateAppStatus } from "./handlers/updateAppStatusHandler";

dotenv.config();
console.log(path.join(__dirname, "build"));
const app = express().use(bodyParser.json());
const server = app.listen(process.env.PORT || 1337, () =>
  console.log("webhook is listening ", process.env.PORT)
);

const webSocketsServer = new WebSocket.Server({ server });
webSocketsServer.on("connection", (websocketClient) => {
  console.log("New client connected");
  websocketClient.send(
    JSON.stringify(
      {
        type: store.mode,
        appData: store.status,
      },
      null,
      2
    )
  );
});

function broadcastData(type: WebsocketsActions, data: unknown) {
  store.mode = type;
  webSocketsServer.clients.forEach((webSocketClient) => {
    webSocketClient.send(
      JSON.stringify(
        {
          type,
          appData: data,
        },
        null,
        2
      )
    );
  });
}

setInterval(() => {
  if (store.auth.accessToken && store.mode === WebsocketsActions.PLAYER) {
    updateAppStatus();
  }
}, TimeDefaults.INTERNAL_UPDATE_THRESHOLD);

export { app, webSocketsServer, broadcastData };
