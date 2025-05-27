
const API_URL = '/api/tasks';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const getTasks = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch tasks');
  }
  return response.json();
};

const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create task');
  }
  return response.json();
};

const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update task');
  }
  return response.json();
};

const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete task');
  }
  return response.json();
};

const getDashboardData = async () => {
    const response = await fetch(`${API_URL}/dashboard-data`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard data');
    }
    return response.json();
};


export { getTasks, createTask, updateTask, deleteTask, getDashboardData };