// -- Steg for å flytte over tasks fra app.js til routes/tasks.js ligger i tasks.js
// (Vi har delt opp endepunktene og flyttet tasks fra app.js til tasks.js, samt opprettet lists.js. 

//Importer avhengigheter
import express from 'express';
import taskRoutes from './routes/tasks.js';  // Importerer task-ruter
import listRoutes from './routes/lists.js';  // Importerer list-ruter

// Initialiserer appen vår
const app = express();
// Gjør det mulig å tolke json i body-elementet til en forespørsel
app.use(express.json());

// Forteller oss at webtjeneren skal lytte på port 3000. 
// Startpunktet for vår lokale webtjener blir da http://localhost:3000
const PORT = 3000;
app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});


// Knytter task- og liste-ruter til egne URL-er
app.use('/api/v1/tasks', taskRoutes);  // Ruter for tasks går til '/api/v1/tasks'
app.use('/api/v1/lists', listRoutes);  // Ruter for lists går til '/api/v1/lists'
