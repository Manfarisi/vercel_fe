import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const KeluarBarang = ({ url }) => {
  const [list, setList] = useState([]);
  const [formStates, setFormStates] = useState({});

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/bahanBaku/daftarBahanBaku`);
      if (res.data.success) {
        setList(res.data.data);
        const today = new Date().toISOString().split("T")[0];

        const initialStates = {};
        res.data.data.forEach((item) => {
          initialStates[item.namaBarang] = {
            jumlah: "",
            satuan: item.satuan?.trim().toLowerCase() || "",
            jenisPengeluaran: "",
            tanggal: today,
            keterangan: "",
          };
        });
        setFormStates(initialStates);
      } else {
        toast.error("Gagal mengambil data!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengambil data!");
    }
  };

  const handleInputChange = (namaBarang, field, value) => {
    setFormStates((prev) => ({
      ...prev,
      [namaBarang]: {
        ...prev[namaBarang],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (namaBarang) => {
    const form = formStates[namaBarang];

    if (!form.jenisPengeluaran) {
      toast.warn("Silakan pilih jenis pengeluaran");
      return;
    }

    const stokBarang =
      list.find((item) => item.namaBarang === namaBarang)?.jumlah || 0;

    if (parseInt(form.jumlah) > stokBarang) {
      toast.error(`Jumlah melebihi stok (${stokBarang})!`);
      return;
    }

    const payload = {
      namaBarang,
      jumlah: Number(form.jumlah),
      satuan: form.satuan?.trim(),
      jenisPengeluaran: form.jenisPengeluaran,
      tanggal: form.tanggal,
      keterangan: form.keterangan,
    };

    console.log("Payload:", payload);

    try {
      const res = await axios.post(
        `${url}/api/bahanBaku/kurangiBahanBaku`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success(`Barang "${namaBarang}" berhasil dikurangi!`);
        setFormStates((prev) => ({
          ...prev,
          [namaBarang]: {
            ...prev[namaBarang],
            jumlah: "",
            jenisPengeluaran: "",
            tanggal: new Date().toISOString().split("T")[0],
            keterangan: "",
          },
        }));
        fetchList(); // Refresh stok
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Gagal kirim:", error.response?.data || error.message);
      toast.error("Terjadi kesalahan saat mengirim data!");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Barang Keluar</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow space-y-4"
            >
              <h2 className="text-lg font-semibold">{item.namaBarang}</h2>

              <input
                type="number"
                placeholder="Jumlah"
                value={formStates[item.namaBarang]?.jumlah || ""}
                onChange={(e) =>
                  handleInputChange(
                    item.namaBarang,
                    "jumlah",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                value={formStates[item.namaBarang]?.satuan || ""}
                disabled
                className="w-full border bg-gray-100 p-2 rounded"
              />

              <select
                value={formStates[item.namaBarang]?.jenisPengeluaran || ""}
                onChange={(e) =>
                  handleInputChange(
                    item.namaBarang,
                    "jenisPengeluaran",
                    e.target.value
                  )
                }
                className="w-full border p-2 rounded"
              >
                <option value="">-- Jenis Pengeluaran --</option>
                <option value="Produksi">Produksi</option>
                <option value="Rusak">Rusak</option>
                <option value="Lainya">Lainya</option>
              </select>

              <input
                type="date"
                value={formStates[item.namaBarang]?.tanggal || ""}
                onChange={(e) =>
                  handleInputChange(
                    item.namaBarang,
                    "tanggal",
                    e.target.value
                  )
                }
                className="w-full border p-2 rounded"
              />

              <textarea
                placeholder="Keterangan"
                value={formStates[item.namaBarang]?.keterangan || ""}
                onChange={(e) =>
                  handleInputChange(
                    item.namaBarang,
                    "keterangan",
                    e.target.value
                  )
                }
                rows={2}
                className="w-full border p-2 rounded"
              />

              <button
                onClick={() => handleSubmit(item.namaBarang)}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
              >
                Keluarkan Barang
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeluarBarang;
