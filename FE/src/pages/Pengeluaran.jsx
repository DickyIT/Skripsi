import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Pengeluaran() {

  // 🔥 URL BACKEND RAILWAY
  const API = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  const [nominal, setNominal] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [walletId, setWalletId] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [kebutuhan, setKebutuhan] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {

    if (!userId) return;

    fetch(`${API}/wallets/${userId}`)

      .then((res) => res.json())

      .then((data) => {

        setWallets(data);

        if (data.length > 0) {
          setWalletId(data[0].id);
        }

      })

      .catch((err) =>
        console.error("Error fetch wallet:", err)
      );

  }, [userId]);

  const formatRupiah = (value) => {

    let numberString = value.replace(/\D/g, "");

    return numberString.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );

  };

  const handleNominalChange = (e) => {
    setNominal(formatRupiah(e.target.value));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!walletId) {

      alert(
        "Wallet belum tersedia. Tambahkan wallet dulu."
      );

      return;
    }

    const expenseAmount = parseInt(
      nominal.replace(/\./g, ""),
      10
    );

    if (
      isNaN(expenseAmount) ||
      expenseAmount <= 0
    ) {

      alert("Nominal tidak valid!");

      return;

    }

    const finalDate = tanggal
      ? `${tanggal} ${new Date()
          .toTimeString()
          .slice(0, 8)}`
      : new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

    const dataKirim = {
      user_id: userId,
      wallet_id: walletId,
      type: "expense",
      amount: expenseAmount,
      note: catatan || "",
      date: finalDate,
    };

    console.log("DATA DIKIRIM:", dataKirim);

    try {

      const response = await fetch(
        `${API}/transactions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(dataKirim),
        }
      );

      const result = await response.json();

      if (!response.ok) {

        alert(
          result.message ||
            "Gagal tambah transaksi"
        );

        return;

      }

      alert("Transaksi berhasil!");

      navigate("/grafik", {
        state: { refresh: true },
      });

    } catch (err) {

      console.error(err);

      alert("Server error");

    }
  };

  return (
    <section id="pengeluaran">

      {/* 🔥 BACK BUTTON */}
      <button
        className="btn-back-fixed"
        onClick={() => navigate(-1)}
      >
        ⬅
      </button>

      <div className="inputkelola-header-and-form">

        <h2>Pengeluaran</h2>

        <div className="inputkelola-form-and-illustration">

          <form onSubmit={handleSubmit}>

            <div className="inputkelola-form-group">

              <label>Tanggal</label>

              <input
                type="date"
                value={tanggal}
                onChange={(e) =>
                  setTanggal(e.target.value)
                }
              />

            </div>

            <div className="inputkelola-form-group">

              <label>Pilih Dompet</label>

              <select
                value={walletId || ""}
                onChange={(e) =>
                  setWalletId(Number(e.target.value))
                }
                required
              >

                {wallets.map((wallet) => (
                  <option
                    key={wallet.id}
                    value={wallet.id}
                  >
                    {wallet.name}
                  </option>
                ))}

              </select>

            </div>

            <div className="inputkelola-form-group">

              <label>Kebutuhan</label>

              <input
                type="text"
                value={kebutuhan}
                onChange={(e) =>
                  setKebutuhan(e.target.value)
                }
                required
              />

            </div>

            <div className="inputkelola-form-group">

              <label>Nominal</label>

              <input
                type="text"
                value={nominal}
                onChange={handleNominalChange}
                required
              />

            </div>

            <div className="inputkelola-form-group inputkelola-full-width">

              <textarea
                value={catatan}
                onChange={(e) =>
                  setCatatan(e.target.value)
                }
                placeholder="Catatan"
              />

              <button
                className="btn-kelola"
                type="submit"
              >
                Simpan
              </button>

            </div>

          </form>

          <div className="inputkelola-illustration">

            <img
              src="/assets/images/pengeluaran.png"
              alt=""
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Pengeluaran;