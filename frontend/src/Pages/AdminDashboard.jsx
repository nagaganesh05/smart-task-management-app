
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, deactivateUserAccount, activateUserAccount, createUserAccount } from '../services/adminService';
import DataTable from '../Components/Common/DataTable';
import LoadingSpinner from '../Components/Common/LoadingSpinner';
import ConfirmationModal from '../Components/Common/ConfirmationModal';
import { PlusCircle, UserCheck, UserX } from 'lucide-react';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/dataExport';

function AdminDashboard() {
    const { logout, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({
        username: '', email: '', password: '', role: 'user', isActive: true
    });


    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [actionUser, setActionUser] = useState(null); 
    const [confirmActionType, setConfirmActionType] = useState(''); 

    const fetchUsers = useCallback(async () => {
        setError('');
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch users.');
            console.error('Admin user fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateUserChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUserData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateUserSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await createUserAccount(newUserData);
            alert('User account created successfully!'); 
            setIsCreateUserModalOpen(false);
            setNewUserData({ username: '', email: '', password: '', role: 'user', isActive: true });
            fetchUsers(); 
        } catch (err) {
            setError(err.message || 'Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (userId, actionType) => {
        const userToAct = users.find(u => u.id === userId);
        if (userToAct) {
            setActionUser(userToAct);
            setConfirmActionType(actionType);
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmAction = async () => {
        setError('');
        setLoading(true);
        try {
            if (confirmActionType === 'deactivate') {
                await deactivateUserAccount(actionUser.id);
            } else if (confirmActionType === 'activate') {
                await activateUserAccount(actionUser.id);
            }
            fetchUsers();
            setIsConfirmModalOpen(false);
            setActionUser(null);
            setConfirmActionType('');
        } catch (err) {
            setError(err.message || 'Action failed.');
        } finally {
            setLoading(false);
        }
    };

    const userTableColumns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Username', dataKey: 'username', sortable: true },
        { header: 'Email', dataKey: 'email', sortable: true },
        { header: 'Role', dataKey: 'role', sortable: true },
        {
            header: 'Status',
            dataKey: 'isActive',
            sortable: true,
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    {row.isActive ? (
                        <button
                            onClick={() => handleActionClick(row.id, 'deactivate')}
                            className="btn-danger flex items-center text-xs"
                            disabled={row.id === user.id} 
                            title={row.id === user.id ? "Cannot deactivate your own account" : "Deactivate Account"}
                        >
                            <UserX size={14} className="mr-1" /> Deactivate
                        </button>
                    ) : (
                        <button
                            onClick={() => handleActionClick(row.id, 'activate')}
                            className="btn-primary flex items-center text-xs"
                            title="Activate Account"
                        >
                            <UserCheck size={14} className="mr-1" /> Activate
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const exportUsers = (formatType) => {
        if (users.length === 0) {
            alert('No users to export.');
            return;
        }

        const exportableUsers = users.map(({ password, ...rest }) => ({ ...rest }));

        if (formatType === 'csv') {
          downloadCSV(exportableUsers, 'user_accounts');
        } else if (formatType === 'excel') {
          downloadExcel(exportableUsers, 'user_accounts');
        } else if (formatType === 'pdf') {
          const columns = [
            { header: "ID", dataKey: "id" },
            { header: "Username", dataKey: "username" },
            { header: "Email", dataKey: "email" },
            { header: "Role", dataKey: "role" },
            { header: "Status", dataKey: "isActive" },
          ];
          downloadPDF(exportableUsers, columns, 'user_accounts');
        }
    };


    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-dark p-6">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsCreateUserModalOpen(true)}
                        className="btn-primary flex items-center"
                    >
                        <PlusCircle size={20} className="mr-2" /> Create User
                    </button>
                    <div className="relative group">
                        <button
                          className="btn-primary flex items-center"
                        >
                          <Download size={20} className="mr-2" /> Export Users
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-darker rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <button
                            onClick={() => exportUsers('csv')}
                            className="block w-full text-left px-4 py-2 text-text hover:bg-gray-700"
                          >
                            Download CSV
                          </button>
                          <button
                            onClick={() => exportUsers('excel')}
                            className="block w-full text-left px-4 py-2 text-text hover:bg-gray-700"
                          >
                            Download Excel
                          </button>
                          <button
                            onClick={() => exportUsers('pdf')}
                            className="block w-full text-left px-4 py-2 text-text hover:bg-gray-700"
                          >
                            Download PDF
                          </button>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <section className="mb-8">
                <h2 className="text-3xl font-bold text-primary mb-6">User Management</h2>
                <DataTable data={users} columns={userTableColumns} />
            </section>

            
            <div className={`fixed inset-0 bg-darker bg-opacity-75 flex items-center justify-center z-50 ${!isCreateUserModalOpen && 'hidden'}`}>
                <div className="bg-dark p-6 rounded-lg shadow-xl w-full max-w-md">
                    <h3 className="text-xl font-semibold text-text mb-4">Create New User Account</h3>
                    <form onSubmit={handleCreateUserSubmit}>
                        <div className="form-group">
                            <label htmlFor="createUserUsername" className="form-label">Username:</label>
                            <input
                                type="text"
                                id="createUserUsername"
                                name="username"
                                value={newUserData.username}
                                onChange={handleCreateUserChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="createUserEmail" className="form-label">Email:</label>
                            <input
                                type="email"
                                id="createUserEmail"
                                name="email"
                                value={newUserData.email}
                                onChange={handleCreateUserChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="createUserPassword" className="form-label">Password:</label>
                            <input
                                type="password"
                                id="createUserPassword"
                                name="password"
                                value={newUserData.password}
                                onChange={handleCreateUserChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="createUserRole" className="form-label">Role:</label>
                            <select
                                id="createUserRole"
                                name="role"
                                value={newUserData.role}
                                onChange={handleCreateUserChange}
                                className="input-field"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="createUserIsActive"
                                name="isActive"
                                checked={newUserData.isActive}
                                onChange={handleCreateUserChange}
                                className="h-4 w-4 text-primary rounded border-gray-600 focus:ring-primary"
                            />
                            <label htmlFor="createUserIsActive" className="form-label mb-0">Active Account</label>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsCreateUserModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmAction}
                title={`${confirmActionType === 'deactivate' ? 'Deactivate' : 'Activate'} User Account`}
                message={`Are you sure you want to ${confirmActionType} user "${actionUser?.username}"?`}
                confirmText={confirmActionType === 'deactivate' ? 'Deactivate' : 'Activate'}
            />
        </div>
    );
}

export default AdminDashboard;