// React Native API Service
// Place this file in: src/services/api.js

let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
};

// ===== HEALTH CHECK =====

export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Health check failed:', error);
    return { success: false, error: error.message };
  }
};

// ===== PIECES ENDPOINTS =====

export const fetchAllPieces = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pieces`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching pieces:', error);
    return [];
  }
};

export const fetchPieceById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pieces/${id}`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching piece:', error);
    return null;
  }
};

export const fetchPiecesByTask = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pieces/task/${taskId}`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching pieces by task:', error);
    return [];
  }
};

export const fetchPiecesByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pieces/status/${status}`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching pieces by status:', error);
    return [];
  }
};

export const createPiece = async (pieceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pieces`, {
      method: 'POST',
      ...API_CONFIG,
      body: JSON.stringify(pieceData)
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error creating piece:', error);
    return null;
  }
};

export const updatePiece = async (id, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pieces/${id}`, {
      method: 'PUT',
      ...API_CONFIG,
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error updating piece:', error);
    return null;
  }
};

// ===== TASKS ENDPOINTS =====

export const fetchAllTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const fetchTaskById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
};

export const fetchTasksByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/status/${status}`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    return [];
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      ...API_CONFIG,
      body: JSON.stringify(taskData)
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

export const updateTask = async (id, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      ...API_CONFIG,
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
};

// ===== SCANNING ENDPOINT =====

export const recordBarcodeScan = async (scanData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      ...API_CONFIG,
      body: JSON.stringify(scanData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error recording scan:', error);
    return { success: false, error: error.message };
  }
};

// ===== DASHBOARD ENDPOINT =====

export const fetchDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.dashboard : null;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
};

// ===== WORKERS ENDPOINT =====

export const fetchAllWorkers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workers`, {
      method: 'GET',
      ...API_CONFIG
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching workers:', error);
    return [];
  }
};

// ===== UTILITY FUNCTIONS =====

export const setApiBaseUrl = (url) => {
  API_BASE_URL = url;
};

export const getApiBaseUrl = () => {
  return API_BASE_URL;
};

export default {
  checkServerHealth,
  fetchAllPieces,
  fetchPieceById,
  fetchPiecesByTask,
  fetchPiecesByStatus,
  createPiece,
  updatePiece,
  fetchAllTasks,
  fetchTaskById,
  fetchTasksByStatus,
  createTask,
  updateTask,
  recordBarcodeScan,
  fetchDashboardStats,
  fetchAllWorkers,
  setApiBaseUrl,
  getApiBaseUrl
};
