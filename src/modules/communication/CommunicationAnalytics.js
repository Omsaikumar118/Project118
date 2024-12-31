import React from 'react';
import { useSelector } from 'react-redux';
import { selectEvents } from '../../store/slices/calendarSlice';
import { selectCompanies } from '../../store/slices/companySlice';
import { selectMethods } from '../../store/slices/communicationMethodSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import './CommunicationAnalytics.css';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1'];

const CommunicationAnalytics = () => {
  // Mock data for demonstration
  const mockCompanyData = [
    { name: 'Tech Corp', completed: 25, overdue: 5, upcoming: 10 },
    { name: 'Global Inc', completed: 18, overdue: 3, upcoming: 8 },
    { name: 'Startup Ltd', completed: 12, overdue: 2, upcoming: 15 },
    { name: 'Enterprise Co', completed: 30, overdue: 4, upcoming: 6 },
    { name: 'Digital Solutions', completed: 22, overdue: 1, upcoming: 12 }
  ];

  const mockMethodData = [
    { name: 'Email', value: 35 },
    { name: 'Phone', value: 25 },
    { name: 'Meeting', value: 20 },
    { name: 'Video Call', value: 15 },
    { name: 'Chat', value: 5 }
  ];

  const mockTimelineData = [
    { month: 'Jan', communications: 45 },
    { month: 'Feb', communications: 52 },
    { month: 'Mar', communications: 48 },
    { month: 'Apr', communications: 60 },
    { month: 'May', communications: 55 },
    { month: 'Jun', communications: 65 }
  ];

  const mockStats = {
    totalCommunications: 250,
    completedPercentage: 85,
    overduePercentage: 5,
    upcomingCount: 32
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Communication Analytics</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Communications</h3>
            <div className="stat-value">{mockStats.totalCommunications}</div>
          </div>
          <div className="stat-card success">
            <h3>Completion Rate</h3>
            <div className="stat-value">{mockStats.completedPercentage}%</div>
          </div>
          <div className="stat-card warning">
            <h3>Overdue Rate</h3>
            <div className="stat-value">{mockStats.overduePercentage}%</div>
          </div>
          <div className="stat-card info">
            <h3>Upcoming</h3>
            <div className="stat-value">{mockStats.upcomingCount}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Communications by Company</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockCompanyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
              <Bar dataKey="overdue" stackId="a" fill="#EF4444" name="Overdue" />
              <Bar dataKey="upcoming" stackId="a" fill="#3B82F6" name="Upcoming" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Communication Methods</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {mockMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container full-width">
          <h2>Communication Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTimelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="communications" fill="#3B82F6" name="Communications" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CommunicationAnalytics;
