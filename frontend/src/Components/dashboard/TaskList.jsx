
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import DataTable from '../Common/DataTable';

const TaskList = ({ tasks, onEdit, onDelete, onUpdateStatus, onSort, sortBy, sortOrder }) => {

    const columns = [
        { header: 'Name', dataKey: 'name', sortable: true },
        { header: 'Description', dataKey: 'description' },
        { header: 'Category', dataKey: 'category', sortable: true },
        {
            header: 'Due Date',
            dataKey: 'dueDate',
            sortable: true,
            render: (row) => row.dueDate ? format(new Date(row.dueDate), 'MMM dd, yyyy') : 'N/A',
        },
        {
            header: 'Status',
            dataKey: 'status',
            sortable: true,
            render: (row) => (
                <select
                    value={row.status}
                    onChange={(e) => onUpdateStatus(row.id, e.target.value)}
                    className={`p-1 rounded-md text-sm font-semibold
                        ${row.status === 'completed' ? 'bg-green-600 text-white' :
                          row.status === 'overdue' ? 'bg-red-600 text-white' :
                          'bg-yellow-600 text-white'}
                        focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                </select>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(row)}
                        className="p-2 rounded-full bg-primary hover:bg-secondary text-white transition-colors"
                        title="Edit Task"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(row.id)}
                        className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="card">
            <DataTable
                data={tasks}
                columns={columns}
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
            />
        </div>
    );
};

export default TaskList;