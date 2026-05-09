import React, { useState } from "react";
import axios from "axios";

function Hubungi() {

  // 🔥 URL BACKEND RAILWAY
  const API = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    message: "",
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ SUBMIT KE BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(`${API}/contact`, {
        name: formData.username,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      // tampilkan popup
      setIsPopupOpen(true);

      // reset form
      setFormData({
        email: "",
        username: "",
        phone: "",
        message: "",
      });

    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pesan");
    }
  };

  return (
    <section id="hubungiKami">

      <div className="contact-form">

        <div>
          <h2>HUBUNGI KAMI</h2>

          <form id="contactForm" onSubmit={handleSubmit}>

            <div>

              <label htmlFor="email">Email</label>

              <input
                type="text"
                id="email"
                name="email"
                placeholder="Masukkan Email Pengguna"
                required
                value={formData.email}
                onChange={handleChange}
              />

              <div>
                <label htmlFor="username">Nama Pengguna</label>

                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control custom-input"
                  placeholder="Masukkan nama pengguna"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone">Nomor Telepon</label>

                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form-control custom-input"
                  placeholder="Masukkan No.telp"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="message">Masukkan pesan</label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Masukkan pesan"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>

                <button type="submit" id="submitButton">
                  Kirim
                </button>
              </div>

            </div>
          </form>
        </div>

        <div className="contact-info">

          <img
            src="/assets/images/Logo fix.png"
            alt="Control Money logo"
          />

          <p className="p-large">
            Terima kasih telah mengunjungi Control Money!
            Kami siap membantu Anda dalam mengelola keuangan
            dan memberikan solusi terbaik untuk kebutuhan finansial Anda.
          </p>

          <p className="p-small">
            Kami sangat menjaga privasi dan keamanan data pribadi Anda.
            Setiap informasi yang Anda bagikan dengan kami akan dilindungi
            sesuai dengan kebijakan privasi kami dan standar keamanan terbaik.
            Kami berkomitmen untuk menjaga kerahasiaan informasi Anda.
          </p>

        </div>

      </div>

      {isPopupOpen && (
        <div className="overlay-hub">

          <div className="popup-hub">

            <button
              onClick={() => setIsPopupOpen(false)}
              className="close-button-hub"
            >
              &times;
            </button>

            <h5>Terimakasih!</h5>

            <p>
              Formulir Anda telah berhasil dikirim.
              Tim kami akan segera menghubungi Anda
              dalam waktu 1-2 hari kerja.
              Terima kasih telah menghubungi Control Money,
              kami siap membantu Anda dengan segala kebutuhan
              dan pertanyaan terkait layanan kami.
            </p>

            <p>
              Jika Anda tidak menerima respons dalam waktu yang ditentukan,
              silakan hubungi kami melalui telepon atau email yang
              tercantum di halaman ini.
            </p>

            <h5>
              Control Money – Atur Keuangan, Wujudkan Impian
            </h5>

          </div>
        </div>
      )}

    </section>
  );
}

export default Hubungi;