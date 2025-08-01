import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BsCalendar2CheckFill } from "react-icons/bs";
import {
  FaMoneyBillWave,
  FaBox,
  FaCommentDots,
  FaTags,
  FaPlus,
  FaSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Pemasukan = ({ url }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    namaPemasukan: "",
    jumlah: "",
    jenisPemasukan: "",
    keterangan: "",
    tanggal: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setData((prev) => ({ ...prev, tanggal: today }));
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/pemasukan/pemasukan`, data);
      if (res.data.success) {
        toast.success("Pemasukan berhasil ditambahkan!");
        setTimeout(() => navigate("/daftarPemasukan"), 1000);
        setData({
          namaPemasukan: "",
          jumlah: "",
          jenisPemasukan: "",
          keterangan: "",
          tanggal: new Date().toISOString().split("T")[0],
        });
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengirim data!");
    }
  };

  const formatRupiah = (angka) => {
    if (!angka) return "";
    const numberString = angka.toString().replace(/[^,\d]/g, "");
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return "Rp " + rupiah;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaSign className="text-green-600" />
          Tambah Pemasukan
        </h2>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              <FaBox className="inline mr-2 text-blue-500" />
              Nama Pemasukan
            </label>
            <input
              type="text"
              name="namaPemasukan"
              value={data.namaPemasukan}
              onChange={onChangeHandler}
              placeholder="Masukkan nama pemasukan"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              <FaMoneyBillWave className="inline mr-2 text-green-500" />
              Jumlah
            </label>
            <input
              type="text"
              name="jumlah"
              value={formatRupiah(data.jumlah)}
              placeholder="Contoh: Rp 20.000"
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                setData((prevData) => ({
                  ...prevData,
                  jumlah: rawValue,
                }));
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              <FaTags className="inline mr-2 text-purple-500" />
              Jenis Pemasukan
            </label>
            <select
              name="jenisPemasukan"
              value={data.jenisPemasukan}
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring focus:ring-purple-300"
              required
            >
              <option value="">-- Pilih Jenis --</option>
              <option value="Penjualan">Penjualan</option>
              <option value="Piutang">Piutang</option>
              <option value="Investasi">Investasi</option>
              <option value="Pendanaan">Pendanaan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              <BsCalendar2CheckFill className="inline mr-2 text-pink-500" />
              Tanggal
            </label>
            <input
              type="date"
              name="tanggal"
              value={data.tanggal}
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              <FaCommentDots className="inline mr-2 text-gray-500" />
              Keterangan
            </label>
            <textarea
              name="keterangan"
              rows="3"
              value={data.keterangan}
              onChange={onChangeHandler}
              placeholder="Tulis keterangan tambahan..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow flex items-center gap-2"
            >
              <FaPlus />
              Tambah Pemasukan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pemasukan;
