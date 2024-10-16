# Client tests example

## My notes: 

###

Viktig: 

- Husk å importere det du skal teste øverst, feks legge til "Card", "Button" fra widgets, osv. 
- Legg til en og en test
- legg til consol.log i testen (be chat om riktig consol.log) for å finne ut av hva som er feil
- Husk å oppdatere datasen med riktige kollonner
- husk å skriv NØYAKTIG det samme i koden som i SQL-databsen (store/små bokstaver - feil oppdages ikke av chatGPT)


### Serverside: 

Add a column in the table Tasks: 

ALTER TABLE Tasks ADD COLUMN description VARCHAR(255) DEFAULT 'none';

Legge til description i Tasks på både server og klient. 

Endre create-fuksjonen til å inkludere description

Endre router.post til å inkludere description

lagt til en router.put og update-metode i task-service

### Klientside: 

Endre TaskDetals komponent til å ha med description

Endre TaskEdit og TaskNew til å inkludere description (komponents) (endre value + on change eventen)

Endre så create-knappen (i TaskNew komponenten) har med description

Endre create-funksjonen på klienten (task-service) til å inkludere description

Legge til funksjonalitet i Save og Delete knapper i task-service. 

lagt til update i taskservice

### Testside, widgets:  

Først åpne 3 Alert-meldinger.
Deretter simulere at brukeren lukker den andre meldingen.
Til slutt sjekke at den riktige meldingen lukkes, og at de to andre forblir synlige.

### Testside, components:  

Legg til to nye tester for TaskDetails. En som sjekker at den rendres riktig ved bruk av containsMatchingElement, og en som sikrer at UI-et stemmer overens med tidligere snapshots.

## Setup database connections

You need to create two configuration files that will contain the database connection details. These
files should not be uploaded to your git repository, and they have therefore been added to
`.gitignore`. The connection details may vary, but example content of the two configuration files
are as follows:

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'username_todo_dev';
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'username_todo_test';
```

These environment variables will be used in the `server/src/mysql-pool.ts` file.

## Start server

Install dependencies and start server:

```sh
cd server
npm install
npm start
```

### Run server tests:

```sh
npm test
```

## Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```

### Run client tests:

```sh
npm test
```
