const session = {
    createIfNotExist: `
    CREATE TABLE IF NOT EXISTS session(
        m_sessionUID,
        m_frameIdentifier,
        m_weather,
        m_trackTemperature,
        m_airTemperature,
        m_totalLaps,
        m_trackLength,
        m_sessionType,
        m_trackId,
        m_formula,
        m_sessionTimeLeft,
        m_sessionDuration,
        m_pitSpeedLimit,
        m_sliProNativeSupport,
        m_numMarshalZones,
        m_safetyCarStatus,
        m_networkGame
    );`,
    dump: `
    SELECT * FROM session;
    `,
    insert: `
    INSERT INTO session (
        m_sessionUID,
        m_frameIdentifier,
        m_weather,
        m_trackTemperature,
        m_airTemperature,
        m_totalLaps,
        m_trackLength,
        m_sessionType,
        m_trackId,
        m_formula,
        m_sessionTimeLeft,
        m_sessionDuration,
        m_pitSpeedLimit,
        m_sliProNativeSupport,
        m_numMarshalZones,
        m_safetyCarStatus,
        m_networkGame
    ) VALUES (
        @m_sessionUID,
        @m_frameIdentifier,
        @m_weather,
        @m_trackTemperature,
        @m_airTemperature,
        @m_totalLaps,
        @m_trackLength,
        @m_sessionType,
        @m_trackId,
        @m_formula,
        @m_sessionTimeLeft,
        @m_sessionDuration,
        @m_pitSpeedLimit,
        @m_sliProNativeSupport,
        @m_numMarshalZones,
        @m_safetyCarStatus,
        @m_networkGame
    );
    `,
    getAvailableSessions: `
    SELECT 
        m_sessionUID,
        m_sessionType,
        m_trackId,
        m_weather,
        m_trackLength
    FROM session
    GROUP BY m_sessionUID;
    `,
    getSession: `
    SELECT 
        m_sessionUID,
        m_sessionType,
        m_trackId,
        m_weather,
        m_trackLength
    FROM session
    WHERE m_sessionUID = @m_sessionUID
    ORDER BY m_frameIdentifier ASC
    LIMIT 1;
    `
}

const lapData = {
    createIfNotExist: `
    CREATE TABLE IF NOT EXISTS lapData(
        m_sessionUID,
        m_frameIdentifier,
        m_driverIndex,
        m_lastLapTime,
        m_currentLapTime,
        m_sector1TimeInMS,
        m_sector2TimeInMS,
        m_bestLapTime,
        m_bestLapNum,
        m_bestLapSector1TimeInMS,
        m_bestLapSector2TimeInMS,
        m_bestLapSector3TimeInMS,
        m_bestOverallSector1TimeInMS,
        m_bestOverallSector1LapNum,
        m_bestOverallSector2TimeInMS,
        m_bestOverallSector2LapNum,
        m_bestOverallSector3TimeInMS,
        m_bestOverallSector3LapNum,
        m_lapDistance,
        m_totalDistance,
        m_safetyCarDelta,
        m_carPosition,
        m_currentLapNum,
        m_pitStatus,
        m_sector,
        m_currentLapInvalid,
        m_penalties,
        m_gridPosition,
        m_driverStatus,
        m_resultStatus
    );`,
    dump: `
    SELECT * FROM lapData;
    `,
    insert: `
    INSERT INTO lapData (
        m_sessionUID,
        m_frameIdentifier,
        m_driverIndex,
        m_lastLapTime,
        m_currentLapTime,
        m_sector1TimeInMS,
        m_sector2TimeInMS,
        m_bestLapTime,
        m_bestLapNum,
        m_bestLapSector1TimeInMS,
        m_bestLapSector2TimeInMS,
        m_bestLapSector3TimeInMS,
        m_bestOverallSector1TimeInMS,
        m_bestOverallSector1LapNum,
        m_bestOverallSector2TimeInMS,
        m_bestOverallSector2LapNum,
        m_bestOverallSector3TimeInMS,
        m_bestOverallSector3LapNum,
        m_lapDistance,
        m_totalDistance,
        m_safetyCarDelta,
        m_carPosition,
        m_currentLapNum,
        m_pitStatus,
        m_sector,
        m_currentLapInvalid,
        m_penalties,
        m_gridPosition,
        m_driverStatus,
        m_resultStatus
    ) values (
        @m_sessionUID,
        @m_frameIdentifier,
        @m_driverIndex,
        @m_lastLapTime,
        @m_currentLapTime,
        @m_sector1TimeInMS,
        @m_sector2TimeInMS,
        @m_bestLapTime,
        @m_bestLapNum,
        @m_bestLapSector1TimeInMS,
        @m_bestLapSector2TimeInMS,
        @m_bestLapSector3TimeInMS,
        @m_bestOverallSector1TimeInMS,
        @m_bestOverallSector1LapNum,
        @m_bestOverallSector2TimeInMS,
        @m_bestOverallSector2LapNum,
        @m_bestOverallSector3TimeInMS,
        @m_bestOverallSector3LapNum,
        @m_lapDistance,
        @m_totalDistance,
        @m_safetyCarDelta,
        @m_carPosition,
        @m_currentLapNum,
        @m_pitStatus,
        @m_sector,
        @m_currentLapInvalid,
        @m_penalties,
        @m_gridPosition,
        @m_driverStatus,
        @m_resultStatus
    )
    `,
    getLapsForDriver: `
    SELECT lapData.m_currentLapNum FROM lapData
    WHERE lapData.m_sessionUID = @m_sessionUID
    AND lapData.m_driverIndex = @m_driverIndex
    AND  lapData.m_currentLapNum > 0
    GROUP BY lapData.m_currentLapNum
    `,
    getFramesForLap: `
    SELECT min(m_frameIdentifier) as start, max(m_frameIdentifier) as end FROM lapData
    WHERE lapData.m_sessionUID = @m_sessionUID
    AND lapData.m_driverIndex = @m_driverIndex
    AND lapData.m_currentLapNum = @m_currentLapNum
    AND m_lapDistance > 0
    `
}

const carTelemetry = {
    createIfNotExist: `
    CREATE TABLE IF NOT EXISTS carTelemetry(
        m_sessionUID,
        m_frameIdentifier,
        m_driverIndex,
        m_speed,
        m_throttle,
        m_steer,
        m_brake,
        m_clutch,
        m_gear,
        m_engineRPM,
        m_drs,
        m_revLightsPercent,
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
        m_engineTemperature,
        m_tyresPressureRL,
        m_tyresPressureRR,
        m_tyresPressureFL,
        m_tyresPressureFR,
        m_surfaceTypeRL,
        m_surfaceTypeRR,
        m_surfaceTypeFL,
        m_surfaceTypeFR
    );`,
    dump: `
    SELECT * FROM carTelemetry;
    `,
    insert: `
    INSERT INTO carTelemetry (
        m_sessionUID,
        m_frameIdentifier,
        m_driverIndex,
        m_speed,
        m_throttle,
        m_steer,
        m_brake,
        m_clutch,
        m_gear,
        m_engineRPM,
        m_drs,
        m_revLightsPercent,
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
        m_engineTemperature,
        m_tyresPressureRL,
        m_tyresPressureRR,
        m_tyresPressureFL,
        m_tyresPressureFR,
        m_surfaceTypeRL,
        m_surfaceTypeRR,
        m_surfaceTypeFL,
        m_surfaceTypeFR
    ) VALUES (
        @m_sessionUID,
        @m_frameIdentifier,
        @m_driverIndex,
        @m_speed,
        @m_throttle,
        @m_steer,
        @m_brake,
        @m_clutch,
        @m_gear,
        @m_engineRPM,
        @m_drs,
        @m_revLightsPercent,
        @m_brakesTemperatureRL,
        @m_brakesTemperatureRR,
        @m_brakesTemperatureFL,
        @m_brakesTemperatureFR,
        @m_tyresSurfaceTemperatureRL,
        @m_tyresSurfaceTemperatureRR,
        @m_tyresSurfaceTemperatureFL,
        @m_tyresSurfaceTemperatureFR,
        @m_tyresInnerTemperatureRL,
        @m_tyresInnerTemperatureRR,
        @m_tyresInnerTemperatureFL,
        @m_tyresInnerTemperatureFR,
        @m_engineTemperature,
        @m_tyresPressureRL,
        @m_tyresPressureRR,
        @m_tyresPressureFL,
        @m_tyresPressureFR,
        @m_surfaceTypeRL,
        @m_surfaceTypeRR,
        @m_surfaceTypeFL,
        @m_surfaceTypeFR
    )
    `,
    telemetryForLap: `
    SELECT 
        lapData.m_frameIdentifier,
        m_currentLapTime,
        m_sector1TimeInMS,
        m_sector2TimeInMS,
        m_lapDistance,
        m_carPosition,
        m_currentLapNum,
        m_pitStatus,
        m_sector,
        m_currentLapInvalid,
        m_penalties,
        m_gridPosition,
        m_driverStatus,
        m_resultStatus,
        m_speed,
        m_throttle,
        m_steer,
        m_brake,
        m_gear,
        m_drs
    FROM lapData
    JOIN carTelemetry 
        ON lapData.m_frameIdentifier = carTelemetry.m_frameIdentifier
    WHERE carTelemetry.m_sessionUID = @m_sessionUID
        AND m_currentLapNum = @m_currentLapNum
        AND carTelemetry.m_driverIndex = @m_driverIndex
        AND m_lapDistance > 0
    ORDER BY lapData.m_frameIdentifier ASC;
    `
}

const participants = {
    createIfNotExist: `
    CREATE TABLE IF NOT EXISTS participants(
        m_sessionUID,
        m_frameIdentifier,
        m_driverIndex,
        m_aiControlled,
        m_driverId,
        m_teamId,
        m_raceNumber,
        m_nationality,
        m_name,
        m_yourTelemetry
    );
    `,
    dump: `
    SELECT * FROM participants;
    `,
    insert: `
    INSERT INTO participants (
        m_sessionUID,
        m_frameIdentifier,
        m_driverIndex,
        m_aiControlled,
        m_driverId,
        m_teamId,
        m_raceNumber,
        m_nationality,
        m_name,
        m_yourTelemetry
    ) VALUES (
        @m_sessionUID,
        @m_frameIdentifier,
        @m_driverIndex,
        @m_aiControlled,
        @m_driverId,
        @m_teamId,
        @m_raceNumber,
        @m_nationality,
        @m_name,
        @m_yourTelemetry
    );`,
    getDriversForSession:`
    SELECT 
        m_driverIndex,
        m_aiControlled,
        m_driverId,
        m_teamId,
        m_raceNumber,
        m_nationality,
        m_name
    FROM participants
    WHERE m_sessionUID = @m_sessionUID
    AND m_name != ''
    GROUP BY m_driverIndex
    ORDER BY m_frameIdentifier ASC
    `,
    getDriver: `
    SELECT 
        m_driverIndex,
        m_aiControlled,
        m_driverId,
        m_teamId,
        m_raceNumber,
        m_nationality,
        m_name
    FROM participants
    WHERE m_sessionUID = @m_sessionUID
    AND m_driverIndex = @m_driverIndex
    LIMIT 1;
    `
}

module.exports = {
    session,
    lapData,
    carTelemetry,
    participants,
}