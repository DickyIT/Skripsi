import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Daftar() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  // ===============================
  // handle input
  // ===============================
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // toggle password
  // ===============================
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // ===============================
  // submit daftar
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/daftar`,
        values
      );

      console.log(res.data);

      alert('Pendaftaran berhasil! Silakan masuk.');

      // reset form
      setValues({
        fullName: '',
        username: '',
        email: '',
        password: '',
      });

      navigate('/masuk');

    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(err.response.data.message || 'Server error');
      } else {
        alert('Backend belum jalan / koneksi gagal');
      }
    }
  };

  return (
    <section id="register">
      <div className="container-daftar">
        <div className="form-section-daftar">
          <h2>Daftar Sekarang</h2>
          <p>Halo! Selamat datang di website Control Money 👋</p>

          <form onSubmit={handleSubmit}>

            <div className="input-row-daftar">
              <div className="input-group-daftar">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Masukkan Nama Lengkap"
                  value={values.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group-daftar">
                <label>Nama Pengguna</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Buat Nama Pengguna"
                  value={values.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-row-daftar">
              <div className="input-group-daftar">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan Email"
                  value={values.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group-daftar">
                <label>Kata Sandi</label>

                <div className="password-container-daftar">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Buat Kata Sandi"
                    value={values.password}
                    onChange={handleChange}
                    required
                  />

                  <i
                    className={`fa-solid fa-eye${showPassword ? '' : '-slash'} toggle-password-daftar`}
                    onClick={togglePassword}
                    style={{ cursor: 'pointer' }}
                  ></i>
                </div>

                <p className="password-hint-daftar">
                  Kata sandi minimal 6 karakter
                </p>
              </div>
            </div>

            <button type="submit" className="btn-daftar">
              Daftar
            </button>

            <p className="login-link-daftar">
              Sudah memiliki akun?{' '}
              <a href="/masuk" className="link-daftar">
                Masuk
              </a>
            </p>

          </form>
        </div>

        <div className="image-section-daftar">
          <img src="/assets/images/Logo fix.png" alt="Logo" />
        </div>
      </div>
    </section>
  );
}

export default Daftar;