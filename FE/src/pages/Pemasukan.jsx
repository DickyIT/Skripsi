import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Pemasukan() {

  // 🔥 URL BACKEND RAILWAY
  const API = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  const [nominal, setNominal] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [walletId, setWalletId] = useState("");
  const [wallets, setWallets] = useState([]);
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {

    fetch(`${API}/wallets/${userId}`)

      .then((res) => res.json())

      .then((data) => {

        setWallets(data);

        if (data.length > 0) {
          setWalletId(data[0].id);
        }

      })

      .catch((err) => console.error(err));

  }, [userId]);

  const formatRupiah = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const amount = parseInt(
      nominal.replace(/\./g, ""),
      10
    );

    if (!amount) {
      return alert("Nominal tidak valid");
    }

    try {

      const response = await fetch(
        `${API}/transactions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: userId,
            wallet_id: walletId,
            type: "income",
            amount: amount,
            note: notes,

            date: tanggal
              ? `${tanggal} ${new Date()
                  .toTimeString()
                  .slice(0, 8)}`
              : new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " "),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert("Pemasukan berhasil ditambahkan");

      navigate("/grafik", {
        state: { refresh: true },
      });

    } catch (err) {

      console.error(err);

      alert("Server error");

    }
  };

  return (
    <section id="pemasukan">

      {/* 🔥 BACK BUTTON */}
      <button
        className="btn-back-fixed"
        onClick={() => navigate(-1)}
      >
        ⬅
      </button>

      <div className="inputkelola-header-and-form">

        <h2>Pemasukan</h2>

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
                required
              />

            </div>

            <div className="inputkelola-form-group">

              <label>Pilih Dompet</label>

              <select
                value={walletId}
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

              <label>Asal Uang</label>

              <input
                value={source}
                onChange={(e) =>
                  setSource(e.target.value)
                }
                required
              />

            </div>

            <div className="inputkelola-form-group">

              <label>Nominal</label>

              <input
                value={nominal}
                onChange={(e) =>
                  setNominal(
                    formatRupiah(e.target.value)
                  )
                }
                required
              />

            </div>

            <div className="inputkelola-form-group inputkelola-full-width">

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Catatan"
              />

              <button className="btn-kelola">
                Simpan
              </button>

            </div>

          </form>

          <div className="inputkelola-illustration">

            <img
              src="/assets/images/pemasukan.png"
              alt=""
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Pemasukan;