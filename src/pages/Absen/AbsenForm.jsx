import axios from "axios";
import { useState, useEffect } from "react";
import { HiOutlineUser, HiOutlineClipboardList } from "react-icons/hi";

const AbsenForm = ({url}) => {
  const [formData, setFormData] = useState({
    username: "",
    status: "",
    keterangan: "",
  });

  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/api/pegawai/absen`, formData);
      setFormData({ username: formData.username, status: "", keterangan: "" });
      alert("Absen berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan absen!");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/user/user`);
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal ambil data user:", err);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) {
      setFormData((prev) => ({ ...prev, username: storedUser.username }));
    }
    fetchUsers();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto mt-10 space-y-5 border border-gray-100"
    >
      <div className="flex items-center gap-2 text-indigo-700 mb-2">
        <HiOutlineClipboardList className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Form Absen</h2>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Nama Pengguna
        </label>
        <div className="relative">
          <HiOutlineUser className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            name="username"
            value={formData.username}
            readOnly
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Status Kehadiran
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="">-- Pilih Status --</option>
          <option value="Hadir">Hadir</option>
          <option value="Izin">Izin</option>
          <option value="Sakit">Sakit</option>
          <option value="Alpa">Alpa</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Keterangan (opsional)
        </label>
        <input
          type="text"
          name="keterangan"
          placeholder="Contoh: Tugas luar kantor"
          value={formData.keterangan}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
      >
        ✅ Simpan Absen
      </button>
    </form>
  );
};

export default AbsenForm;
