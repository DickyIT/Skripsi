import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Index() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/grafik');
  };

  return (
    <section id="tab" style={{ display: "block" }}>
      <section className="hero" style={{ textAlign: "center", padding: "20px" }}>
        <div className="hero-content" style={{ marginBottom: "20px" }}>
          <h1>Kelola Keuanganmu dengan Cerdas dan Lebih Mudah</h1>
          <p>
            Sederhanakan pencatatan dan pengelolaan keuangan pribadi anda. Buat keputusan cerdas untuk masa depan yang
            lebih cerah!
          </p>

          <button
            className="start-btn"
            style={{
              backgroundColor: "#3b008a",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleButtonClick}
          >
            Mulai Kelola Keuangan
          </button>
        </div>

        <div className="card-image" style={{ textAlign: "center" }}>
          <img
            src="/assets/images/card Homepage.png"
            alt="Homepage Card"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </section>

      <section className="container" style={{ marginTop: "40px" }}>
        <header className="title" style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1>Tips Keuangan Pintar</h1>
        </header>

        <section
          className="tips"
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div className="column" style={{ flex: 1, minWidth: "280px" }}>
            <article className="tip color-1">
              <h3>Batasi Pengeluaran Hiburan</h3>
              <p>
                Sediakan anggaran khusus untuk hiburan dan usahakan untuk tidak melebihi batasnya. Dengan cara ini, Anda
                bisa lebih mudah menabung.
              </p>
            </article>

            <article className="tip color-2">
              <h3>Manfaatkan Diskon & Promo</h3>
              <p>
                Gunakan diskon atau promosi untuk berbelanja kebutuhan sehari-hari agar lebih hemat dan tetap bisa
                menabung.
              </p>
            </article>
          </div>

          <div className="column" style={{ flex: 1, minWidth: "280px" }}>
            <article className="tip color-3">
              <h3>Catat Pengeluaran Harian</h3>
              <p>
                Dengan mencatat pengeluaran harian, Anda akan lebih mudah mengerti pengeluaran dan mengelola
                penyimpanan.
              </p>
            </article>

            <article className="tip color-4">
              <h3>Tabung pada Awal Bulan</h3>
              <p>
                Setiap kali mendapat penghasilan, sisihkan sebagian untuk ditabung di awal bulan agar lebih teratur.
              </p>
            </article>
          </div>

          <aside className="imagetip1-container" style={{ textAlign: "center" }}>
            <img
              src="/assets/images/tips1.png"
              alt="tips1"
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </aside>
        </section>
      </section>

      <section className="container" style={{ marginTop: "40px" }}>
        <section
          className="tips2"
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <aside className="imagetip2-container" style={{ textAlign: "center" }}>
            <img
              src="/assets/images/tips2.png"
              alt="tips2"
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </aside>

          <div className="column" style={{ flex: 1, minWidth: "280px" }}>
            <article className="tip color-1">
              <h3>Buat Daftar Belanja</h3>
              <p>
                Sebelum berbelanja, buat daftar kebutuhan agar tidak tergoda membeli barang di luar rencana. Ini bisa
                membantu menghemat pengeluaran.
              </p>
            </article>

            <article className="tip color-2">
              <h3>Sisihkan Dana Darurat</h3>
              <p>
                Selalu sisihkan sebagian pendapatan untuk dana darurat. Ini penting untuk menghadapi situasi tak
                terduga tanpa mengganggu anggaran utama.
              </p>
            </article>
          </div>

          <div className="column" style={{ flex: 1, minWidth: "280px" }}>
            <article className="tip color-3">
              <h3>Evaluasi Pengeluaran</h3>
              <p>
                Lakukan evaluasi terhadap pengeluaran tidak terduga dan identifikasi mana yang bisa dipotong untuk
                menghemat lebih banyak.
              </p>
            </article>

            <article className="tip color-4">
              <h3>Gunakan Aplikasi Keuangan</h3>
              <p>
                Gunakan Control Money untuk tips terbaik dalam mengelola keuangan, sehingga Anda dapat mencapai tujuan
                finansial dengan mudah dan efisien.
              </p>
            </article>
          </div>
        </section>
      </section>
    </section>
  );
}

export default Index;