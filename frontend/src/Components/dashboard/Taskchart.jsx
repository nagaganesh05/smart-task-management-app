
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {format,subDays} from 'date-fns'

const COLORS = ['#3B82F6', '#60A5FA', '#10B981', '#F59E0B', '#EF4444', '#A855F7', '#EC4899']; // Tailwind inspired colors

const TaskChart = ({ type, data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">
        <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
        <p>No data available for this chart.</p>
      </div>
    );
  }

  const renderBarChart = () => {
    
    const dailyCounts = {};
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
      dailyCounts[date] = 0;
    }

    data.forEach(task => {
      const completionDate = format(new Date(task.updatedAt), 'yyyy-MM-dd');
      if (dailyCounts.hasOwnProperty(completionDate)) {
        dailyCounts[completionDate]++;
      }
    });

    const chartData = Object.keys(dailyCounts).map(date => ({
      date: format(new Date(date), 'MMM dd'),
      completed: dailyCounts[date],
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
          <Legend wrapperStyle={{ color: '#F9FAFB' }} />
          <Bar dataKey="completed" fill="#3B82F6" name="Tasks Completed" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    
    const chartData = data.map(item => ({
      name: item.category,
      value: item.count,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
          <Legend wrapperStyle={{ color: '#F9FAFB' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <>
      <h3 className="text-lg font-semibold text-primary mb-2 text-center">{title}</h3>
      {type === 'bar' && renderBarChart()}
      {type === 'pie' && renderPieChart()}
    </>
  );
};

export default TaskChart;