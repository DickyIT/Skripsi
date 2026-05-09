import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "./Grafik.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

function Grafik() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    budget: 0,
    remaining: 0,
  });

  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  /* ================= UTIL ================= */
  const toNumber = (val) =>
    parseInt(val?.toString().replace(/\./g, "")) || 0;

  const rupiah = (n) =>
    "Rp. " + toNumber(n).toLocaleString("id-ID");

  /* ================= PINDAH BULAN ================= */
  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  /* ================= FETCH DATA ================= */
  const fetchSummary = async () => {
    const m = currentMonth.getMonth() + 1;
    const y = currentMonth.getFullYear();

    try {
      const rekapRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/rekap/bulanan/${userId}/${m}/${y}`
      );

      const budgetRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/budget/${userId}/${m}/${y}`
      );

      const income = rekapRes.data.income || 0;
      const expense = rekapRes.data.expense || 0;
      const budget = budgetRes.data.nominal || 0;

      setSummary({
        income,
        expense,
        budget,
        remaining: budget - expense,
      });
    } catch (err) {
      console.error("Gagal fetch summary", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const trxRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/transactions/${userId}`
      );
      setTransactions(trxRes.data || []);
    } catch (err) {
      console.error("Gagal fetch transaksi", err);
    }
  };

  const fetchAllData = async () => {
    await fetchTransactions();
    await fetchSummary();
  };

  useEffect(() => {
    if (userId) fetchAllData();
  }, [currentMonth, userId]);

  // 🔥 Auto refresh jika kembali dari tambah transaksi
  useEffect(() => {
    if (location.state?.refresh) {
      fetchAllData();
    }
  }, [location.state]);

  /* ================= SIMPAN BUDGET ================= */
  const saveBudget = async () => {
    const m = currentMonth.getMonth() + 1;
    const y = currentMonth.getFullYear();
    const nominal = parseInt(budgetInput.replace(/\./g, ""));

    if (!nominal) {
      alert("Masukkan nominal valid");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/budget`, {
        user_id: userId,
        month: m,
        year: y,
        nominal,
      });

      setBudgetInput("");
      setShowBudgetForm(false);
      fetchAllData();
    } catch (err) {
      console.error("Gagal simpan budget", err);
    }
  };

  /* ================= FILTER BULAN ================= */
  const filterByMonth = (data) => {
    const m = currentMonth.getMonth();
    const y = currentMonth.getFullYear();

    return data.filter((item) => {
      const d = new Date(item.date);
      return d.getMonth() === m && d.getFullYear() === y;
    });
  };

  const trxBulanan = filterByMonth(transactions);
  const pemasukan = trxBulanan.filter((t) => t.type === "income");
  const pengeluaran = trxBulanan.filter((t) => t.type === "expense");

  /* ================= GROUP PER 6 HARI ================= */
  const group = (data) => {
    const result = [0, 0, 0, 0, 0];

    data.forEach((item) => {
      const day = new Date(item.date).getDate();
      const amt = toNumber(item.amount);
      const idx = Math.min(Math.floor((day - 1) / 6), 4);
      result[idx] += amt;
    });

    return result;
  };

  const weeklyIncome = group(pemasukan);
  const weeklyExpense = group(pengeluaran);

  let sisa = summary.budget;
  const weeklySisa = weeklyExpense.map((e) => {
    sisa -= e;
    return sisa > 0 ? sisa : 0;
  });

  const createDataset = (data) => ({
    labels: ["1-6", "7-12", "13-18", "19-24", "25-30"],
    datasets: [
      {
        data,
        backgroundColor: "#5b21b6",
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <section id="kelolaGrafik">

      <div className="kelola-summary">
        <div className="month-switch">
          <button onClick={prevMonth}>◀</button>

          <span>
            {currentMonth.toLocaleString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button onClick={nextMonth}>▶</button>
        </div>

        <h2
          className="nominal-budget"
          style={{ color: summary.remaining < 0 ? "red" : "#16a34a" }}
        >
          {rupiah(summary.remaining)}
        </h2>

        {summary.remaining < 0 && (
          <p style={{ color: "red", fontWeight: "bold", marginTop: "5px" }}>
            ⚠ Melebihi budget!
          </p>
        )}

        <button onClick={() => setShowBudgetForm(true)}>
          Ubah Budget
        </button>
      </div>

      <div className="chart-grid">

        <div className="chart-box">
          <div className="chart-canvas">
            <Bar data={createDataset(weeklyIncome)} options={chartOptions} />
          </div>
          <p className="chart-label">Pemasukan</p>
        </div>

        <div className="chart-box">
          <div className="chart-canvas">
            <Bar data={createDataset(weeklySisa)} options={chartOptions} />
          </div>
          <p className="chart-label">Sisa Budget</p>
        </div>

        <div className="chart-box">
          <div className="chart-canvas">
            <Bar data={createDataset(weeklyExpense)} options={chartOptions} />
          </div>
          <p className="chart-label">Pengeluaran</p>
        </div>

      </div>

      <button onClick={() => setIsPopupVisible(true)}>
        + TAMBAH CATATAN
      </button>

      {/* Popup Tambah Catatan */}
      {isPopupVisible && (
        <div className="budget-overlay">
          <div className="budget-modal">
            <h3>Pilih Jenis Catatan</h3>

            <div className="budget-buttons">
              <button
                className="btn-save"
                onClick={() => navigate("/pemasukan")}
              >
                Pemasukan
              </button>

              <button
                className="btn-save"
                onClick={() => navigate("/pengeluaran")}
              >
                Pengeluaran
              </button>
            </div>

            <div style={{ marginTop: "15px" }}>
              <button
                className="btn-cancel"
                onClick={() => setIsPopupVisible(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Ubah Budget */}
      {showBudgetForm && (
        <div className="budget-overlay">
          <div className="budget-modal">
            <h3>Ubah Budget</h3>

            <input
              type="text"
              placeholder="Masukkan nominal"
              value={budgetInput}
              onChange={(e) =>
                setBudgetInput(
                  e.target.value
                    .replace(/\D/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                )
              }
            />

            <div className="budget-buttons">
              <button
                className="btn-cancel"
                onClick={() => setShowBudgetForm(false)}
              >
                Batal
              </button>

              <button
                className="btn-save"
                onClick={saveBudget}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <Link to="/rekap">Cek Rekap</Link>
    </section>
  );
}

export default Grafik;