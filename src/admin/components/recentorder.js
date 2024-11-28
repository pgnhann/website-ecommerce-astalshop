import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function RecentOrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/recent-orders");
        const data = await response.json();
        setOrders(data); // Lưu dữ liệu đơn hàng gần đây
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id_od}>
            <TableCell>{order.id_od}</TableCell>
            <TableCell>{order.name}</TableCell>
            <TableCell>{order.products}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell className="text-right">${order.totalamount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
