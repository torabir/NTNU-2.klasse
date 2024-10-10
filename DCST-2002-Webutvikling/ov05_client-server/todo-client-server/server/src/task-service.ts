import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Task = {
  id: number;
  title: string;
  done: boolean;
};

class TaskService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return new Promise<Task | undefined>((resolve, reject) => { // det inni <> er typen som returneres av Promiset (resolve)
      pool.query('SELECT * FROM Tasks WHERE id = ?', [id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Task); // Returnerer den første tasken som matcher ID-en
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Task[]>((resolve, reject) => {
      pool.query('SELECT * FROM Tasks', [], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Task[]); // Promiset returnerer en liste med Tasks
      });
    });
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(title: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO Tasks SET title=?', [title], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve(results.insertId); // Promiset returnerer et tall (ID-en til den opprettede oppgaven)
      });
    });
  }

  /**
   * Delete task with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Tasks WHERE id = ?', [id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) reject(new Error('No row deleted'));

        resolve(); // Bekrefter at slettingen var vellykket
      });
    });
  }

  // A:
/**
 * Oppdaterer en oppgave i databasen.
 */
  update(id: number, data: { done: boolean }) {
    return new Promise<void>((resolve, reject) => { // Det inni <> er typen som returneres av Promiset (resolve)
                                                    // Her void fordi det ikke er spesifisert hva som returneres 
      pool.query(
        'UPDATE tasks SET done = ? WHERE id = ?', [data.done, id], (error, results: ResultSetHeader) => {
          if (error) return reject(error); 

          // if (results.affectedRows === 0) er nødvendig i update- og delete-spørringer for å sikre 
          // at en faktisk rad ble oppdatert eller slettet.
          if (results.affectedRows === 0) return reject(new Error('No task found to update'));

          resolve(); // Oppdateringen var vellykket
          console.log('Oppdaterer task med id:', id, 'og done-status:', data.done);
        }
      );
    });
  }
}

const taskService = new TaskService();
export default taskService;
