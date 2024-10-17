import express from 'express';
import router from './task-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Bruker API-versjon 2 for det nye endepunktet
app.use('/api/v2', router); // Endret fra TaskRouter til router

export default app;