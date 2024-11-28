const express = require("express");
const path = require("path");

module.exports = (client) => {
    const router = express.Router(); 

    router.get("/all-journals", async (req, res) => {
        try {
        const result = await client.query(`
            SELECT * FROM journal ORDER BY id_jour ASC
        `);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post("/add-journal", async (req, res) => {
        try {
          const { title, content, content1, content2 } = req.body;
          const maxIdResult = await client.query(`
              SELECT MAX(id_jour) AS max_id FROM journal
          `);
          const maxId = maxIdResult.rows[0].max_id;
          let newIdJour;
      
          if (maxId) {
            const idNumber = parseInt(maxId) + 1;
            newIdJour = idNumber;
          } else {
            newIdJour = 1;
          }
      
          const result = await client.query(`
              INSERT INTO journal (id_jour, title, content, content1, content2, created_at)
              VALUES ($1, $2, $3, $4, $5, NOW())
              RETURNING *
          `, [newIdJour, title, content, content1, content2]);
      
          res.status(201).json(result.rows[0]); 
        } catch (error) {
          console.error("Error adding journal:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

      router.put("/update-journal/:id", async (req, res) => {
        try {
            const { id } = req.params;
            console.log("ID", id);
            const { title, content, content1, content2 } = req.body;

            const result = await client.query(
                `UPDATE journal SET 
                    title = $1, 
                    content = $2, 
                    content1 = $3, 
                    content2 = $4,
                    updated_at = NOW() 
                WHERE id_jour = $5 RETURNING *`,
                [title, content, content1, content2, id]
            );
    
            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Journal not found." });
            }
    
            res.status(200).json({ message: "Updated successfully!", journal: result.rows[0] });
        } catch (error) {
            console.error("Error updating journal:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.delete("/delete-journal/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const result = await client.query(`
                DELETE FROM journal WHERE id_jour = $1 RETURNING *
            `, [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Journal not found." });
            }

            res.status(200).json({ message: "Journal deleted successfully." });
        } catch (error) {
            console.error("Error deleting journal:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });


    return router;
};
