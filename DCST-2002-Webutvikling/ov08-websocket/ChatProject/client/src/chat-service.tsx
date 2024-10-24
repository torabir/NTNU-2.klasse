// Definerer hva slags meldinger klienten kan sende til serveren
export type ClientMessage = { text: string } | { addUser: string } | { removeUser: string };

// Definerer hva slags meldinger serveren kan sende tilbake til klienten
export type ServerMessage = { text: string } | { users: string[] };

// Subscription-klassen definerer fire hendelser for WebSocket-tilkoblingen
export class Subscription {
  onopen: () => void = () => {};  // Kalles når WebSocket-forbindelsen er åpnet
  onmessage: (message: ServerMessage) => void = () => {};  // Kalles når det mottas en melding fra serveren
  onclose: (code: number, reason: string) => void = () => {};  // Kalles når WebSocket-forbindelsen lukkes
  onerror: (error: Error) => void = () => {};  // Kalles ved en feil i WebSocket-forbindelsen
}

// Hovedklassen som håndterer WebSocket-kommunikasjon med serveren
class ChatService {
  connection = new WebSocket('ws://localhost:3000/api/v1/chat');  // Oppretter WebSocket-forbindelse til serveren
  subscriptions = new Set<Subscription>();  // En samling av aktive abonnementer (flere lyttere kan abonnere på meldinger)

  constructor() {
    // Når WebSocket-forbindelsen åpnes
    this.connection.onopen = () => {
      console.log('WebSocket connection opened');  // Logger at forbindelsen er opprettet
      this.subscriptions.forEach((subscription) => {
        console.log('Notifying subscription about connection');  // Varsler alle abonnenter om at forbindelsen er åpen
        subscription.onopen();
      });
    };

    // Når det mottas en melding fra serveren
    this.connection.onmessage = (event) => {
      console.log('Message received from server:', event.data);  // Logger den mottatte meldingen
      const data = event.data;
      if (typeof data === 'string') {
        this.subscriptions.forEach((subscription) => subscription.onmessage(JSON.parse(data)));  // Sender meldingen til alle abonnenter
      }
    };

    // Når WebSocket-forbindelsen lukkes
    this.connection.onclose = (event) => {
      console.log('WebSocket connection closed:', event);  // Logger at forbindelsen er lukket
      this.subscriptions.forEach((subscription) => subscription.onclose(event.code, event.reason));
    };

    // Hvis det oppstår en feil i WebSocket-forbindelsen
    this.connection.onerror = (error) => {
      console.log('WebSocket error:', error);  // Logger feilen
      const err = new Error('Connection error');
      this.subscriptions.forEach((subscription) => subscription.onerror(err));  // Varsler alle abonnenter om feilen
    };
  }

  // Abonnerer på WebSocket-hendelser
  subscribe() {
    const subscription = new Subscription();
    this.subscriptions.add(subscription);  // Legger til et nytt abonnement i samlingen
    setTimeout(() => {
      if (this.connection.readyState === WebSocket.OPEN) subscription.onopen();  // Kaller onopen umiddelbart hvis tilkoblingen allerede er åpen
    });
    return subscription;
  }

  // Avslutter et abonnement
  unsubscribe(subscription: Subscription) {
    this.subscriptions.delete(subscription);  // Fjerner abonnementet fra samlingen
  }

  // Sender en melding til serveren over WebSocket
  send(message: ClientMessage) {
    console.log('Sending message:', message);  // Logger meldingen før den sendes
    this.connection.send(JSON.stringify(message));  // Konverterer meldingen til JSON og sender den til serveren
  }
}

// Oppretter et chatService-objekt som kan brukes av andre moduler
const chatService = new ChatService();
export default chatService;
