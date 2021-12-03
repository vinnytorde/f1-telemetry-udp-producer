require('./config')

const { F1TelemetryClient, constants } = require('f1-2020-client');
const kafkaEvents = require('./kafka-events')

let { PACKETS } = constants
let client = new F1TelemetryClient()
client.once(PACKETS.session, kafkaEvents.emitSession)
client.on(PACKETS.motion,kafkaEvents.emitMotion)
client.on(PACKETS.lapData,kafkaEvents.emitLapData)
client.on(PACKETS.event,kafkaEvents.emitEvent)
client.on(PACKETS.participants,kafkaEvents.emitParticipants)
client.on(PACKETS.carSetups,kafkaEvents.emitCarSetups)
client.on(PACKETS.carTelemetry,kafkaEvents.emitCarTelemetry)
client.on(PACKETS.carStatus,kafkaEvents.emitCarStatus)
client.on(PACKETS.finalClassification,kafkaEvents.emitFinalClassification)
client.on(PACKETS.lobbyInfo,kafkaEvents.emitLobbyInfo)

kafkaEvents.connect()
    .then(() => client.start())
