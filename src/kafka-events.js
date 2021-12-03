const kafka = require('./kafka')
const topics = require('./topics')

let producer = kafka.producer()

let emit = (topic, key, value) => producer.send({
  topic: topic,
  messages: [{ key, value }]
})

module.exports = {
  connect() {
    return producer.connect()
  },
  emitSession(session) {
    return emit(topics.session, session.m_header.m_sessionUID.toString(), JSON.stringify(session))
  },
    emitMotion(motion) {
    return emit(topics.motion, null, JSON.stringify(motion))
  },
    emitLapData(lapData) {
    return emit(topics.lapData, null, JSON.stringify(lapData))
  },
    emitEvent(event) {
    return emit(topics.event, null, JSON.stringify(event))
  },
    emitParticipants(participants) {
    return emit(topics.participants, null, JSON.stringify(participants))
  },
    emitCarSetups(carSetups) {
    return emit(topics.carSetups, null, JSON.stringify(carSetups))
  },
    emitCarTelemetry(carTelemetry) {
    return emit(topics.carTelemetry, null, JSON.stringify(carTelemetry))
  },
    emitCarStatus(carStatus) {
    return emit(topics.carStatus, null, JSON.stringify(carStatus))
  },
    emitFinalClassification(finalClassification) {
    return emit(topics.finalClassification, null, JSON.stringify(finalClassification))
  },
    emitLobbyInfo(lobbyInfo) {
    return emit(topics.lobbyInfo, null, JSON.stringify(lobbyInfo))
  }
}