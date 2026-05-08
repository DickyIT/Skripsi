import React from 'react';

function Main() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Kelola Keuanganmu dengan Cerdas dan Lebih Mudah</h1>
        <p>
          Sederhanakan pencatatan dan pengelolaan keuangan pribadi anda. Buat keputusan cerdas untuk masa depan
          yang lebih cerah!
        </p>
        <button
            className="start-btn"
            style={{
              backgroundColor: "3b008a",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Mulai Kelola Keuangan
          </button>
      </div>
      <div className="card-image">
        <img src="/assets/images/card Homepage.png" alt="Card Homepage" />
      </div>
    </section>
  );
}

export default Main;
