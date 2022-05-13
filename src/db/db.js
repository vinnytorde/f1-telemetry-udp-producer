const Sql = require('./sql')
const Database = require('better-sqlite3')
const match = require('nodemon/lib/monitor/match')

const database = new Database('telemetry.db')

const getArgsFromSql = (sql, item) => {
    return Object.fromEntries(Array.from(sql.matchAll("\@(\\w*),?")).map(([arg, match]) => ([match, item[match]])))
}

const insertWithArgs = sql => item => {
    const args = getArgsFromSql(sql, item)
    return database.prepare(sql).run(args)
}

const session = {
    createIfNotExist: () => database.exec(Sql.session.createIfNotExist),
    dump: () => database.prepare(Sql.session.dump).all(),
    insert: insertWithArgs(Sql.session.insert),
    getAvailableSessions: () => database.prepare(Sql.session.getAvailableSessions).all(),
    getSession: m_sessionUID => database.prepare(Sql.session.getSession).get({ m_sessionUID })
}

const lapData = {
    createIfNotExist: () => database.exec(Sql.lapData.createIfNotExist),
    dump: () => database.prepare(Sql.lapData.dump).all(),
    insert: insertWithArgs(Sql.lapData.insert),
    getLapsForDriver: (m_sessionUID, m_driverIndex) => database.prepare(Sql.lapData.getLapsForDriver).all({m_sessionUID, m_driverIndex: Number(m_driverIndex)}),
}

const carTelemetry = {
    createIfNotExist: () => database.exec(Sql.carTelemetry.createIfNotExist),
    dump: () => database.prepare(Sql.carTelemetry.dump).all(),
    insert: item => database.prepare(Sql.carTelemetry.insert).run(item),
    getLapForDriver: (m_sessionUID, m_driverIndex, m_currentLapNum) =>  database.prepare(Sql.carTelemetry.telemetryForLap).all({m_sessionUID, m_driverIndex: Number(m_driverIndex), m_currentLapNum: Number(m_currentLapNum)}),
}

const participants = {
    createIfNotExist: () => database.exec(Sql.participants.createIfNotExist),
    dump: () => database.prepare(Sql.participants.dump).all(),
    insert: item => database.prepare(Sql.participants.insert).run(item),
    getDriversForSession: m_sessionUID => database.prepare(Sql.participants.getDriversForSession).all({ m_sessionUID }),
    getDriver: (m_sessionUID, m_driverIndex) => database.prepare(Sql.participants.getDriver).get({ m_sessionUID, m_driverIndex: Number(m_driverIndex) }),
}

const setHeaderData = packet => {
    const {
        m_header,
        ...restOfPacket
    } = packet
    const {
        m_sessionUID,
        m_frameIdentifier
    } = m_header
    return {
        m_sessionUID: m_sessionUID.toString(),
        m_frameIdentifier,
        ...restOfPacket,
    }
}

const handleSession = packet => {
    session.insert(setHeaderData(packet))
}

const handleLapData = packet => {
    packet.m_lapData.forEach((lData, m_driverIndex) => lapData.insert(setHeaderData({ ...lData, m_header: packet.m_header, m_driverIndex })))
}

const handleCarTelemetry = packet => {
    packet.m_carTelemetryData.forEach((tData, m_driverIndex) => {
        const {
            m_brakesTemperature,
            m_tyresSurfaceTemperature,
            m_tyresInnerTemperature,
            m_tyresPressure,
            m_surfaceType,
            ...telemetryData
        } = tData

        const [
            m_brakesTemperatureRL,
            m_brakesTemperatureRR,
            m_brakesTemperatureFL,
            m_brakesTemperatureFR,
        ] = m_brakesTemperature

        const [
            m_tyresSurfaceTemperatureRL,
            m_tyresSurfaceTemperatureRR,
            m_tyresSurfaceTemperatureFL,
            m_tyresSurfaceTemperatureFR,
        ] = m_tyresSurfaceTemperature

        const [
            m_tyresInnerTemperatureRL,
            m_tyresInnerTemperatureRR,
            m_tyresInnerTemperatureFL,
            m_tyresInnerTemperatureFR,
        ] = m_tyresInnerTemperature

        const [
            m_tyresPressureRL,
            m_tyresPressureRR,
            m_tyresPressureFL,
            m_tyresPressureFR,
        ] = m_tyresPressure

        const [
            m_surfaceTypeRL,
            m_surfaceTypeRR,
            m_surfaceTypeFL,
            m_surfaceTypeFR,
        ] = m_surfaceType


        const telemetry = setHeaderData({
            ...telemetryData,
            m_header: packet.m_header,
            m_driverIndex,
            m_brakesTemperatureRL,
            m_brakesTemperatureRR,
            m_brakesTemperatureFL,
            m_brakesTemperatureFR,
            m_tyresSurfaceTemperatureRL,
            m_tyresSurfaceTemperatureRR,
            m_tyresSurfaceTemperatureFL,
            m_tyresSurfaceTemperatureFR,
            m_tyresInnerTemperatureRL,
            m_tyresInnerTemperatureRR,
            m_tyresInnerTemperatureFL,
            m_tyresInnerTemperatureFR,
            m_tyresPressureRL,
            m_tyresPressureRR,
            m_tyresPressureFL,
            m_tyresPressureFR,
            m_surfaceTypeRL,
            m_surfaceTypeRR,
            m_surfaceTypeFL,
            m_surfaceTypeFR,
        })
        carTelemetry.insert(telemetry)
    })
}

const handleParticipants = packet => {
    packet.m_participants.forEach((pData, m_driverIndex) => {
        participants.insert(setHeaderData({
            ...pData,
            m_header: packet.m_header,
            m_driverIndex
        }))
    })
}

function save(topic, item) {
    switch (topic) {
        case 'session': return handleSession(item)
        case 'lapData': return handleLapData(item)
        case 'carTelemetry': return handleCarTelemetry(item)
        case 'participants': return handleParticipants(item)
        default: return
    }
}

function initialize() {
    session.createIfNotExist()
    lapData.createIfNotExist()
    carTelemetry.createIfNotExist()
    participants.createIfNotExist()
}

module.exports = {
    initialize,
    save,
    session,
    lapData,
    carTelemetry,
    participants,
}