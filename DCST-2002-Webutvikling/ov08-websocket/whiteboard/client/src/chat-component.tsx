import * as React from 'react';
import { Component } from 'react-simplified';
import chatService, { Subscription } from './chat-service';
import { Alert, Card, Form, Row, Column } from './widgets';

export class Chat extends Component {
  subscription: Subscription | null = null;  // Lagrer abonnementet til WebSocket
  connected = false;  // Sporer om klienten er tilkoblet WebSocket-serveren
  messages: string[] = [];  // Meldingslogg
  users: string[] = [];  // Liste over tilkoblede brukere
  user = '';  // Brukernavn
  message = '';  // Melding som skrives inn av brukeren

  render() {
    return (
      <Card title={'Chat (' + (this.connected ? 'Connected' : 'Not connected') + ')'}>
        {/* Viser liste over tilkoblede brukere */}
        <Card title="Connected users">
          {this.users.map((user, i) => (
            <div key={i}>{user}</div>
          ))}
        </Card>
        {/* Viser meldingene som er mottatt */}
        <Card title="Messages">
          {this.messages.map((message, i) => (
            <div key={i}>{message}</div>
          ))}
        </Card>
        {/* Input for brukernavn og meldinger */}
        <Card title="New message">
          <Row>
            <Column width={2}>
              <Form.Input
                type="text"
                placeholder="User"
                value={this.user}
                onChange={(e) => (this.user = e.currentTarget.value)}  // Oppdaterer brukernavnet
                disabled={this.connected}  // Deaktiver brukernavn-input etter at tilkoblingen er opprettet
              />
            </Column>
            <Column width={2}>
              {!this.connected ? (
                <button
                  onClick={() => {
                    if (this.user.trim() !== '') {
                      this.connectWebSocket();  // Koble til WebSocket etter at brukernavnet er satt
                    } else {
                      Alert.danger('Please enter a user name before connecting');  // Advarsel hvis brukernavn er tomt
                    }
                  }}
                >
                  Connect
                </button>
              ) : (
                <button
                  onClick={() => this.logout()}  // Vis "Logg ut"-knapp hvis tilkoblet
                >
                  Logg ut
                </button>
              )}
            </Column>
            <Column>
              <Form.Input
                type="text"
                placeholder="Message"
                value={this.message}
                onChange={(e) => (this.message = e.currentTarget.value)}  // Oppdaterer meldingsfeltet
                onKeyUp={(e) => {
                  if (e.key === 'Enter' && this.connected && this.user.trim() !== '') {
                    chatService.send({ text: `${this.user}: ${this.message}` });  // Sender melding til serveren
                    this.message = '';  // Tøm meldingsfeltet etter sending
                  }
                }}
                disabled={!this.connected}  // Deaktiver meldingsinput før tilkobling
              />
            </Column>
          </Row>
        </Card>
      </Card>
    );
  }

  // Oppretter WebSocket-forbindelse og abonnerer på hendelser
  connectWebSocket() {
    this.subscription = chatService.subscribe();
    this.subscription.onopen = () => {
      this.connected = true;
      console.log('Connected to WebSocket, sending user info:', this.user);
      chatService.send({ addUser: this.user });  // Send brukernavn til serveren når tilkoblingen er opprettet
    };

    this.subscription.onmessage = (message) => {
      if ('text' in message) {
        this.messages.push(message.text);  // Legg til ny melding i meldingsloggen
      }
      if ('users' in message) {
        this.users = message.users;  // Oppdater listen over tilkoblede brukere
      }
    };

    this.subscription.onclose = (code, reason) => {
      this.connected = false;
      Alert.danger(`Connection closed with code ${code} and reason: ${reason}`);
    };

    this.subscription.onerror = (error) => {
      this.connected = false;
      Alert.danger(`Connection error: ${error.message}`);
    };
  }

  // Logger ut og kobler fra WebSocket
  logout() {
    if (this.subscription) {
      chatService.unsubscribe(this.subscription);  // Avslutter abonnementet (kobler fra WebSocket)
      this.subscription = null;
    }
    this.connected = false;
    this.user = '';  // Tømmer brukernavnet slik at et nytt kan skrives inn
    Alert.info('You have been logged out. Enter a new user name to reconnect.');
  }
}
