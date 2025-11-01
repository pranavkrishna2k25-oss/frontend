import api from './api';

export const taskService = {
  // Get all tasks for the authenticated user
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Get a single task by ID
  getTask: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update an existing task
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Mark task as completed
  completeTask: async (taskId) => {
    const response = await api.put(`/tasks/${taskId}`, { isCompleted: true });
    return response.data;
  },

  // Mark task as pending
  uncompleteTask: async (taskId) => {
    const response = await api.put(`/tasks/${taskId}`, { isCompleted: false });
    return response.data;
  },

  // Toggle task completion status
  toggleTask: async (taskId, isCompleted) => {
    const response = await api.put(`/tasks/${taskId}`, { isCompleted });
    return response.data;
  },
};
