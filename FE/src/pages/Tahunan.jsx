import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Tahunan() {
  const userId = Number(localStorage.getItem("userId"));
  const [year, setYear] = useState(new Date().getFullYear());

  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];

  const initialMonths = months.map((m) => ({
    month: m,
    totalIncome: 0,
    totalExpense: 0,
    surplus: 0,
  }));

  const [monthlyData, setMonthlyData] = useState(initialMonths);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // ✅ FIX: useEffect dirapihin + conflict dihapus
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8081/rekap/tahunan/${userId}/${year}`)
      .then((res) => {
        const transactions = res.data.data || [];

        const monthSummary = months.map((month, index) => {
          const monthNumber = index + 1;

          const filtered = transactions.filter((t) => {
            const date = new Date(t.date);
            return date.getMonth() + 1 === monthNumber;
          });

          const income = filtered
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0);

          const expense = filtered
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0);

          return {
            month,
            totalIncome: income,
            totalExpense: expense,
            surplus: income - expense,
          };
        });

        setMonthlyData(monthSummary);

        const incomeYear = monthSummary.reduce((a, b) => a + b.totalIncome, 0);
        const expenseYear = monthSummary.reduce((a, b) => a + b.totalExpense, 0);

        setTotalIncome(incomeYear);
        setTotalExpense(expenseYear);
        setCurrentBalance(incomeYear - expenseYear);
      })
      .catch((err) => console.error("Error fetch tahunan:", err));

  }, [year, userId]);

  const goToPrevYear = () => setYear((prev) => prev - 1);
  const goToNextYear = () => setYear((prev) => prev + 1);

  const maxIncome = Math.max(...monthlyData.map((m) => m.totalIncome));
  const maxExpense = Math.max(...monthlyData.map((m) => m.totalExpense));
  const maxSurplus = Math.max(...monthlyData.map((m) => m.surplus));
  const minSurplus = Math.min(...monthlyData.map((m) => m.surplus));

  return (
    <section id="rekap3">
      <div className="container-main-rekap">

        <div className="container-rekap">
          <div className="saldo-container-rekap">
            <p className="saldo-title-rekap">
              Total Sisa Keuangan Tahun Ini
            </p>
            <p className="saldo-amount-rekap">
              Rp. {currentBalance.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="transaction-summary-rekap">
            <div className="transaction-box-rekap">
              <p className="transaction-label-rekap">Pengeluaran</p>
              <p className="transaction-amount-out-rekap">
                Rp. {totalExpense.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="transaction-box-rekap">
              <p className="transaction-label-rekap">Pemasukan</p>
              <p className="transaction-amount-in-rekap">
                Rp. {totalIncome.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="container-tahun">
        <div className="header-tahun">
          <button onClick={goToPrevYear}>◀</button>
          {year}
          <button onClick={goToNextYear}>▶</button>
        </div>

        <div className="grid-tahun">
          {monthlyData.map((monthData, index) => {
            let cardClass = "card-tahun";
            let surplusStyle = {};

            if (monthData.totalExpense === maxExpense && maxExpense !== 0) {
              cardClass += " red-box-tahun";
            } else if (monthData.totalIncome === maxIncome && maxIncome !== 0) {
              cardClass += " green-box-tahun";
            }

            if (monthData.surplus === maxSurplus && maxSurplus !== 0) {
              surplusStyle = { color: "gold", fontWeight: "bold" };
            }

            if (monthData.surplus === minSurplus && minSurplus !== 0) {
              surplusStyle = { color: "black", fontWeight: "bold" };
            }

            return (
              <div className={cardClass} key={index}>
                <h2>{monthData.month}</h2>

                <span>
                  Total pemasukan :
                  Rp. {monthData.totalIncome.toLocaleString("id-ID")}
                </span>

                <span>
                  Total pengeluaran :
                  Rp. {monthData.totalExpense.toLocaleString("id-ID")}
                </span>

                <span>
                  Sisa :
                  <span style={surplusStyle}>
                    {" "}
                    Rp. {monthData.surplus.toLocaleString("id-ID")}
                  </span>
                </span>

                <div className="button-container">
                  <Link to={`/rekap2/${index + 1}/${year}`}>
                    <button>Lihat rincian</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Tahunan;