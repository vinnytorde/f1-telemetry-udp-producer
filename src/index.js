require('./config')
const { F1TelemetryClient, constants } = require('f1-telemetry-client');
const { Server } = require("socket.io");
const Express = require('express');
const Http = require('http');
const cors = require('cors')
const database = require('./db/db')
const router = require('./api/routers/routes')

database.initialize()

const app = Express();
app.use(cors())
app.use(router)
const httpServer = Http.createServer(app);
const io = new Server(httpServer, { cors: {} });
const client = new F1TelemetryClient()

// const fileSystem = require('fs')
// const saveFile = topic => packet => {
//     fileSystem.writeFileSync(`./src//samples/${topic}.json`, JSON.stringify(packet), { flag: 'w' })
// }
    
// const database = require('./db/db')
// const spa = require('./samples/sessions/spa_haas_hotlap.json')
// const bahrain = require('./samples/sessions/bahrain_aphatauri_3laps.json')

// console.log('migrating spa')
// console.log(new Date())

// console.log('migrating session')
// console.log(new Date())
// spa.session.map(s => database.save('session', s))
// console.log('migrating session - done')
// console.log(new Date())

// console.log('migrating lapData')
// console.log(new Date())
// spa.lapData.map(s => database.save('lapData', s))
// console.log('migrating lapData - done')
// console.log(new Date())

// console.log('migrating carTelemetry')
// console.log(new Date())
// spa.carTelemetry.map(s => database.save('carTelemetry', s))
// console.log('migrating carTelemetry - done')
// console.log(new Date())

// console.log('migrating participants')
// console.log(new Date())
// spa.participants.map(s => database.save('participants', s))
// console.log('migrating participants - done')
// console.log(new Date())

// console.log('migrating spa - done')
// console.log(new Date()) 

// console.log('migrating bahrain')
// console.log(new Date())

// console.log('migrating session')
// console.log(new Date())
// bahrain.session.map(s => database.save('session', s))
// console.log('migrating session - done')
// console.log(new Date())

// console.log('migrating lapData')
// console.log(new Date())
// bahrain.lapData.map(s => database.save('lapData', s))
// console.log('migrating lapData - done')
// console.log(new Date())

// console.log('migrating carTelemetry')
// console.log(new Date())
// bahrain.carTelemetry.map(s => database.save('carTelemetry', s))
// console.log('migrating carTelemetry - done')
// console.log(new Date())

// console.log('migrating participants')
// console.log(new Date())
// bahrain.participants.map(s => database.save('participants', s))
// console.log('migrating participants - done')
// console.log(new Date())

// console.log('migrating bahrain - done')
// console.log(new Date())
// // const emit = topic => packet => io.emit(topic, packet)

const saveToDatabase = topic => packet => database.save(topic, packet)

Object.values(constants.PACKETS).map(topic => client.on(topic, saveToDatabase(topic)))
httpServer.listen(8080, () => {
    // client.start()
})


