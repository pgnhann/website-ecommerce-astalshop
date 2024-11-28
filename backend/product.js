const express = require("express"); // Thêm dòng này để nhập express

module.exports = (client) => {
    const router = express.Router(); // Sử dụng express.Router()
  
    router.get("/new-brands", async (req, res) => {
        try {
            const result = await client.query("SELECT * FROM product WHERE date = '2024-11-12'");
            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Database error!" });
        }
    });


    router.get("/best-sellers", async (req, res) => {
        try {
            const result = await client.query("SELECT * FROM product WHERE quantity < 20");
            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Database error!" });
        }
    });

    router.get("/spe-offers", async (req, res) => {
        try {
            const result = await client.query("SELECT * FROM product WHERE discount != 0");
            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Database error!" });
        }
    });

    router.get("/on-sale", async (req, res) => {
        try {
            const result = await client.query("SELECT * FROM product WHERE discount != 0 LIMIT 3");
            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Database error!" });
        }
    });

    router.get("/all-products", async (req, res) => {
        try {
            const result = await client.query("SELECT * FROM product");
            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Database error!" });
        }
    });

    router.get("/shopside", async (req, res) => {
        const { category, brand, priceRange } = req.query;
        let query = "SELECT * FROM product WHERE 1=1";
        const values = [];
    
        if (category) {
            query += ` AND category = $${values.length + 1}`;
            values.push(category);
        }
        if (brand) {
            query += ` AND brand = $${values.length + 1}`;
            values.push(brand);
        }
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split("-");
            query += ` AND price BETWEEN $${values.length + 1} AND $${values.length + 2}`;
            values.push(minPrice, maxPrice); // Đảm bảo đúng thứ tự tham số
        }
    
        try {
            const result = await client.query(query, values);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Database error!" });
        }
    });

    router.get('/comments/:id', async (req, res) => {
        const { id } = req.params;
        try {
          const result = await client.query(
            'SELECT * FROM comments WHERE idpro = $1 ORDER BY created_at DESC',
            [id]
          );
          res.json(result.rows);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

    router.post('/addcomments', async (req, res) => {
    const { idpro, username, content } = req.body;
    console.log("Test", req.body);

    try {
        const result = await client.query('SELECT MAX(id_cmt) AS max_id FROM comments');
        const maxId = result.rows[0].max_id || 0; 
        const newId = maxId + 1;
    
        const insertResult = await client.query(
        'INSERT INTO comments (id_cmt, idpro, username, content, type, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
        [newId, idpro, username, content, "Product"]
        );
    
        res.status(201).json(insertResult.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

    router.delete('/comments/delete/:id', async (req, res) => {
        const { id } = req.params;

        try {
          const result = await client.query('DELETE FROM comments WHERE id_cmt = $1 RETURNING *', [id]);
          if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Comment not found' });
          }
          res.status(200).json({ message: 'Comment deleted successfully!' });
        } catch (error) {
          console.error("Database Error:", error);
          res.status(500).json({ error: 'Database error!' });
        }
      });
    
    return router;
};
