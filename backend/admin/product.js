const express = require("express");
const path = require("path");
const fs = require("fs");
const fileUpload = require('express-fileupload');

module.exports = (client) => {
    const router = express.Router(); 
    router.use(fileUpload());

    router.get("/all-products", async (req, res) => {
        try {
        const result = await client.query(`
            SELECT * FROM product ORDER BY idpro ASC
        `);
        res.status(200).json(result.rows); 
        } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
        }
    }); 

    router.post("/add-product", async (req, res) => {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const file = req.files.image;
        const imagePath = path.join(__dirname, '../../public/images/pros', file.name);

        file.mv(imagePath, async (err) => {
            if (err) {
                console.error("Error moving file:", err);
                return res.status(500).json({ error: "Error saving image" });
            }
        
        try {
            const { namepro, category, price, quantity, description } = req.body;
            const maxIdResult = await client.query(`
                SELECT MAX(idpro) AS max_id FROM product
            `);
            const maxId = maxIdResult.rows[0].max_id;
            let new_idpro;
    
            if (maxId) {
                const idNumber = parseInt(maxId.substring(1)) + 1; 
                new_idpro = `P${String(idNumber).padStart(2, '0')}`; 
            } else {
                new_idpro = 'P01';
            }
    
            const result = await client.query(`
                INSERT INTO product (idpro, namepro, image, category, price, quantity, descr, date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                RETURNING *
            `, [new_idpro, namepro, file.name, category, price, quantity, description]);
    
            res.status(201).json(result.rows[0]); 
        } catch (error) {
            console.error("Error adding product:", error);
            res.status(500).json({ error: "Internal Server Error" });
            }
       });
    });

    router.put("/update-product/:id", async (req, res) => {
        try {
          const { id } = req.params;
          const { namepro, category, price, quantity, description } = req.body;
          let imageFileName = null;
      
          if (req.files && req.files.image) {
            const file = req.files.image;
            imageFileName = file.name;
            const imagePath = path.join(__dirname, "../../public/images/pros", imageFileName);
      
            file.mv(imagePath, (err) => {
              if (err) {
                console.error("Error saving image:", err);
                return res.status(500).json({ error: "Error saving image" });
              }
            });
          }
          await client.query(
            `UPDATE product SET 
              namepro = $1, 
              image = COALESCE($2, image),
              category = $3, 
              price = $4, 
              quantity = $5, 
              descr = $6,
              updated_at = NOW()
            WHERE idpro = $7`,
            [namepro, imageFileName, category, price, quantity, description, id]
          );
          res.status(200).json({ message: "Updated successfully!" });
        } catch (error) {
          console.error("Error updating product:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
      

    router.delete("/delete-product/:id", async (req, res) => {
        const { id } = req.params;

        try {
            const result = await client.query(`
                DELETE FROM product WHERE idpro = $1 RETURNING *
            `, [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Product not found." });
            }

            res.status(200).json({ message: "Product deleted successfully." });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    return router;
};
