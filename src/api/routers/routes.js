const { Router } = require('express')
const everpolate = require('everpolate')
const {carTelemetry, session, participants, lapData} = require('../../db/db')

const router = new Router()

const getInterpolatedLapTime = lap => {
    const input = lap.map(lapData => {
        return { x: lapData.m_lapDistance, y: lapData.m_currentLapTime }
    })
    input.unshift({ x: 0, y: 0 })

    const result = []

    const trackLength = Math.trunc(input[input.length - 1].x)
    for (let distanceIndex = 0; distanceIndex < trackLength; distanceIndex += 10) {
        let current = input.shift()
        let next = input[0]
        while (next.x < distanceIndex) {
            current = input.shift()
            next = input[0]
        }

        const regression = everpolate.linearRegression([current.x, next.x], [current.y, next.y])
        regression.evaluate(distanceIndex)
        result.push({ x: distanceIndex, y: regression.evaluate(distanceIndex)[0] })
    }
    return result;
}

const prunePitEntry = telemetry => {
    return telemetry.filter((tData, index, allT) => {
        const previous = allT[index - 1]
        if (!previous){
            return true
        } else {
            return Math.trunc(tData.m_lapDistance) > Math.trunc(previous.m_lapDistance)
        }
    })
}

router.get('/sessions', (request, response) => {
    response.send(session.getAvailableSessions())
})

router.get('/sessions/:sessionId', (request, response) => {
    const sessionId = request.params.sessionId
    const sessionData = session.getSession(sessionId)
    const driversData = participants.getDriversForSession(sessionId)
    response.send({
        ...sessionData,
        drivers: driversData
    })
})

router.get('/sessions/:sessionId/drivers', (request, response) => {
    const sessionId = request.params.sessionId
    const driversData = participants.getDriversForSession(sessionId)

    const drivers = driversData.map(driver => {
        const lapDataData = lapData.getLapsForDriver(sessionId, driver.m_driverIndex).map(({m_currentLapNum}) => m_currentLapNum)
        return ({
            ...driver,
            lapData: lapDataData
        })
    })
    response.send(drivers)
})

router.get('/sessions/:sessionId/drivers/:driverIndex/laps/:lapNumber', (request, response) => {
    const {sessionId, driverIndex, lapNumber} = request.params
    const telemetry = prunePitEntry(carTelemetry.getLapForDriver(sessionId, driverIndex, lapNumber))
    response.send({
        sessionId, 
        driverIndex,
        lapNumber,
        telemetry,
        lapTime: getInterpolatedLapTime(telemetry)
    })
})

module.exports = router;