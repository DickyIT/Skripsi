import React, { useEffect, useState } from "react";
import axios from "axios";

function Hari() {
  const userId = Number(localStorage.getItem("userId"));

  // 🔥 URL BACKEND RAILWAY
  const API = import.meta.env.VITE_API_URL;

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [budget, setBudget] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  function formatDate(isoDate) {
    const date = new Date(isoDate);

    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  useEffect(() => {
    if (!userId) return;

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // 🔥 Fetch transaksi hari ini
    axios
      .get(`${API}/rekap/hariini/${userId}`)
      .then((response) => {
        const allData = response.data.data || [];

        const income = allData.filter((t) => t.type === "income");
        const expense = allData.filter((t) => t.type === "expense");

        setIncomeData(income);
        setExpenseData(expense);
        setTotalIncome(response.data.income || 0);
        setTotalExpense(response.data.expense || 0);
      })
      .catch((error) => {
        console.error("Error fetching rekap hari ini:", error);
      });

    // 🔥 Fetch expense bulanan
    axios
      .get(`${API}/rekap/bulanan/${userId}/${month}/${year}`)
      .then((res) => {
        setMonthlyExpense(res.data.expense || 0);
      })
      .catch((err) => console.error("Error fetch bulanan:", err));

    // 🔥 Fetch budget
    axios
      .get(`${API}/budget/${userId}/${month}/${year}`)
      .then((res) => {
        setBudget(res.data.nominal || 0);
      })
      .catch((err) => console.error("Error fetch budget:", err));
  }, [userId]);

  // 🔥 Hitung sisa budget
  useEffect(() => {
    setCurrentBalance(budget - monthlyExpense);
  }, [budget, monthlyExpense]);

  return (
    <section id="rekap1">
      <div className="container-rekap">

        <div className="saldo-container-rekap">
          <p className="saldo-title-rekap">Sisa Budget</p>

          <p className="saldo-amount-rekap">
            Rp. {currentBalance.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="transaction-summary-rekap">

          <div className="transaction-box-rekap">
            <p>Pengeluaran</p>

            <p style={{ color: "red" }}>
              Rp. {totalExpense.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="transaction-box-rekap">
            <p>Pemasukan</p>

            <p style={{ color: "green" }}>
              Rp. {totalIncome.toLocaleString("id-ID")}
            </p>
          </div>

        </div>
      </div>

      <h2>List Pemasukan Hari Ini</h2>

      <table className="table-hari">
        <thead>
          <tr>
            <th>Nama Dompet</th>
            <th>Nominal</th>
            <th>Catatan</th>
            <th>Tanggal</th>
          </tr>
        </thead>

        <tbody>
          {incomeData.map((item) => (
            <tr key={item.id}>
              <td>{item.wallet_name}</td>

              <td style={{ color: "green" }}>
                + {Number(item.amount).toLocaleString("id-ID")}
              </td>

              <td>{item.note}</td>

              <td>{formatDate(item.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>List Pengeluaran Hari Ini</h2>

      <table className="table-hari">
        <thead>
          <tr>
            <th>Nama Dompet</th>
            <th>Nominal</th>
            <th>Catatan</th>
            <th>Tanggal</th>
          </tr>
        </thead>

        <tbody>
          {expenseData.map((item) => (
            <tr key={item.id}>
              <td>{item.wallet_name}</td>

              <td style={{ color: "red" }}>
                - {Number(item.amount).toLocaleString("id-ID")}
              </td>

              <td>{item.note}</td>

              <td>{formatDate(item.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Hari;