import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsCalendar2CheckFill } from "react-icons/bs";
import {
  FaBalanceScale,
  FaBox,
  FaCommentDots,
  FaHashtag,
  FaPlus,
  FaTags,
  FaSign,
} from "react-icons/fa";

const BarangMasuk = ({ url }) => {
  const navigate = useNavigate(); // ← Tambahkan ini
  const [data, setData] = useState({
    namaBarang: "",
    jumlah: "",
    satuan: "",
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
      const res = await axios.post(`${url}/api/bahanBaku/bahanBakuMasuk`, data);
      if (res.data.success) {
        toast.success(
          `Barang "${data.namaBarang}" sejumlah ${data.jumlah} ${data.satuan} berhasil ditambahkan!`
        );
        setData({
          namaBarang: "",
          jumlah: "",
          satuan: "",
          jenisPemasukan: "",
          keterangan: "",
          tanggal: new Date().toISOString().split("T")[0],
        });
        setTimeout(() => {
          navigate("/daftarBaku"); // ← Redirect ke halaman daftar bahan baku
        }, 1000); // Delay untuk memberi waktu toast muncul
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengirim data!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6 text-blue-700">
        <FaSign /> Tambah Barang Masuk
      </h2>

      <form
        onSubmit={onSubmitHandler}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Nama Barang */}
        <div>
          <label className=" mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaBox /> Nama Barang
          </label>
          <input
            type="text"
            name="namaBarang"
            value={data.namaBarang}
            onChange={onChangeHandler}
            placeholder="Masukkan nama barang"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Jumlah */}
        <div>
          <label className=" mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaHashtag /> Jumlah
          </label>
          <input
            type="number"
            name="jumlah"
            value={data.jumlah}
            onChange={onChangeHandler}
            placeholder="Masukkan jumlah"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Satuan */}
        <div>
          <label className=" mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaBalanceScale /> Satuan
          </label>
          <select
            name="satuan"
            value={data.satuan}
            onChange={onChangeHandler}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="">-- Pilih Satuan --</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="gram">Gram (g)</option>
            <option value="ons">Ons (ons)</option>
            <option value="liter">Liter (L)</option>
            <option value="ml">Mililiter (mL)</option>
            <option value="meter">Meter (m)</option>
            <option value="cm">Centimeter (cm)</option>
            <option value="mm">Milimeter (mm)</option>
            <option value="pack">Pack / Pak</option>
            <option value="lusin">Lusin (12 pcs)</option>
            <option value="kodi">Kodi (20 pcs)</option>
            <option value="rim">Rim (500 lembar)</option>
            <option value="box">Box / Kotak</option>
            <option value="unit">Unit</option>
            <option value="pcs">Pcs (Pieces)</option>
            <option value="set">Set</option>
            <option value="roll">Roll / Gulung</option>
            <option value="tablet">Tablet (Obat)</option>
            <option value="botol">Botol</option>
            <option value="tube">Tube (Kosmetik / Salep)</option>
            <option value="kaleng">Kaleng</option>
            <option value="bungkus">Bungkus</option>
            <option value="tray">Tray (telur / makanan)</option>
            <option value="cup">Cup (minuman/makanan)</option>
          </select>
        </div>

        {/* Jenis Pemasukan */}
        <div>
          <label className=" mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaTags /> Jenis Pemasukan
          </label>
          <select
            name="jenisPemasukan"
            value={data.jenisPemasukan}
            onChange={onChangeHandler}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          >
            <option value="">-- Pilih Jenis --</option>
            <option value="Bahan Baku">Bahan Baku (Masuk untuk Produksi)</option>
            <option value="Produk Hasil">Bahan Pendukung</option>
          </select>
        </div>

        {/* Tanggal */}
        <div>
          <label className=" mb-1 font-medium text-gray-700 flex items-center gap-2">
            <BsCalendar2CheckFill /> Tanggal
          </label>
          <input
            type="date"
            name="tanggal"
            value={data.tanggal}
            onChange={onChangeHandler}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        {/* Keterangan */}
        <div className="md:col-span-2">
          <label className=" mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaCommentDots /> Keterangan
          </label>
          <textarea
            name="keterangan"
            rows="3"
            value={data.keterangan}
            onChange={onChangeHandler}
            placeholder="Tulis keterangan tambahan..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          ></textarea>
        </div>

        {/* Tombol Submit */}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            <FaPlus /> Tambah Barang Masuk
          </button>
        </div>
      </form>
    </div>
  );
};

export default BarangMasuk;
