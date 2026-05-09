import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Privasi() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // ================= UPDATE PASSWORD =================
  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/change-password/${user.id}`,
        {
          oldPassword,
          newPassword,
        }
      );

      alert("Password berhasil diubah");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Password lama salah atau gagal update");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    setUser(null);
    navigate("/masuk");
  };

  // ================= DELETE ACCOUNT =================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus akun? Data tidak bisa dikembalikan!"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`
      );

      alert("Akun berhasil dihapus");

      setUser(null);
      navigate("/masuk");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus akun");
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Silakan login terlebih dahulu.</h2>
      </div>
    );
  }

  return (
    <section id="editProfile">
      <div className="kontainerProfil">

        {/* ===== JUDUL ===== */}
        <div className="headerProfil">
          <h2 style={{ marginBottom: "10px" }}>🔒 Privasi & Keamanan</h2>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>
            Kelola keamanan akun Anda
          </p>
        </div>

        {/* ===== FORM PASSWORD ===== */}
        <form
          className="formProfil"
          onSubmit={handleChangePassword}
          style={{ marginTop: "20px" }}
        >
          <div className="formGrupProfil">
            <label>Password Lama</label>
            <div className="inputWrapper">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password lama"
              />
            </div>
          </div>

          <div className="formGrupProfil">
            <label>Password Baru</label>
            <div className="inputWrapper">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
              />

              <i
                className={`fa-solid ${
                  isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                } toggle-password-profil`}
                onClick={togglePassword}
              ></i>
            </div>
          </div>

          <div className="tombolFormProfil">
            <button type="submit" className="tombolSimpan">
              Update Password
            </button>
          </div>
        </form>

        {/* ===== ACTION MENU ===== */}
        <div className="menu" style={{ marginTop: "40px", width: "100%" }}>
          <div className="menu-item" onClick={handleLogout}>
            <span>🚪 Logout</span>
            <span className="arrow">❯</span>
          </div>

          <div
            className="menu-item"
            onClick={handleDelete}
            style={{
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              border: "1px solid rgba(255,0,0,0.4)",
            }}
          >
            <span>🗑️ Hapus Akun</span>
            <span className="arrow">❯</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Privasi;