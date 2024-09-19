# Instructions: 
1. Make sure to install node.js, npm and Postman. 
2. Install Express.js, Babel, nodemon: Run: 
    npm install express --save
    npm install @babel/core @babel/cli @babel/preset-env @babel/node --save-dev
    npm install nodemon --save-dev
3. You need a C-compiler. If you use MacOS and get the error: "gyp: No Xcode or CLT version detected!", follow inscrutions here: https://github.com/nodejs/node-gyp

# Further descriptions: 
-express: rammeverk for å opprette webserver
-babel: nyere node.js rammeverk
-nodemon: alle endringer i koden fanges opp automatisk

......

# Testing av API-endepunkter i Postman:

## 1. Start serveren din

Sørg for at serveren kjører ved å starte `app.js`
    npm run start
Sørg for at serveren kjører på riktig port (f.eks. `localhost:3000`).

## 2. Test de ulike endepunktene

Åpne Postman og følg disse stegene for å teste hvert av de nye endepunktene:

### Endepunkt 1: Hent alle lister

- **Metode:** GET
- **URL:** http://localhost:3000/api/v1/lists
- **Forventet respons:** En JSON-liste med alle lister, f.eks.:
  ```json
  [
    {
      "id": 1,
      "title": "Skole"
    }
  ]
  ```

### Endepunkt 2: Hent en bestemt liste

- **Metode:** GET
- **URL:** `http://localhost:3000/api/v1/lists/1` (bytt ut `1` med riktig `listId`)
- **Forventet respons:** En JSON-representasjon av en bestemt liste, f.eks.:
  ```json
  {
    "id": 1,
    "title": "Skole"
  }
  ```

### Endepunkt 3: Opprett en ny liste

- **Metode:** POST
- **URL:** `http://localhost:3000/api/v1/lists`
- **Body:**
  - Velg `raw` i Postman og sett body-typen til `JSON`.
  - Legg inn følgende JSON:
    ```json
    {
      "id": 2,
      "title": "Handleliste"
    }
    ```
- **Forventet respons:** Status `201 Created` og en tom respons med en `Location`-header som peker til den nye listen.

### Endepunkt 4: Slett en liste

- **Metode:** DELETE
- **URL:** `http://localhost:3000/api/v1/lists/1` (bytt ut `1` med riktig `listId`)
- **Forventet respons:** En JSON-liste over alle lister som gjenstår etter at listen er slettet.

### Endepunkt 5: Hent alle oppgaver for en bestemt liste

- **Metode:** GET
- **URL:** `http://localhost:3000/api/v1/lists/1/tasks` (bytt ut `1` med riktig `listId`)
- **Forventet respons:** En JSON-liste over alle oppgaver i den aktuelle listen, f.eks.:
  ```json
  [
    {
      "id": 1,
      "title": "Les leksjon",
      "done": false,
      "listId": 1
    },
    {
      "id": 2,
      "title": "Møt opp på forelesning",
      "done": false,
      "listId": 1
    }
  ]
  ```

### Endepunkt 6: Hent en bestemt oppgave for en liste

- **Metode:** GET
- **URL:** `http://localhost:3000/api/v1/lists/1/tasks/1` (bytt ut `1` med riktig `listId` og `taskId`)
- **Forventet respons:** En JSON-representasjon av en bestemt oppgave, f.eks.:
  ```json
  {
    "id": 1,
    "title": "Les leksjon",
    "done": false,
    "listId": 1
  }
  ```

### Endepunkt 7: Opprett en ny oppgave i en bestemt liste

- **Metode:** POST
- **URL:** `http://localhost:3000/api/v1/lists/1/tasks` (bytt ut `1` med riktig `listId`)
- **Body:**
  - Velg `raw` i Postman og sett body-typen til `JSON`.
  - Legg inn følgende JSON:
    ```json
    {
      "id": 3,
      "title": "Kjøp melk",
      "done": false
    }
    ```
- **Forventet respons:** Status `201 Created` og en tom respons med en `Location`-header som peker til den nye oppgaven.

### Endepunkt 8: Slett en bestemt oppgave i en liste

- **Metode:** DELETE
- **URL:** `http://localhost:3000/api/v1/lists/1/tasks/1` (bytt ut `1` med riktig `listId` og `taskId`)
- **Forventet respons:** En JSON-liste over alle oppgaver som gjenstår etter at oppgaven er slettet.

## 3. Generelle tips for testing i Postman

- **Body-format:** For `POST`-forespørsler, sørg for at body er i `JSON`-format, og at du setter `Content-Type` header til `application/json` (Postman gjør dette automatisk når du velger `raw` og `JSON`).
- **Riktig URL:** Pass på at du bruker riktig URL, f.eks. `http://localhost:3000/api/v1/` for å matche din server-URL.
- **Statuskoder:** Sjekk alltid statuskoden i responsene dine (200 OK, 201 Created, 404 Not Found, osv.) for å verifisere at forespørselen har gått gjennom.

## 4. Test eksempel

Her er en konkret test i Postman for å opprette en liste:

1. Velg `POST`-metode.
2. Sett URL til: `http://localhost:3000/api/v1/lists`
3. I Body:
   - Velg `raw` og sett den til `JSON`.
   - Skriv inn:
     ```json
     {
       "id": 3,
       "title": "Helg gjøremål"
     }
     ```
4. Trykk på `Send`.
5. Sjekk responsen: Den skal gi en `201 Created` statuskode.

Dette vil validere at den nye listen er blitt opprettet korrekt. Test hvert endepunkt på tilsvarende måte for å forsikre deg om at alt fungerer som forventet.
