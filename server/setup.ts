"use strict";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import WebSocket from "ws";
import { TimeDefaults } from "./constants";
import { store } from "./store";
import { updateAppStatus } from "./core";

dotenv.config();
console.log(path.join(__dirname, "build"));
const app = express().use(bodyParser.json());
const server = app.listen(process.env.PORT || 1337, () =>
  console.log("webhook is listening ", process.env.PORT)
);

const webSocketsServer = new WebSocket.Server({ server });
webSocketsServer.on("connection", (websocketClient) => {
  console.log("New client connected");
  websocketClient.send(JSON.stringify(store.status, null, 2));
});

function broadcastData(data: unknown) {
  webSocketsServer.clients.forEach((webSocketClient) => {
    webSocketClient.send(JSON.stringify(data, null, 2));
  });
}

setInterval(() => {
  if (store.auth.accessToken) {
    updateAppStatus();
  }
}, TimeDefaults.INTERNAL_UPDATE_THRESHOLD);

export { app, webSocketsServer, broadcastData };
