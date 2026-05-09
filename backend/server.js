import express from "express";
import cors from "cors";
import db from "./db.js";
import multer from "multer";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// ================== UPLOAD CONFIG ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// akses folder uploads
app.use("/uploads", express.static("uploads"));

/* =================================================
   AUTH
================================================= */

app.post("/daftar", (req, res) => {
  const { fullName, username, email, password } = req.body;

  const sql =
    "INSERT INTO users (fullName, username, email, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [fullName, username, email, password], (err) => {
    if (err) return res.status(500).json({ message: "Register gagal" });
    res.json({ message: "Register sukses" });
  });
});

app.post("/masuk", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error login" });
      if (result.length === 0) return res.json({ Masuk: false });

      res.json({ Masuk: true, user: result[0] });
    }
  );
});

/* =================================================
   UPDATE PROFILE (FIX TOTAL)
================================================= */

app.put("/users/:id", upload.single("photo"), (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  let fields = [];
  let values = [];

  // wajib update
  fields.push("username=?");
  values.push(username);

  fields.push("email=?");
  values.push(email);

  // password optional
  if (password && password.trim() !== "") {
    fields.push("password=?");
    values.push(password);
  }

  // foto optional
  if (req.file) {
    fields.push("photo=?");
    values.push(req.file.filename);
  }

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id=?`;
  values.push(userId);

  db.query(sql, values, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Gagal update profil",
      });
    }

    res.json({
      message: "Profile updated successfully",
      photo: req.file ? req.file.filename : null,
    });
  });
});

/* =================================================
   WALLET
================================================= */

app.get("/wallets/:userId", (req, res) => {
  db.query(
    "SELECT * FROM wallets WHERE user_id=? ORDER BY id ASC",
    [req.params.userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error ambil wallet" });
      res.json(result);
    }
  );
});

app.post("/wallets", (req, res) => {
  const { user_id, name, balance } = req.body;

  if (!user_id || !name)
    return res.status(400).json({ message: "Data tidak lengkap" });

  db.query(
    "INSERT INTO wallets (user_id,name,balance) VALUES (?,?,?)",
    [user_id, name, balance || 0],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal tambah wallet" });
      res.json({ message: "Wallet ditambah" });
    }
  );
});

app.put("/wallets/:id", (req, res) => {
  const { name, balance } = req.body;

  db.query(
    "UPDATE wallets SET name=?, balance=? WHERE id=?",
    [name, balance, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal update wallet" });
      res.json({ message: "Wallet update" });
    }
  );
});

app.delete("/wallets/:id", (req, res) => {
  db.query("DELETE FROM wallets WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal delete wallet" });
    res.json({ message: "Wallet delete" });
  });
});

/* =================================================
   BUDGET (FIX FORMAT ANGKA)
================================================= */

app.post("/budget", (req, res) => {
  let { user_id, month, year, nominal } = req.body;

  // 🔥 FIX angka format indonesia
  nominal = Number(String(nominal).replace(/\./g, ""));

  const sql = `
    INSERT INTO budget (user_id, month, year, nominal)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE nominal=VALUES(nominal)
  `;

  db.query(sql, [user_id, month, year, nominal || 0], (err) => {
    if (err) return res.status(500).json({ message: "Gagal simpan budget" });
    res.json({ message: "Budget saved" });
  });
});

app.get("/budget/:userId/:month/:year", (req, res) => {
  const { userId, month, year } = req.params;

  db.query(
    "SELECT nominal FROM budget WHERE user_id=? AND month=? AND year=?",
    [userId, month, year],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error ambil budget" });
      res.json(result[0] || { nominal: 0 });
    }
  );
});

/* =================================================
   TRANSACTIONS (FIX ANGKA)
================================================= */

app.post("/transactions", (req, res) => {
  let { user_id, wallet_id, type, amount, note, date } = req.body;

  if (!user_id || !wallet_id || !type || !amount || !date)
    return res.status(400).json({ message: "Data transaksi tidak lengkap" });

  amount = Number(String(amount).replace(/\./g, ""));

  db.query(
    "SELECT * FROM wallets WHERE id=? AND user_id=?",
    [wallet_id, user_id],
    (err, walletResult) => {
      if (err)
        return res.status(500).json({ message: "Error cek wallet" });

      if (walletResult.length === 0)
        return res.status(400).json({ message: "Wallet tidak ditemukan" });

      const insertSql = `
        INSERT INTO transactions (user_id,wallet_id,type,amount,note,date)
        VALUES (?,?,?,?,?,?)
      `;

      db.query(
        insertSql,
        [user_id, wallet_id, type, amount, note || "", date],
        (err2) => {
          if (err2)
            return res.status(500).json({ message: "Gagal tambah transaksi" });

          if (type === "income") {
            db.query(
              "UPDATE wallets SET balance=balance+? WHERE id=?",
              [amount, wallet_id],
              () => res.json({ message: "Income berhasil" })
            );
          } else {
            res.json({ message: "Expense berhasil" });
          }
        }
      );
    }
  );
});

app.get("/transactions/:userId", (req, res) => {
  const sql = `
    SELECT t.*, w.name AS wallet_name
    FROM transactions t
    JOIN wallets w ON w.id=t.wallet_id
    WHERE t.user_id=?
    ORDER BY t.date DESC
  `;

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error ambil transaksi" });
    res.json(result);
  });
});

/* =================================================
   REKAP HARI INI
================================================= */

app.get("/rekap/hariini/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT t.*, w.name AS wallet_name
    FROM transactions t
    JOIN wallets w ON w.id = t.wallet_id
    WHERE t.user_id = ?
    AND DATE(t.date) = CURDATE()
    ORDER BY t.date DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error rekap hari ini" });

    const income = result
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + Number(b.amount), 0);

    const expense = result
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + Number(b.amount), 0);

    res.json({ income, expense, data: result });
  });
});

/* =================================================
   REKAP BULANAN
================================================= */

app.get("/rekap/bulanan/:userId/:month/:year", (req, res) => {
  const { userId, month, year } = req.params;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const sql = `
    SELECT t.*, w.name AS wallet_name
    FROM transactions t
    JOIN wallets w ON w.id = t.wallet_id
    WHERE t.user_id = ?
    AND t.date >= ?
    AND t.date < ?
    ORDER BY t.date DESC
  `;

  db.query(sql, [userId, startDate, endDate], (err, result) => {
    if (err) return res.status(500).json({ message: "Error rekap bulanan" });

    const income = result
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + Number(b.amount), 0);

    const expense = result
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + Number(b.amount), 0);

    res.json({ income, expense, data: result });
  });
});

/* =================================================
   REKAP TAHUNAN
================================================= */

app.get("/rekap/tahunan/:userId/:year", (req, res) => {
  const { userId, year } = req.params;

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(parseInt(year) + 1, 0, 1);

  const sql = `
    SELECT t.*, w.name AS wallet_name
    FROM transactions t
    JOIN wallets w ON w.id = t.wallet_id
    WHERE t.user_id = ?
    AND t.date >= ?
    AND t.date < ?
    ORDER BY t.date DESC
  `;

  db.query(sql, [userId, startDate, endDate], (err, result) => {
    if (err) return res.status(500).json({ message: "Error rekap tahunan" });

    const income = result
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + Number(b.amount), 0);

    const expense = result
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + Number(b.amount), 0);

    res.json({ income, expense, data: result });
  });
});

/* ================================================= */

/* =================================================
   CONTACT (HUBUNGI KAMI)
================================================= */

app.post("/contact", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const sql = `
    INSERT INTO contacts (name, email, phone, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone || "", message], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Gagal kirim pesan" });
    }

    res.json({ message: "Pesan berhasil dikirim" });
  });
});

/* =================================================
   UPDATE PASSWORD (PRIVASI & KEAMANAN)
================================================= */
app.put("/change-password/:id", (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  db.query(
    "SELECT password FROM users WHERE id=?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error server" });

      if (result.length === 0)
        return res.status(404).json({ message: "User tidak ditemukan" });

      if (result[0].password !== oldPassword)
        return res.status(400).json({ message: "Password lama salah" });

      db.query(
        "UPDATE users SET password=? WHERE id=?",
        [newPassword, userId],
        (err2) => {
          if (err2)
            return res.status(500).json({ message: "Gagal update password" });

          res.json({ message: "Password berhasil diubah" });
        }
      );
    }
  );
});

/* =================================================
   HAPUS AKUN (PRIVASI & KEMANANAN)
================================================= */

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM users WHERE id=?", [userId], (err) => {
    if (err) return res.status(500).json({ message: "Gagal hapus akun" });

    res.json({ message: "Akun berhasil dihapus" });
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on ${PORT}`);
});