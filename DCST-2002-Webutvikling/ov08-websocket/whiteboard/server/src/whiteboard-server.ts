import type http from 'http';
import type https from 'https';
import WebSocket from 'ws';

export default class WhiteboardServer {
  constructor(webServer: http.Server | https.Server, path: string) {
    const whiteboardServer = new WebSocket.Server({ server: webServer, path: path + '/whiteboard' });
    const messageServer = new WebSocket.Server({ server: webServer, path: path + '/messages' }); // Ny websocket

    // Whiteboard-tilkoblinger
    whiteboardServer.on('connection', (connection, _request) => {
      connection.on('message', (message) => {
        whiteboardServer.clients.forEach((client) => client.send(message.toString()));
      });
    });

    // Meldingsserver
    messageServer.on('connection', (connection, _request) => {
      connection.on('message', (message) => {
        messageServer.clients.forEach((client) => client.send(message.toString())); // Send melding til alle klienter
      });
    });
  }
}
