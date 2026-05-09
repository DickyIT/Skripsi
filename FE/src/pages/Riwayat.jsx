import React, { useState, useEffect } from "react";

function Riwayat() {
  const userId = localStorage.getItem("userId");

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchTransactions = async () => {
    if (!userId) return;

    const res = await fetch(
      `http://localhost:8081/transactions/${userId}`
    );

    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  /* ================= FILTER ================= */
  const filteredTransactions = transactions
    .filter((t) =>
      filterType === "all" ? true : t.type === filterType
    )
    .filter((t) =>
      t.note?.toLowerCase().includes(search.toLowerCase())
    );

  /* ================= TOTAL ================= */
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const totalSelisih = totalIncome - totalExpense;

  /* ================= FORMAT DATE ================= */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section id="riwayat">
      <div
        className="container-center-riwayat"
        style={{
          padding: "20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div className="content-wrapper-riwayat">

          {/* FILTER */}
          <div
            className="filter-container"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <button
              className={filterType === "all" ? "active-filter" : ""}
              onClick={() => setFilterType("all")}
            >
              Semua
            </button>

            <button
              className={filterType === "income" ? "active-filter" : ""}
              onClick={() => setFilterType("income")}
            >
              Pemasukan
            </button>

            <button
              className={filterType === "expense" ? "active-filter" : ""}
              onClick={() => setFilterType("expense")}
            >
              Pengeluaran
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Cari deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              boxSizing: "border-box",
            }}
          />

          {/* SUMMARY */}
          <div
            className="summary-container"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div>Total Pemasukan: Rp. {totalIncome.toLocaleString("id-ID")}</div>
            <div>Total Pengeluaran: Rp. {totalExpense.toLocaleString("id-ID")}</div>
            <div>Selisih: Rp. {totalSelisih.toLocaleString("id-ID")}</div>
          </div>

          {/* LIST */}
          <div
            className="list-container"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {filteredTransactions.length === 0 && (
              <p>Tidak ada transaksi.</p>
            )}

            {filteredTransactions.map((item) => (
              <div
                key={item.id}
                className={`transaction-card ${
                  item.type === "income"
                    ? "income-card"
                    : "expense-card"
                }`}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  boxSizing: "border-box",
                  overflowWrap: "break-word",
                }}
              >
                <div
                  className="transaction-header"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <span>{formatDate(item.date)}</span>
                  <span>{item.wallet_name}</span>
                </div>

                <div
                  className="transaction-description"
                  style={{
                    marginBottom: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  {item.note || "Tanpa deskripsi"}
                </div>

                <div className="transaction-body">
                  <span
                    className={
                      item.type === "income"
                        ? "amount-income"
                        : "amount-expense"
                    }
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    {item.type === "income" ? "⬆" : "⬇"} Rp.{" "}
                    {Number(item.amount).toLocaleString("id-ID")}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default Riwayat;