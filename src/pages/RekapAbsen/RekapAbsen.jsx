import { useEffect, useState } from "react";
import axios from "axios";

const bulanOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const RekapAbsen = ({ url }) => {
  const [rekap, setRekap] = useState([]);
  const [bulan, setBulan] = useState(new Date().getMonth() + 1); // bulan 1-12
  const [tahun, setTahun] = useState(new Date().getFullYear());

  const fetchRekap = async () => {
    try {
      const res = await axios.get(`${url}/api/pegawai/absen`);
      const data = res.data;

      const userMap = {};
      const filtered = data.filter((item) => {
        const date = new Date(item.createdAt);
        return (
          date.getMonth() + 1 === parseInt(bulan) &&
          date.getFullYear() === parseInt(tahun)
        );
      });

      filtered.forEach((item) => {
        const userId = item.username?._id || item.username;
        const userNama =
          typeof item.username === "object"
            ? item.username.nama
            : item.username || "Tidak Diketahui";

        if (!userMap[userId]) {
          userMap[userId] = {
            id: userId,
            nama: userNama,
            hadir: 0,
            izin: 0,
            sakit: 0,
            alpa: 0,
          };
        }

        const status = item.status?.toLowerCase();
        if (["hadir", "izin", "sakit", "alpa"].includes(status)) {
          userMap[userId][status]++;
        }
      });

      setRekap(Object.values(userMap));
    } catch (err) {
      console.error("Gagal mengambil data rekap:", err);
    }
  };

  const handleDeleteUserRekap = async (id, nama) => {
    const konfirmasi = confirm(`Yakin ingin hapus semua absen milik ${nama}?`);
    if (!konfirmasi) return;

    try {
      await axios.delete(`${url}/api/pegawai/absen/user/${id}`);
      setRekap((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal menghapus absen user:", err);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, [bulan, tahun]); // refresh saat bulan/tahun berubah

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
        📊 Rekapitulasi Absen Pegawai
      </h2>

      {/* Filter Bulan dan Tahun */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="border rounded p-2"
        >
          {bulanOptions.map((bln, index) => (
            <option key={index} value={index + 1}>
              {bln}
            </option>
          ))}
        </select>

        <select
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          className="border rounded p-2"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-sm text-gray-800 bg-white rounded">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-center">Hadir</th>
              <th className="p-3 text-center">Izin</th>
              <th className="p-3 text-center">Sakit</th>
              <th className="p-3 text-center">Alpa</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rekap.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100">
                <td className="p-3 font-medium">{item.nama}</td>
                <td className="p-3 text-center text-green-600">{item.hadir}</td>
                <td className="p-3 text-center text-yellow-700">{item.izin}</td>
                <td className="p-3 text-center text-blue-600">{item.sakit}</td>
                <td className="p-3 text-center text-red-600">{item.alpa}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteUserRekap(item.id, item.nama)}
                    className="text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {rekap.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Tidak ada data absen bulan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RekapAbsen;
