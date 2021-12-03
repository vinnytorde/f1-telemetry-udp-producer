# F1 telemetry UDP client

This will connect to the UDP server in F12020,
listen for messages emitted by the game,
and emit them to a kafka topic.

To run this project, the following .env config is required:

```
KAFKA_BOOTSTRAP_SERVER=localhost:29092
```
