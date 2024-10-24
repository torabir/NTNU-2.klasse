import type http from 'http';
import type https from 'https';
import WebSocket from 'ws';

// Definerer hva slags meldinger som kan sendes fra klienten
export type ClientMessage = { text: string } | { addUser: string } | { removeUser: string };

// Definerer hva slags meldinger serveren kan sende tilbake til klienten
export type ServerMessage = { text: string } | { users: string[] };

/**
 * Chat server som håndterer tilkoblinger, meldinger, og frakoblinger
 */
export default class ChatServer {
  users: string[] = [];  // Liste over tilkoblede brukere

  constructor(webServer: http.Server | https.Server, path: string) {
    const server = new WebSocket.Server({ server: webServer, path: path + '/chat' });

    server.on('connection', (connection, _request) => {
      let currentUser: string | null = null;  // Lagrer brukernavnet til den nåværende tilkoblingen
      console.log('New client connected');

      // Når det mottas en melding fra klienten
      connection.on('message', (message) => {
        const data: ClientMessage = JSON.parse(message.toString());

        // Når en ny bruker legges til
        if ('addUser' in data) {
          currentUser = data.addUser;
          this.users.push(currentUser);  // Legg til brukernavn i listen over tilkoblede brukere
          this.broadcastUsers(server);  // Send oppdatert brukerliste til alle tilkoblede klienter
        }

        // Når det mottas en chat-melding
        if ('text' in data) {
          server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ text: data.text } as ServerMessage));  // Send chat-meldingen til alle klienter
            }
          });
        }
      });

      // Når en klient kobler fra
      connection.on('close', () => {
        if (currentUser) {
          this.users = this.users.filter((user) => user !== currentUser);  // Fjern brukeren fra listen over tilkoblede brukere
          this.broadcastUsers(server);  // Send oppdatert brukerliste til alle klienter
          console.log('Client disconnected and user removed:', currentUser);
        }
      });
    });
  }

  // Sender oppdatert liste over brukere til alle tilkoblede klienter
  broadcastUsers(server: WebSocket.Server) {
    const message = JSON.stringify({ users: this.users } as ServerMessage);  // Pakk brukerliste i JSON-format
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);  // Send listen over brukere til alle tilkoblede klienter
      }
    });
  }
}
