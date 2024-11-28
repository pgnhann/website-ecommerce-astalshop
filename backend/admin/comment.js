const express = require("express");
const path = require("path");

module.exports = (client) => {
    const router = express.Router(); 

    router.get("/all-comments", async (req, res) => {
        try {
        const result = await client.query(`
            SELECT * FROM comments ORDER BY id_cmt ASC
        `);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.delete("/delete-comment/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await client.query(`DELETE FROM comments WHERE id_cmt = $1`, [id]);
            res.status(200).json({ message: "Comment deleted successfully" });
        } catch (error) {
            console.error("Error deleting comment:", error);
            res.status(500).json({ error: "Failed to delete comment" });
        }
    });    

    return router;
};