import { useEffect, useState } from "react";
import axios from "axios";

const AbsenList = ({ url }) => {
  const [absen, setAbsen] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ status: "", keterangan: "" });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const fetchAbsen = async () => {
    try {
      const res = await axios.get(`${url}/api/pegawai/absen`);
const filtered = res.data.filter((item) => {
  const itemDate = new Date(item.tanggal)
    .toLocaleDateString("en-CA"); // hasilnya "YYYY-MM-DD"
  return itemDate === selectedDate;
});

      setAbsen(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const hapusAbsen = async (id) => {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    try {
      await axios.delete(`${url}/api/pegawai/absen/${id}`);
      fetchAbsen();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditForm({ status: item.status, keterangan: item.keterangan || "" });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${url}/api/pegawai/absen/${editItem._id}`, {
        ...editForm,
        tanggal: new Date(), // update juga waktu
      });
      setEditItem(null);
      setEditForm({ status: "", keterangan: "" });
      fetchAbsen();
    } catch (err) {
      console.error("Gagal update absen", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "bg-green-100 text-green-700";
      case "izin":
        return "bg-yellow-100 text-yellow-900";
      case "sakit":
        return "bg-blue-100 text-blue-700";
      case "alpa":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    setAbsen([]); // Kosongkan data saat tanggal berubah
    fetchAbsen();
  }, [selectedDate]);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        📋 Daftar Absen Pegawai
      </h2>

      <div className="flex justify-end mb-4">
        <label className="mr-2 font-medium text-sm">Filter Tanggal:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-gray-800 bg-white rounded">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-md">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Status</th>
              <th className="p-3">Keterangan</th>
              <th className="p-3">Tanggal & Jam</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {absen.map((item) => {
              const date = new Date(item.tanggal);
              const jam = date.getHours();
              const warnaJam = jam < 9 ? "text-green-600" : "text-red-600";

              return (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="p-3 text-center font-medium">
                    {item.username?.nama || item.username}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {item.keterangan || "-"}
                    </span>
                  </td>
                  <td className={`p-3 text-center font-mono ${warnaJam}`}>
                    {date.toLocaleString()}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => hapusAbsen(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
            {absen.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Tidak ada data absen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-indigo-700">
              Edit Absen: {editItem.username?.nama || editItem.username}
            </h3>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Status</label>
              <select
                className="w-full border p-2 rounded"
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
              >
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                <option value="Alpa">Alpa</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                Keterangan
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={editForm.keterangan}
                onChange={(e) =>
                  setEditForm({ ...editForm, keterangan: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditItem(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsenList;
