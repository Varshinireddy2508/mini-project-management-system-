import axios from 'axios';

// Normalize the base URL so there is no trailing slash and /api convention is respected
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const baseURL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const projectService = {
  // Fetch all projects (optionally filtered by status)
  getAllProjects: async (status) => {
    const params = status && status !== 'ALL' ? { status } : {};
    const response = await apiClient.get('/projects', { params });
    return response.data;
  },

  // Fetch single project by ID
  getProjectById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  // Create a new project
  createProject: async (projectData) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  // Update existing project by ID
  updateProject: async (id, projectData) => {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project by ID
  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  // Health check endpoint
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;
