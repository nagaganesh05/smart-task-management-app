
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({ data, columns, onSort, sortBy, sortOrder }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-400 py-4">No data available.</p>;
    }

    return (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-700">
            <table className="min-w-full leading-normal">
                <thead>
                    <tr className="table-header">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="py-3 px-6 text-left cursor-pointer"
                                onClick={() => column.sortable && onSort(column.dataKey)}
                            >
                                <div className="flex items-center">
                                    {column.header}
                                    {column.sortable && (
                                        <span className="ml-1">
                                            {sortBy === column.dataKey && sortOrder === 'ASC' && <ChevronUp size={16} />}
                                            {sortBy === column.dataKey && sortOrder === 'DESC' && <ChevronDown size={16} />}
                                            {sortBy !== column.dataKey && <ChevronUp size={16} className="text-gray-400" />}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="table-row">
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="table-cell">
                                    {column.render ? column.render(row) : row[column.dataKey]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;