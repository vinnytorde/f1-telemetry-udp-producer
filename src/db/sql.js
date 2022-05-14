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
        m_teamName,
        m_raceNumber,
        m_nationality,
        m_name
    FROM participants
    JOIN teams ON teams.m_teamId = participants.m_teamId
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

const teams = {
    createIfNotExist: `
    CREATE TABLE IF NOT EXISTS teams (
        m_teamName,
        m_teamId PRIMARY KEY
    );`,
    dump: `SELECT * FROM teams`,
    seed: `
    INSERT OR IGNORE INTO teams (
        m_teamId,
        m_teamName
    ) VALUES
        (0, 'Mercedes'),
        (1, 'Ferrari'),
        (2, 'Red Bull Racing'),
        (3, 'Williams'),
        (4, 'Racing Point'),
        (5, 'Renault'),
        (6, 'Alpha Tauri'),
        (7, 'Haas'),
        (8, 'McLaren'),
        (9, 'Alfa Romeo'),
        (10, 'McLaren 1988'),
        (11, 'McLaren 1991'),
        (12, 'Williams 1992'),
        (13, 'Ferrari 1995'),
        (14, 'Williams 1996'),
        (15, 'McLaren 1998'),
        (16, 'Ferrari 2002'),
        (17, 'Ferrari 2004'),
        (18, 'Renault 2006'),
        (19, 'Ferrari 2007'),
        (20, 'McLaren 2008'),
        (21, 'Red Bull 2010'),
        (22, 'Ferrari 1976'),
        (23, 'ART Grand Prix'),
        (24, 'Campos Vexatec Racing'),
        (25, 'Carlin'),
        (26, 'Charouz Racing System'),
        (27, 'DAMS'),
        (28, 'Russian Time'),
        (29, 'MP Motorsport'),
        (30, 'Pertamina'),
        (31, 'McLaren 1990'),
        (32, 'Trident'),
        (33, 'BWT Arden'),
        (34, 'McLaren 1976'),
        (35, 'Lotus 1972'),
        (36, 'Ferrari 1979'),
        (37, 'McLaren 1982'),
        (38, 'Williams 2003'),
        (39, 'Brawn 2009'),
        (40, 'Lotus 1978'),
        (41, 'F1 Generic car'),
        (42, 'Art GP 19'),
        (43, 'Campos 19'),
        (44, 'Carlin 19'),
        (45, 'Sauber Junior Charouz 19'),
        (46, 'Dams 19'),
        (47, 'Uni-Virtuosi 19'),
        (48, 'MP Motorsport 19'),
        (49, 'Prema 19'),
        (50, 'Trident 19'),
        (51, 'Arden 19'),
        (53, 'Benetton 1994'),
        (54, 'Benetton 1995'),
        (55, 'Ferrari 2000'),
        (56, 'Jordan 1991'),
        (255, 'My Team');
    `
}

module.exports = {
    session,
    lapData,
    carTelemetry,
    participants,
    teams,
}




	

// 1 American
// 31 Greek
// 61 Panamanian
// 2 Argentinean
// 32 Guatemalan
// 62 Paraguayan
// 3 Australian
// 33 Honduran
// 63 Peruvian
// 4 Austrian
// 34 Hong Konger
// 64 Polish
// 5 Azerbaijani
// 35 Hungarian
// 65 Portuguese
// 6 Bahraini
// 36 Icelander
// 66 Qatari
// 7 Belgian
// 37 Indian
// 67 Romanian
// 8 Bolivian
// 38 Indonesian
// 68 Russian
// 9 Brazilian
// 39 Irish
// 69 Salvadoran
// 10 British
// 40 Israeli
// 70 Saudi
// 11 Bulgarian
// 41 Italian
// 71 Scottish
// 12 Cameroonian
// 42 Jamaican
// 72 Serbian
// 13 Canadian
// 43 Japanese
// 73 Singaporean
// 14 Chilean
// 44 Jordanian
// 74 Slovakian
// 15 Chinese
// 45 Kuwaiti
// 75 Slovenian
// 16 Colombian
// 46 Latvian
// 76 South Korean
// 17 Costa Rican
// 47 Lebanese
// 77 South African
// 18 Croatian 
// 48 Lithuanian
// 78 Spanish
// 19 Cypriot
// 49 Luxembourger
// 79 Swedish
// 20 Czech
// 50 Malaysian
// 80 Swiss
// 21 Danish
// 51 Maltese
// 81 Thai
// 22 Dutch
// 52 Mexican
// 82 Turkish
// 23 Ecuadorian
// 53 Monegasque
// 83 Uruguayan
// 24 English
// 54 New Zealander
// 84 Ukrainian
// 25 Emirian
// 55 Nicaraguan
// 85 Venezuelan
// 26 Estonian
// 56 North Korean
// 86 Welsh 
// 27 Finnish
// 57 Northern Irish 
// 87 Barbadian
// 28 French
// 58 Norwegian
// 88 Vietnamese
// 29 German
// 59 Omani
// 30 Ghanaian
// 60 Pakistani