const express = require("express");
const path = require("path");

module.exports = (client) => {
    const router = express.Router(); 

    router.get("/all-categories", async (req, res) => {
        try {
          const result = await client.query("SELECT * FROM category ORDER BY id_cate ASC");
          res.status(200).json(result.rows);
        } catch (error) {
          console.error("Error fetching categories:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

    router.post("/add-category", async (req, res) => {
      const { name } = req.body;
    
      const maxIdResult = await client.query(`
          SELECT MAX(id_cate) AS max_id FROM category
      `);
      const maxId = maxIdResult.rows[0].max_id;
      let newIdCate;

      if (maxId) {
        const idNumber = parseInt(maxId) + 1;
        newIdCate = idNumber;
      } else {
        newIdCate = 1;
      }
      try {
        const query = "INSERT INTO category (id_cate, name, created_at) VALUES ($1, $2, NOW())";
        await client.query(query, [newIdCate, name]);
    
        res.status(200).json({ message: "Category added successfully!" });
      } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Failed to add category. Please try again." });
      }
    });

    router.put("/update-category/:id_cate", async (req, res) => {
      const { id_cate } = req.params;
      console.log("ID",req.params);
      const { name } = req.body;
    
      try {
        const query = "UPDATE category SET name = $1, updated_at = NOW() WHERE id_cate = $2";
        const result = await client.query(query, [name, id_cate]);
    
        if (result.rowCount === 0) {
          return res.status(404).json({ error: "Category not found." });
        }
    
        res.status(200).json({ message: "Category updated successfully!" });
      } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category. Please try again." });
      }
    });

    router.delete("/delete-category/:id", async (req, res) => {
      const { id } = req.params;
      try {
          const result = await client.query(`
              DELETE FROM category WHERE id_cate = $1 RETURNING *
          `, [id]);

          if (result.rowCount === 0) {
              return res.status(404).json({ error: "Category not found." });
          }

          res.status(200).json({ message: "Category deleted successfully." });
      } catch (error) {
          console.error("Error deleting Category:", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  });

    return router;
};
