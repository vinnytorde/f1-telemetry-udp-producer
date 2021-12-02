import { F1TelemetryClient, constants } from 'f1-2020-client';

const { PACKETS } = constants
const client = new F1TelemetryClient()
client.on(PACKETS.session, () => console.log(PACKETS.session))
client.on(PACKETS.motion, () => console.log(PACKETS.motion))
client.on(PACKETS.lapData, () => console.log(PACKETS.lapData))
client.on(PACKETS.event, () => console.log(PACKETS.event))
client.on(PACKETS.participants, () => console.log(PACKETS.participants))
client.on(PACKETS.carSetups, () => console.log(PACKETS.carSetups))
client.on(PACKETS.carTelemetry, () => console.log(PACKETS.carTelemetry))
client.on(PACKETS.carStatus, () => console.log(PACKETS.carStatus))
client.on(PACKETS.finalClassification, () => console.log(PACKETS.finalClassification))
client.on(PACKETS.lobbyInfo, () => console.log(PACKETS.lobbyInfo))
client.start();