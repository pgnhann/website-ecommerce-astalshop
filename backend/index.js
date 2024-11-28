const express = require("express");
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const cors = require("cors");
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser');
const axios = require("axios");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,
}));

const client = new Client({
    user: 'postgres',          
    host: 'localhost',         
    database: 'astaldb',      
    password: 'magicalpostgre', 
    port: 5432, 
});

client.connect().then(() => console.log("Connected to database")).catch(err => console.error("Database connection error:", err));

app.use(session({
    secret: 'astalkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const productRoutes = require("./product")(client);
app.use("/products", productRoutes);

const serviceRoutes = require('./service')(client);
app.use('/services', serviceRoutes); 

/*-------------------ADMIN-BACKEND------------------*/
const adProductRoutes = require('./admin/product')(client);
app.use('/admin', adProductRoutes); 

const adOrderRoutes = require('./admin/order')(client);
app.use('/admin', adOrderRoutes); 

const adUserRoutes = require('./admin/user')(client);
app.use('/admin', adUserRoutes); 

const adJourRoutes = require('./admin/journal')(client);
app.use('/admin', adJourRoutes); 

const adCmtRoutes = require('./admin/comment')(client);
app.use('/admin', adCmtRoutes); 

const adCateRoutes = require('./admin/category')(client);
app.use('/admin', adCateRoutes); 

/*---------------------SIGN-IN---------------------*/
app.post("/signin", async (req, res) => {
    const { email, password, rememberMe } = req.body;
    try {
        const userResult = await client.query("SELECT * FROM login WHERE email = $1", [email]);
        const role = userResult.rows[0]?.role;
        let errors = {};

        if (userResult.rows.length === 0) {
            errors.email = "Invalid email!";
        } else {
            const hashedPassword = userResult.rows[0].password;
            const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

            if (!isPasswordMatch) {
                errors.password = "Invalid password!";
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const tokenPayload = { id: userResult.rows[0].id, email: userResult.rows[0].email };
        const token = jwt.sign(tokenPayload, "astalkey", {
            expiresIn: rememberMe ? "7d" : "1h"
        });

        res.cookie("auth_token", token, {
            httpOnly: true,
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000 
        });

        let fullname = null;
        if (role == 0) {
            const fullnameResult = await client.query("SELECT fullname FROM users WHERE email = $1", [email]);
            fullname = fullnameResult.rows[0]?.fullname;
        } else if (role == 1 || role == 2) {
            const fullnameResult = await client.query("SELECT name FROM staff WHERE email = $1", [email]);
            fullname = fullnameResult.rows[0]?.name;
        }

        if (!fullname) {
            return res.status(400).json({ error: "Fullname not found for the given role!" });
        }

        res.status(200).json({ message: "Login successful!", fullname, email, role });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database error!" });
    }
});


/*---------------------USERINFO---------------------*/
app.post("/userinfo", async (req, res) => {
    const { email } = req.body; 

    if (!email) {
      return res.status(400).json({ error: "Email not provided!" });
    }
  
    try {
      const userInfoResult = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
  
      if (userInfoResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found!" });
      }
  
      res.status(200).json(userInfoResult.rows[0]);
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ error: "Database error!" });
    }
  });
  
/*---------------SAVE-USERINFO--------------------*/
app.put("/saveuser", async (req, res) => {
    const { email, fullname, phone, address, state, bio } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required!" });
    }
  
    try {
      const updateUserQuery = `
        UPDATE users
        SET fullname = $1, phone = $2, address = $3, state = $4, bio = $5
        WHERE email = $6
        RETURNING *;
      `;
      const result = await client.query(updateUserQuery, [fullname, phone, address, state, bio, email]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found!" });
      }
  
      res.status(200).json({ message: "User updated successfully!", user: result.rows[0] });
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ error: "Database error!" });
    }
  });
  
/*--------------FORGOT-PASSWORD------------------*/
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await client.query('SELECT * FROM login WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'This email is not registered!' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        await client.query('UPDATE login SET otp = $1, otp_expire = $2 WHERE email = $3', [otp, Date.now() + 300000, email]); 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'astalshop2021@gmail.com',  
                pass: 'fjeglkpxefikuvug',  
            },
        });
        const mailOptions = {
            from: 'astalshop2021@gmail.com',
            to: email,
            subject: 'Reset Password OTP from Astal Shop!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Reset Password to Sign In for Astal Shop!</h2>
                    <h3 style="color: #007BFF;">Your OTP Code: <strong>${otp}</strong></h3>
                    <p style="color: #555;">This code is valid for <strong>5 minutes</strong>.</p>
                    <p style="color: #555;">If you did not request this, please ignore this email.</p>
                    <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Astal Shop. All rights reserved.</p>
                </div>
            `};
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent. Please check your inbox!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/*-------------------------VERIFY-OTP------------------------------*/
app.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    try {
        const result = await client.query('SELECT * FROM login WHERE otp = $1', [otp]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid OTP!' });
        }
        const user = result.rows[0];
        if (user.otp_expire < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired!' });
        }
        await client.query('UPDATE login SET otp = NULL, otp_expire = NULL WHERE otp = $1', [otp]);
        res.json({ message: 'OTP verified successfully! You can now reset your password.' });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: 'Server error!' });
    }
});

/*-------------------------RESET-PASSWORD---------------------------*/
app.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await client.query("SELECT * FROM login WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Email not found!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query(
            "UPDATE login SET passplain = $1, password = $2 WHERE email = $3",
            [password, hashedPassword, email]
        );
        res.json({ message: "Password has been reset successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
});


/*----------------------------SIGN UP-------------------------------*/
app.post("/signup", async (req, res) => {
    const { name, email, phone, password, state, address } = req.body;

    try {
        await client.query("BEGIN"); 

        const userCheck = await client.query("SELECT * FROM login WHERE email = $1", [email]);
        if (userCheck.rows.length > 0) {
            await client.query("ROLLBACK"); 
            return res.status(400).json({ error: "Email already in use!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        await client.query(
            "INSERT INTO login (email, passplain, password) VALUES ($1, $2, $3)",
            [email, password, hashedPassword]
        );

        await client.query(
            "INSERT INTO users (fullname, email, phone, address, state) VALUES ($1, $2, $3, $4, $5)",
            [name, email, phone, address, state]
        );

        await client.query("COMMIT");

        res.status(201).json({ message: "Register successful!" });
    } catch (error) {
        await client.query("ROLLBACK"); 
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database error!" });
    }
});

/*---------------------LOGOUT---------------------*/
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Failed to logout!" });
        }
        res.clearCookie("auth_token");
        res.clearCookie("connect.sid"); 
        res.status(200).json({ message: "Logout successful!" });
    });
});

/*-------------------------CONTACT-MAIL-------------------------------*/
app.post('/send-email', async (req, res) => {
    const { clientName, email, messages } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'astalshop2021@gmail.com',  
            pass: 'fjeglkpxefikuvug',  
        },
    });

    const mailOptions = {
        from: 'astalshop2021@gmail.com',
        to: 'astalshop2021@gmail.com',  
        subject: 'Contact from Client!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">New Contact Messages from Astal Shop!</h2>
                <p style="color: #555;">You have received a new message from a client:</p>
                <p style="color: #555;"><strong>Name:</strong> ${clientName}</p>
                <p style="color: #555;"><strong>Email:</strong> ${email}</p>
                <p style="color: #555;"><strong>Message:</strong></p>
                <p style="color: #555;">${messages}</p>
                <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Astal Shop. All rights reserved.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
    }
});

/*---------------------------SEARCH-BAR---------------------------*/
app.get('/search', async (req, res) => {  // Cập nhật đường dẫn trùng khớp
    const searchQuery = req.query.query;  
    try {
        const products = await client.query(  
            `SELECT * FROM product WHERE namepro ILIKE $1`, [`${searchQuery}%`]
        );

        console.log("Products found:", products.rows); 
        res.json(products.rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database error!" });
    }
});

/*---------------------------JOURNAL----------------------------*/
app.get('/journal', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT j.*, COUNT(c.id_cmt) AS comment_count
            FROM journal j
            LEFT JOIN comments c ON j.id_jour = c.id_jour
            GROUP BY j.id_jour
            ORDER BY j.created_at DESC
        `);
        res.json(result.rows); 
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: 'Database error!' });
    }
});

app.get('/journal/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await client.query('SELECT * FROM journal WHERE id_jour = $1', [id]);
      
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'Journal not found' });
      }
      
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ error: 'Database error!' });
    }
});

// Thêm bình luận
app.post('/journal/addcomments', async (req, res) => {
    const { id_jour, username, content } = req.body;
    try {
      const result = await client.query('SELECT MAX(id_cmt) AS max_id FROM comments');
      const maxId = result.rows[0].max_id || 0; 
      const newId = maxId + 1;

      const insertResult = await client.query(
        'INSERT INTO comments (id_cmt, id_jour, username, content, type, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
        [newId, id_jour, username, content, "Journal"]
      );
  
      res.status(201).json(insertResult.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/journal/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await client.query(
        'SELECT * FROM comments WHERE id_jour = $1 ORDER BY created_at DESC',
        [id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

    app.delete('/journal/comments/delete/:id', async (req, res) => {
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

  
/*------------------ORDER--------------------*/
app.post("/placeorder", async (req, res) => {
    const { name, email, address, phone, subtotal, totalamount, paymethod, shipcost, note, products } = req.body;
    try {
        await client.query("BEGIN");

        const orderResult = await client.query("SELECT id_od FROM orders ORDER BY id_od DESC LIMIT 1");
        const newOrderId = orderResult.rows.length
            ? `O${(parseInt(orderResult.rows[0].id_od.slice(1)) + 1).toString().padStart(2, "0")}`
            : "O01";

        const insertOrderQuery = `
            INSERT INTO orders (id_od, name, address, email, phone, subtotal, totalamount, paymethod, shipcost, note, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        `;
        await client.query(insertOrderQuery, [
            newOrderId,
            name,
            address,
            email,
            phone,
            subtotal,
            totalamount,
            paymethod,
            shipcost,
            note
        ]);

        const orderDetailResult = await client.query("SELECT id_odd FROM orderdetails ORDER BY id_odd DESC LIMIT 1");
        let lastDetailId = orderDetailResult.rows.length
            ? parseInt(orderDetailResult.rows[0].id_odd.slice(2))
            : 0;

        const insertOrderDetailQuery = `
            INSERT INTO orderdetails (id_odd, id_od, namepro, price_ori, price_afvou, quantity)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        for (const product of products) {
            const newOrderDetailId = `OD${(++lastDetailId).toString().padStart(2, "0")}`;
            await client.query(insertOrderDetailQuery, [
                newOrderDetailId,
                newOrderId,
                product.namepro,
                product.price_ori,
                product.price_afvou,
                product.quantity
            ]);
        }

        await client.query("COMMIT");

        await axios.post("http://localhost:5000/send-order-email", {
            email,
            name,
            totalamount,
            products,
            address,
            phone,
            paymethod,
            shipcost,
        });

        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to place order!" });
    }
});


/*---------------------SEND-ORDER-EMAIL------------------------*/
app.post("/send-order-email", async (req, res) => {
    const { email, name, totalamount, products, address, phone, paymethod, shipcost } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "astalshop2021@gmail.com",
            pass: "fjeglkpxefikuvug",
        },
    });

    const productDetails = products.map((product, index) => `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${product.namepro}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${product.quantity}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${product.price_ori}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${product.price_afvou}</td>
        </tr>
    `).join("");

    const mailOptions = {
        from: "astalshop2021@gmail.com",
        to: email, 
        subject: "Your Order Confirmation - Astal Shop!",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">Thank You for Your Order, ${name}!</h2>
                <p style="color: #555;">Here are the details of your order:</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Payment Method:</strong> ${paymethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleString('vi-VN')}</p>

                <h3 style="color: #333; text-align: center;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">#</th>
                            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Product Name</th>
                            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Quantity</th>
                            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Price</th>
                            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Price After Voucher</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productDetails}
                    </tbody>
                </table>
                <p><strong>Shipping Cost:</strong> $${shipcost}</p>
                <p><strong>Total Amount:</strong> $${totalamount}</p>

                <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Astal Shop. All rights reserved.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Order email sent successfully!" });
    } catch (error) {
        console.error("Error sending order email:", error);
        res.status(500).json({ error: "Error sending order email" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});