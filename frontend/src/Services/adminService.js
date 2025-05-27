
const API_URL = '/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch users');
  }
  return response.json();
};

const createUserAccount = async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user account');
    }
    return response.json();
};

const deactivateUserAccount = async (id) => {
  const response = await fetch(`${API_URL}/users/deactivate/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to deactivate user');
  }
  return response.json();
};

const activateUserAccount = async (id) => {
    const response = await fetch(`${API_URL}/users/activate/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to activate user');
    }
    return response.json();
};

export { getAllUsers, createUserAccount, deactivateUserAccount, activateUserAccount };