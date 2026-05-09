import React, { useState, useEffect } from "react";
import axios from "axios";

function Dompet() {

  const userId = localStorage.getItem("userId");

  const [wallets, setWallets] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newWalletName, setNewWalletName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  /* ================= FETCH ================= */
  const fetchWallets = async () => {
    if (!userId) return;

    const res = await axios.get(`http://localhost:8081/wallets/${userId}`);
    setWallets(res.data);
  };

  useEffect(() => {
    fetchWallets();
  }, [userId]);

  /* ================= FORMAT ================= */
  const formatRupiah = (angka) =>
    angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setNewAmount(formatRupiah(val));
  };

  /* ================= OPEN FORM ================= */
  const bukaForm = (wallet = null) => {
    setIsFormVisible(true);

    if (wallet) {
      setEditingId(wallet.id);
      setNewWalletName(wallet.name);
      setNewAmount(formatRupiah(wallet.balance));
    } else {
      setEditingId(null);
      setNewWalletName("");
      setNewAmount("");
    }
  };

  const tutupForm = () => {
    setIsFormVisible(false);
  };

  /* ================= SAVE ================= */
  const simpanWallet = async () => {

    const amount = parseInt(newAmount.replace(/\./g, ""), 10);

    if (editingId) {
      await axios.put(`http://localhost:8081/wallets/${editingId}`, {
        name: newWalletName,
        balance: amount,
      });
    } else {
      await axios.post("http://localhost:8081/wallets", {
        user_id: userId,
        name: newWalletName,
        balance: amount,
      });
    }

    fetchWallets();
    tutupForm();
  };

  /* ================= DELETE ================= */
  const hapusWallet = async (id) => {
    if (!window.confirm("Hapus dompet ini?")) return;

    await axios.delete(`http://localhost:8081/wallets/${id}`);
    fetchWallets();
  };

  /* ================= UI ================= */
  return (
    <section>
      <div
        className="containersaldo"
        style={{
          padding: "20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >

        <div
          className="saldo"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "20px",
            borderRadius: "12px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <h2>Saldo Anda</h2>

          <p
            style={{
              wordBreak: "break-word",
              fontSize: "clamp(20px, 5vw, 36px)",
            }}
          >
            Rp{" "}
            {wallets
              .reduce((t, w) => t + Number(w.balance), 0)
              .toLocaleString("id-ID")}
          </p>
        </div>

        <div
          className="daftar-dompet"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
          }}
        >
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="item-dompet"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                padding: "15px",
                borderRadius: "10px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  wordBreak: "break-word",
                  flex: 1,
                  minWidth: "120px",
                }}
              >
                {wallet.name}
              </span>

              <span
                style={{
                  wordBreak: "break-word",
                  minWidth: "120px",
                }}
              >
                Rp {Number(wallet.balance).toLocaleString("id-ID")}
              </span>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button onClick={() => bukaForm(wallet)}>✏️</button>
                <button onClick={() => hapusWallet(wallet.id)}>❌</button>
              </div>
            </div>
          ))}
        </div>

        <div
          className="tambah-dompet"
          onClick={() => bukaForm()}
          style={{
            marginTop: "20px",
            textAlign: "center",
            cursor: "pointer",
            fontSize: "32px",
          }}
        >
          +
        </div>
      </div>

      {isFormVisible && (
        <div
          className="wadah-form"
          style={{
            padding: "20px",
          }}
        >
          <div
            className="form"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              maxWidth: "400px",
              margin: "auto",
            }}
          >
            <input
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
              placeholder="Nama dompet"
            />

            <input
              value={newAmount}
              onChange={handleAmountChange}
              placeholder="Nominal"
            />

            <button onClick={simpanWallet}>Simpan</button>
            <button onClick={tutupForm}>Batal</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dompet;