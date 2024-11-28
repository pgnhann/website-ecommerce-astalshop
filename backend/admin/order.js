const express = require("express");
const path = require("path");

module.exports = (client) => {
    const router = express.Router(); 

    router.get("/all-orders", async (req, res) => {
        try {
        const result = await client.query(`
            SELECT * FROM orders ORDER BY id_od ASC 
        `);
        res.status(200).json(result.rows); 
        } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.put("/update-order-status/:id", async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
      
        if (!status) {
          return res.status(400).json({ error: "Status is required" });
        }
      
        try {
          await client.query("UPDATE orders SET status = $1 WHERE id_od = $2", [status, id]);
          res.status(200).json({ message: "Order status updated successfully!" });
        } catch (error) {
          console.error("Error updating order status:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

      router.get('/order-details/:id_od', async (req, res) => {
        const { id_od } = req.params;
        try {
          const order = await client.query('SELECT * FROM orders WHERE id_od = $1', [id_od]);
          const products = await client.query('SELECT namepro, price_ori, price_afvou, quantity FROM orderdetails WHERE id_od = $1', [id_od]);
          res.json({ order: order.rows[0], products: products.rows });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error fetching order details' });
        }
      });
      
      router.get("/recent-orders", async (req, res) => {
        try {
          const result = await client.query(`
            SELECT 
              o.id_od, 
              o.name AS name, 
              o.totalamount, 
              o.status,
              STRING_AGG(od.namepro, ', ') AS products
            FROM orders o
            LEFT JOIN orderdetails od ON o.id_od = od.id_od
            GROUP BY o.id_od
            ORDER BY o.created_at DESC
            LIMIT 10
          `);
      
          res.status(200).json(result.rows);
        } catch (error) {
          console.error("Error fetching recent orders:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
      

router.get("/monthly-revenue", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        SUM(totalamount) AS revenue
      FROM orders
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/order-status", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        status,
        COUNT(*) AS count
      FROM orders
      GROUP BY status
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
      

    return router;
};
