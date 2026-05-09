import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function Masuk() {

  // 🔥 URL BACKEND RAILWAY
  const API = import.meta.env.VITE_API_URL;

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= TOGGLE PASSWORD ================= */
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/masuk`,
        values
      );

      if (res.data.Masuk) {

        const user = res.data.user;

        localStorage.setItem("userId", user.id);

        setUser(user);

        alert("Login berhasil!");

        navigate("/index");

      } else {

        alert("Email atau password salah");

      }

    } catch (err) {

      console.error(err);

      alert("Server error");

    }
  };

  return (
    <section id="login">

      <div className="container-masuk">

        <div className="form-section-masuk">

          <h2>Masuk Sekarang</h2>

          <p>
            Halo! Selamat datang kembali di Control Money 👋
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group-masuk">

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

            <div className="input-group-masuk">

              <label>Kata Sandi</label>

              <div className="password-container-masuk">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Masukkan Kata Sandi"
                  value={values.password}
                  onChange={handleChange}
                  required
                />

                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                  onClick={togglePassword}
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                ></i>

              </div>

            </div>

            <button
              type="submit"
              className="btn-masuk"
            >
              Masuk
            </button>

            <p className="register-link-masuk">
              Belum punya akun?
              {" "}
              <a href="/daftar">Daftar</a>
            </p>

          </form>

        </div>

        <div className="image-section-masuk">

          <img
            src="/assets/images/Logo fix.png"
            alt="logo"
            className="logo-masuk"
          />

          <img
            src="/assets/images/computer.png"
            alt="computer"
            className="computer-masuk"
          />

        </div>

      </div>

    </section>
  );
}

export default Masuk;