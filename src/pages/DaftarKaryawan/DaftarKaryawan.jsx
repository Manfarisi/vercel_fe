import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

const DaftarKaryawan = ({ url }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/user/user`);
      const data = res.data.filter((user) => user.kategori === "Pegawai");
      setUsers(data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data ini tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${url}/api/user/user-delete/${id}`);
        fetchUsers();
        Swal.fire("Dihapus!", "Data berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal menghapus pengguna:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Daftar Karyawan</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Nama Lengkap</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Jenis Kelamin</th>
              <th className="p-3 text-left">Telepon</th>
              <th className="p-3 text-left">Alamat</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Waktu Daftar</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="border-t border-gray-200">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.namaLengkap}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.jenisKelamin}</td>
                  <td className="p-3">{user.noTelepon}</td>
                  <td className="p-3">{user.alamat}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        user.status === "pending"
                          ? "bg-red-500"
                          : user.status === "Aktif"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  Tidak ada data karyawan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DaftarKaryawan;
