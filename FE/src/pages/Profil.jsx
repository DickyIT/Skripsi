import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Profil() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [profileVisible, setProfileVisible] = useState(true);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  /* ================= SYNC USER ================= */
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
      });

      if (user.photo) {
        setProfileImage(
          `${process.env.REACT_APP_BACKEND_URL}/uploads/${user.photo}?t=${Date.now()}`
        );
      }
    }
  }, [user]);

  /* ================= EXPORT PDF ================= */
  const handleExport = async () => {
    try {
      if (!user || !user.id) {
        alert("User belum login");
        return;
      }

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/transactions/${user.id}`
      );

      console.log("DATA API:", res.data);

      const transactions = res.data;

      if (!transactions || transactions.length === 0) {
        alert("Tidak ada data untuk diexport");
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Laporan Keuangan Control Money", 14, 15);

      const today = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Tanggal: ${today}`, 14, 22);

      const tableColumn = ["Tanggal", "Tipe", "Nominal", "Catatan"];
      const tableRows = [];

      transactions.forEach((item) => {
        tableRows.push([
          item.date,
          item.type,
          item.amount,
          item.note || "-"
        ]);
      });

      autoTable(doc, {
        startY: 30,
        head: [tableColumn],
        body: tableRows,
      });

      const total = transactions.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID").format(angka);
      };

      doc.text(
        `Total: Rp ${formatRupiah(total)}`,
        14,
        doc.lastAutoTable.finalY + 10
      );

      doc.save(`laporan-keuangan-${today}.pdf`);

    } catch (err) {
      console.error(err);
      alert("Gagal export PDF");
    }
  };

  /* ================= HANDLE MENU ================= */
  const handleClick = (section) => {
    if (section === 'Edit Profil Pengguna') {
      setProfileVisible(false);
      setEditProfileVisible(true);
    } else if (section === 'Hubungi Kami') {
      navigate('/hubungi-kami');
    } else if (section === 'Privasi & Keamanan') {
      navigate('/privasi');
    } else if (section === 'Notifikasi') {
      navigate('/riwayat');
    } else if (section === 'Export Data') {
      handleExport();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UPDATE PROFILE ================= */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("password", formData.password);

      if (profileImageFile) {
        form.append("photo", profileImageFile);
      }

      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profil berhasil diperbarui");

      const newPhoto = res.data.photo || user.photo;

      setUser({
        ...user,
        username: formData.username,
        email: formData.email,
        photo: newPhoto,
      });

      if (newPhoto) {
        setProfileImage(
          `${process.env.REACT_APP_BACKEND_URL}/uploads/${newPhoto}?t=${Date.now()}`
        );
      }

      setEditProfileVisible(false);
      setProfileVisible(true);

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memperbarui profil.");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  /* ================= IMAGE PREVIEW ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Silakan login terlebih dahulu.</h2>
      </div>
    );
  }

  const imageUrl =
    profileImage ||
    (user.photo
      ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${user.photo}?t=${Date.now()}`
      : '/default-avatar.png');

  return (
    <>
      {profileVisible && (
        <section id="profil">
          <div className="profil-container">
            <div className="containerprofil">
              <div className="profile">
                <div className="avatar">
                  <div
                    className="profile-pic"
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  ></div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="file-input"
                  />

                  <label htmlFor="file-input" className="edit-iconprofil">
                    ✏️
                  </label>
                </div>

                <h1>{user.username}</h1>
                <p>{user.email}</p>
              </div>

              <div className="menu">
                <div
                  className="menu-item"
                  onClick={() => handleClick('Edit Profil Pengguna')}
                >
                  <span>✏️ Edit profil pengguna</span>
                  <span className="arrow">❯</span>
                </div>

                <div
                  className="menu-item"
                  onClick={() => handleClick('Export Data')}
                >
                  <span>📥 Export Data</span>
                  <span className="arrow">❯</span>
                </div>

                <div
                  className="menu-item"
                  onClick={() => handleClick('Hubungi Kami')}
                >
                  <span>📞 Hubungi kami</span>
                  <span className="arrow">❯</span>
                </div>

                <div
                  className="menu-item"
                  onClick={() => handleClick('Privasi & Keamanan')}
                >
                  <span>🔒 Privasi & keamanan</span>
                  <span className="arrow">❯</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {editProfileVisible && (
        <section id="editProfile">

          <button
            className="btn-back-fixed"
            onClick={() => {
              setEditProfileVisible(false);
              setProfileVisible(true);
            }}
          >
            ⬅
          </button>

          <div className="kontainerProfil">
            <div className="headerProfil">
              <div className="fotoProfil">
                <div
                  className="profile-pic"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                  }}
                ></div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="file-input-edit"
                />

                <label
                  htmlFor="file-input-edit"
                  className="edit-iconprofil"
                >
                  ✏️
                </label>
              </div>
            </div>

            <form className="formProfil" onSubmit={handleProfileUpdate}>
              <div className="formGrupProfil">
                <label>Nama Akun</label>
                <div className="inputWrapper">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="formGrupProfil">
                <label>Email</label>
                <div className="inputWrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="formGrupProfil">
                <label>Kata Sandi</label>
                <div className="inputWrapper">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <i
                    className={`fa-solid ${
                      isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'
                    }`}
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                  ></i>
                </div>
              </div>

              <div className="tombolFormProfil">
                <button
                  type="button"
                  className="tombolBatal"
                  onClick={() => {
                    setEditProfileVisible(false);
                    setProfileVisible(true);
                  }}
                >
                  Batal
                </button>

                <button type="submit" className="tombolSimpan">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default Profil;