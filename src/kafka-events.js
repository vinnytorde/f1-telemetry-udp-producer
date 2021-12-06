const kafka = require('./kafka')
const topics = require('./topics')

let producer = kafka.producer()

let emit = (topic, key, value) => producer.send({
  topic,
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
    return emit(topics.motion, motion.m_header.m_sessionUID.toString(), JSON.stringify(motion))
  },
  emitLapData(lapData) {
    return emit(topics.lapData, lapData.m_header.m_sessionUID.toString(), JSON.stringify(lapData))
  },
  emitEvent(event) {
    return emit(topics.event, event.m_header.m_sessionUID.toString(), JSON.stringify(event))
  },
  emitParticipants(participants) {
    return emit(topics.participants, participants.m_header.m_sessionUID.toString(), JSON.stringify(participants))
  },
  emitCarSetups(carSetups) {
    return emit(topics.carSetups, carSetups.m_header.m_sessionUID.toString(), JSON.stringify(carSetups))
  },
  emitCarTelemetry(carTelemetry) {
    return emit(topics.carTelemetry, carTelemetry.m_header.m_sessionUID.toString(), JSON.stringify(carTelemetry))
  },
  emitCarStatus(carStatus) {
    return emit(topics.carStatus, carStatus.m_header.m_sessionUID.toString(), JSON.stringify(carStatus))
  },
  emitFinalClassification(finalClassification) {
    return emit(topics.finalClassification, finalClassification.m_header.m_sessionUID.toString(), JSON.stringify(finalClassification))
  },
  emitLobbyInfo(lobbyInfo) {
    return emit(topics.lobbyInfo, lobbyInfo.m_header.m_sessionUID.toString(), JSON.stringify(lobbyInfo))
  }
}