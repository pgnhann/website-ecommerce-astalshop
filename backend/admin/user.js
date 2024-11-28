const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");

module.exports = (client) => {
    const router = express.Router(); 

    router.get("/all-customers", async (req, res) => {
      try {
        const result = await client.query(`
          SELECT u.fullname, u.email, u.phone, u.address, u.state, u.bio, l.provider
          FROM users u
          JOIN login l ON u.email = l.email
        `);
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    
    router.get("/all-staff", async (req, res) => {
      try {
        const result = await client.query(`
          SELECT s.id, s.id_staff, s.name, s.email, s.phone, s.sex, s.position
          FROM staff s
          JOIN login l ON s.email = l.email
          ORDER BY s.id ASC
        `);
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    router.get("/staff-info/:email", async (req, res) => {
      const { email } = req.params;

      try {
        const query = `
          SELECT * FROM staff WHERE email = $1
        `;
        const { rows } = await client.query(query, [email]);

        if (rows.length > 0) {
          res.status(200).json(rows[0]);
        } else {
          res.status(404).json({ message: "Staff not found" });
        }
      } catch (error) {
        console.error("Error fetching staff info:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    router.post("/add-staff", async (req, res) => {
      try {
        const { idstaff, name, email, phone, sex, position, password } = req.body;
        const role = position === "Manager" ? 1 : position === "Admin" ? 2 : 0;

        const maxIdResult = await client.query(`
          SELECT MAX(id) AS max_id FROM staff
        `);
        const maxId = maxIdResult.rows[0].max_id;
        const newIdStaff = maxId ? parseInt(maxId) + 1 : 1;
    
        const staffResult = await client.query(`
          INSERT INTO staff (id, id_staff, name, email, phone, sex, position, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          RETURNING *
        `, [newIdStaff, idstaff, name, email, phone, sex, position]);
    
        const hashedPassword = await bcrypt.hash(password, 10); 
        await client.query(`
          INSERT INTO login (email, passplain, password, role)
          VALUES ($1, $2, $3, $4)
        `, [email, password, hashedPassword, role]);
    
        res.status(201).json(staffResult.rows[0]);
      } catch (error) {
        console.error("Error adding staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    router.put("/update-staff/:id", async (req, res) => {
      try {
          const { id } = req.params; 
          const { idstaff, name, email, phone, sex, position } = req.body; 

          await client.query("BEGIN");
          const staffResult = await client.query(
              `UPDATE staff SET 
                  id_staff = $1,
                  name = $2,
                  email = $3,
                  phone = $4,
                  sex = $5,
                  position = $6
               WHERE id = $7 RETURNING *`,
              [idstaff, name, email, phone, sex, position, id]
          );
  
          if (staffResult.rowCount === 0) {
              await client.query("ROLLBACK");
              return res.status(404).json({ error: "Staff not found." });
          }
  
          if (position === "Manager") {
              const loginResult = await client.query(
                  `UPDATE login SET 
                      role = $1
                   WHERE email = $2`,
                  [2, email]
              );
  
              if (loginResult.rowCount === 0) {
                  await client.query("ROLLBACK");
                  return res.status(404).json({ error: "Login entry not found for the given email." });
              }
          }

          await client.query("COMMIT");
          res.status(200).json({ message: "Updated successfully!", staff: staffResult.rows[0] });
      } catch (error) {
          await client.query("ROLLBACK");
          console.error("Error updating staff:", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  });

  router.delete("/delete-staff/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const staffResult = await client.query(
        `SELECT email FROM staff WHERE id_staff = $1`,
        [id]
      );
      if (staffResult.rowCount === 0) {
        return res.status(404).json({ error: "Staff not found." });
      }
      const { email } = staffResult.rows[0];

      const deleteStaffResult = await client.query(
        `DELETE FROM staff WHERE id_staff = $1 RETURNING *`,
        [id]
      );
      if (deleteStaffResult.rowCount === 0) {
        return res.status(404).json({ error: "Failed to delete staff." });
      }
      await client.query(
        `DELETE FROM login WHERE email = $1`,
        [email]
      );
      res.status(200).json({ message: "Deleted successfully." });
    } catch (error) {
      console.error("Error deleting staff and login information:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.delete("/delete-customer/:email", async (req, res) => {
    const { email } = req.params;
    console.log("Test", req.params);

    try {
      await client.query("BEGIN");
      const deleteUserResult = await client.query(
        `DELETE FROM users WHERE email = $1 RETURNING *`,
        [email]
      );
  
      if (deleteUserResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Customer not found in users table." });
      }
  
      const deleteLoginResult = await client.query(
        `DELETE FROM login WHERE email = $1 RETURNING *`,
        [email]
      );
  
      if (deleteLoginResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Customer not found in login table." });
      }
  
      await client.query("COMMIT");
  
      res.status(200).json({ message: "Customer deleted successfully." });
    } catch (error) {
      console.error("Error deleting customer:", error);
      await client.query("ROLLBACK"); 
      res.status(500).json({ error: "Internal Server Error" });
    }
  });  
  
    return router;
};