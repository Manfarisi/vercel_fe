import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function VerifikasiUser({ url }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getPendingUsers();
  }, []);

  const getPendingUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/user/user`);
      const pending = res.data.filter(
        (user) => user.kategori === "Pegawai" && user.status === "pending"
      );
      setUsers(pending);
    } catch (err) {
      console.error("Gagal ambil user", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`${url}/api/user/status/${id}`);
      if (res.data.success) {
        Swal.fire("Berhasil!", "User telah di-ACC", "success");
        getPendingUsers();
      } else {
        Swal.fire("Gagal!", res.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Gagal mengupdate status user", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus user ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(`${url}/api/user/${id}`);
        if (res.data.success) {
          Swal.fire("Dihapus!", "User berhasil dihapus.", "success");
          getPendingUsers();
        } else {
          Swal.fire("Gagal!", res.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Gagal menghapus user", "error");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Verifikasi Pengguna Baru
      </h2>
      {users.length === 0 ? (
        <p className="text-gray-600">
          Tidak ada pengguna yang menunggu persetujuan.
        </p>
      ) : (
        <table className="w-full table-auto border border-gray-300 bg-white shadow-md rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Nama Lengkap</th>
              <th className="px-4 py-2 border">Jenis Kelamin</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">No Telepon</th>
              <th className="px-4 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="px-4 py-2 border">{user.namaLengkap}</td>
                <td className="px-4 py-2 border">{user.jenisKelamin}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.noTelepon}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-1"
                  >
                    Terima
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ml-1"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VerifikasiUser;
