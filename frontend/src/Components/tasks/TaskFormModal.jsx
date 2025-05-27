
import React, { useState, useEffect } from 'react';
import { validateTaskName, validateDueDate } from '../../Utils/validation';
import { format } from 'date-fns';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialData = null, error: submitError }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setDescription(initialData.description || '');
        setCategory(initialData.category || '');
        setDueDate(initialData.dueDate ? format(new Date(initialData.dueDate), 'yyyy-MM-dd') : '');
        setStatus(initialData.status || 'pending');
      } else {
        setName('');
        setDescription('');
        setCategory('');
        setDueDate('');
        setStatus('pending');
      }
      setFormError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateTaskName(name)) {
      setFormError('Task name cannot be empty.');
      return;
    }
    if (!validateDueDate(dueDate)) {
      setFormError('Invalid due date.');
      return;
    }

    onSubmit({ name, description, category, dueDate, status });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-darker bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-dark p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-xl font-semibold text-text mb-4">{initialData ? 'Edit Task' : 'Create New Task'}</h3>
        <form onSubmit={handleSubmit}>
          {(formError || submitError) && <p className="text-red-500 mb-4">{formError || submitError}</p>}
          <div className="form-group">
            <label htmlFor="taskName" className="form-label">Task Name:</label>
            <input
              type="text"
              id="taskName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category:</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>
          {initialData && ( 
            <div className="form-group">
              <label htmlFor="status" className="form-label">Status:</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;