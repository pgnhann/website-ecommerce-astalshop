import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/index';
import { DashboardCards } from '../components/dashcard';
import { RecentOrdersTable } from '../components/recentorder';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [revenueData, setRevenueData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/monthly-revenue');
        const formattedData = response.data.map((item) => ({
          name: item.month, 
          revenue: parseFloat(item.revenue),
        }));
        setRevenueData(formattedData);
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    };

    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/order-status');
        const formattedData = response.data.map((item) => ({
          name: item.status, 
          value: parseInt(item.count, 10), 
        }));
        setPieData(formattedData);
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };

    fetchMonthlyRevenue();
    fetchOrderStatus();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h1>
      <DashboardCards />

      {/* Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Column */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold mb-4">Monthly Revenue</h2>
          <BarChart width={500} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Circle */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold mb-4">Order Status Distribution</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
        <RecentOrdersTable />
      </div>
    </AdminLayout>
  );
}
