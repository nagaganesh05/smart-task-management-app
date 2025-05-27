// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getDashboardData, getTasks, createTask, updateTask, deleteTask } from '../Services/taskService';
import TaskList from '../Components/dashboard/TaskList';
import TaskChart from '../Components/dashboard/TaskChart';
import TaskFormModal from '../Components/tasks/TaskFormModal';
import ConfirmationModal from '../Components/Common/ConfirmationModal';
import LoadingSpinner from '../Components/Common/LoadingSpinner';
import { downloadCSV, downloadExcel, downloadPDF } from '../Utils/dataExport';
import { PlusCircle, Download } from 'lucide-react';
import { format } from 'date-fns';

function Dashboard() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null); // For editing

  // Confirmation Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Sorting state for TaskList
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data.');
      console.error('Dashboard data fetch error:', err);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const fetchedTasks = await getTasks({ sortBy, sortOrder });
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks.');
      console.error('Tasks fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    fetchDashboardData();
    fetchTasks();
  }, [fetchDashboardData, fetchTasks]);

  const handleTaskSubmit = async (taskData) => {
    setError('');
    try {
      if (currentTask) {
        await updateTask(currentTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      setIsTaskModalOpen(false);
      setCurrentTask(null);
      fetchTasks(); // Refresh tasks
      fetchDashboardData(); // Refresh dashboard data
    } catch (err) {
      setError(err.message || 'Failed to save task.');
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setError('');
    try {
      await deleteTask(taskToDelete);
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to delete task.');
    } finally {
      setIsConfirmModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    setError('');
    try {
      await updateTask(taskId, { status: newStatus });
      fetchTasks(); // Refresh tasks
      fetchDashboardData(); // Refresh dashboard data
    } catch (err) {
      setError(err.message || 'Failed to update task status.');
    }
  };

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(columnKey);
      setSortOrder('ASC');
    }
  };

  const exportTasks = (formatType) => {
    if (tasks.length === 0) {
      alert('No tasks to export.');
      return;
    }

    const exportableTasks = tasks.map(({ id, userId, createdAt, updatedAt, ...rest }) => ({
        ...rest,
        dueDate: rest.dueDate ? format(new Date(rest.dueDate), 'yyyy-MM-dd') : '',
    }));

    if (formatType === 'csv') {
      downloadCSV(exportableTasks, 'my_tasks');
    } else if (formatType === 'excel') {
      downloadExcel(exportableTasks, 'my_tasks');
    } else if (formatType === 'pdf') {
      const columns = [
        { header: "Name", dataKey: "name" },
        { header: "Description", dataKey: "description" },
        { header: "Category", dataKey: "category" },
        { header: "Due Date", dataKey: "dueDate" },
        { header: "Status", dataKey: "status" },
      ];
      downloadPDF(exportableTasks, columns, 'my_tasks');
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Welcome, {user?.username}!</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <PlusCircle size={20} className="mr-2" /> New Task
          </button>
          <div className="relative group">
            <button
              className="btn-primary flex items-center"
            >
              <Download size={20} className="mr-2" /> Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-darker rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={() => exportTasks('csv')}
                className="block w-full text-left px-4 py-2 text-text hover:bg-gray-700"
              >
                Download CSV
              </button>
              <button
                onClick={() => exportTasks('excel')}
                className="block w-full text-left px-4 py-2 text-text hover:bg-gray-700"
              >
                Download Excel
              </button>
              <button
                onClick={() => exportTasks('pdf')}
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

      {dashboardData && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-primary mb-4">Tasks Due Today</h3>
            <ul className="space-y-2">
              {dashboardData.tasksDueToday.length > 0 ? (
                dashboardData.tasksDueToday.map((task) => (
                  <li key={task.id} className="flex justify-between items-center text-gray-300">
                    <span>{task.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${task.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        {task.status.toUpperCase()}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No tasks due today!</p>
              )}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-primary mb-4">Upcoming Tasks</h3>
            <ul className="space-y-2">
              {dashboardData.upcomingTasks.length > 0 ? (
                dashboardData.upcomingTasks.map((task) => (
                  <li key={task.id} className="flex justify-between items-center text-gray-300">
                    <span>{task.name}</span>
                    <span className="text-sm text-gray-400">{task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No Due Date'}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No upcoming tasks.</p>
              )}
            </ul>
          </div>

          <div className="chart-container">
            <TaskChart
              type="bar"
              data={dashboardData.tasksCompletedLast7Days}
              title="Tasks Completed in Last 7 Days"
            />
          </div>
          <div className="chart-container">
            <TaskChart
              type="pie"
              data={dashboardData.popularCategories}
              title="Most Popular Task Categories"
            />
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-primary mb-6">All My Tasks</h2>
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
          onUpdateStatus={handleUpdateStatus}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </section>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setCurrentTask(null); // Clear current task when closing
          setError(''); // Clear error on close
        }}
        onSubmit={handleTaskSubmit}
        initialData={currentTask}
        error={error}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

export default Dashboard;