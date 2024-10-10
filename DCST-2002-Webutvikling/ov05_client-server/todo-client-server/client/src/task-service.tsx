import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

// Task er objektet (dataen) som metodene i klassen TaskService jobber med
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
    return axios.get<Task>('/tasks/' + id).then((response) => response.data);
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return axios.get<Task[]>('/tasks').then((response) => response.data);
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(title: string) {
    return axios
      .post<{ id: number }>('/tasks', { title: title })
      .then((response) => response.data.id);
  }

  /**A: 
   * Update task with the given id and data.
   * 
   */
  update(id: number, data: Partial<Task>){ // Partial<Task> - man trenger bare å oppdatere det man vil oppdatere, her 'done'
    return axios.put(`/tasks/${id}`, data) // sender PUT-forespørsel til serveren på gitt id (PUT = endring av data)
  }                                        // 'data' er det som skal oppdateres 

  /**
   * Delete task with given id.
   */
  delete(id: number) {
    return axios.delete(`/tasks/${id}`);  // Sender DELETE-forespørsel til serveren
  }
}

const taskService = new TaskService();
export default taskService;
