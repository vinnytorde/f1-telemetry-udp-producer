require('./config')

const { F1TelemetryClient, constants } = require('f1-telemetry-client');
const { Server } = require("socket.io");
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {} });
const { PACKETS } = constants
const client = new F1TelemetryClient()

const emit = topic => packet => io.emit(topic, packet)

Object.values(PACKETS).map(packet => client.on(packet, emit(packet)))

server.listen(8080, () => client.start())