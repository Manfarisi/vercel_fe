import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import {
  FaBoxOpen,
  FaMoneyBillWave,
  FaAlignLeft,
  FaTags,
  FaUtensils,
  FaImage,
  FaPlus,
} from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading
  const navigate = useNavigate();
  const [data, setData] = useState({
    namaProduk: "",
    keterangan: "",
    jumlah: "",
    harga: "",
    kategori: "",
    hpp: "",
    kodeProduk: "",
  });

  const getNumericValue = (value) => {
    return value ? value.toString().replace(/\D/g, "") : "0";
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Validasi form
    if (!image) {
      Swal.fire({
        title: "Peringatan!",
        text: "Harap upload gambar produk",
        icon: "warning",
        confirmButtonText: "OK",
      });
      setIsSubmitting(false);
      return;
    }

    if (!data.kodeProduk || !data.namaProduk || !data.kategori) {
      Swal.fire({
        title: "Peringatan!",
        text: "Harap isi semua field yang wajib diisi",
        icon: "warning",
        confirmButtonText: "OK",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("namaProduk", data.namaProduk);
      formData.append("keterangan", data.keterangan);
      formData.append("harga", getNumericValue(data.harga));
      formData.append("kategori", data.kategori);
      formData.append("jumlah", data.jumlah);
      formData.append("hpp", getNumericValue(data.hpp));
      formData.append("kodeProduk", data.kodeProduk);
      formData.append("image", image);

      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire({
          title: "Berhasil!",
          text: `Produk berhasil ditambahkan. ID Produk: ${response.data.kodeProduk}`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Reset form
          setData({
            namaProduk: "",
            keterangan: "",
            jumlah: "",
            harga: "",
            kategori: "",
            hpp: "",
            kodeProduk: "",
          });
          setImage(null);
          navigate("/list");
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          "Terjadi kesalahan saat mengirim data.",
        icon: "error",
        confirmButtonText: "Tutup",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (angka) => {
    if (!angka) return "";
    const numberString = angka.toString().replace(/\D/g, "");
    return "Rp " + numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleHppChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const newHpp = rawValue;
    const newHarga = Math.round(rawValue * 1.2);

    setData({
      ...data,
      hpp: newHpp,
      harga: newHarga.toString(),
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaUtensils className="text-orange-500" /> Tambah Produk Baru
      </h2>

      <form
        onSubmit={onSubmitHandler}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* KOLOM KIRI */}
        <div className="space-y-4">
          {/* ID Produk */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              ID Produk
            </label>
            <input
              type="text"
              name="kodeProduk"
              value={data.kodeProduk}
              onChange={onChangeHandler}
              placeholder="Contoh: PJ-AYM-001"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Nama Produk */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <FaBoxOpen className="inline mr-2 text-green-500" />
              Nama Produk
            </label>
            <input
              type="text"
              name="namaProduk"
              value={data.namaProduk}
              onChange={onChangeHandler}
              placeholder="Masukkan nama produk"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <FaAlignLeft className="inline mr-2 text-gray-500" />
              Deskripsi Produk
            </label>
            <textarea
              name="keterangan"
              rows="4"
              value={data.keterangan}
              onChange={onChangeHandler}
              placeholder="Tulis deskripsi produk..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>

          {/* Jumlah */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <BsFillLightningChargeFill className="inline mr-2 text-yellow-500" />
              Jumlah
            </label>
            <input
              type="number"
              name="jumlah"
              value={data.jumlah}
              onChange={onChangeHandler}
              placeholder="Masukkan Jumlah"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              min="1"
            />
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-4">
          {/* HPP */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <FaMoneyBillWave className="inline mr-2 text-indigo-500" />
              Harga Pokok Produksi
            </label>
            <input
              type="text"
              name="hpp"
              placeholder="Contoh: 20000"
              value={formatRupiah(data.hpp)}
              onChange={handleHppChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Harga Jual */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <FaMoneyBillWave className="inline mr-2 text-red-500" />
              Harga Jual
            </label>
            <input
              type="text"
              name="harga"
              readOnly
              value={formatRupiah(data.harga)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-100"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              <FaTags className="inline mr-2 text-purple-500" />
              Kategori Produk
            </label>
            <select
              name="kategori"
              value={data.kategori}
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring focus:ring-purple-300"
              required
            >
              <option value="">-- Pilih Jenis --</option>
              <option value="Hampers">Hampers</option>
              <option value="Frozen">Frozen</option>
              <option value="Paket Mini Frozen">Paket Mini Frozen</option>
              <option value="Paket Matang">Paket Matang</option>
              <option value="Hampers Neela Klappertart">
                Hampers Neela Klappertart
              </option>
            </select>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <FaImage className="inline mr-2 text-blue-500" />
              Upload Gambar
            </label>
            <label htmlFor="image" className="block w-full cursor-pointer">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Preview"
                className="w-full max-h-48 object-contain rounded border p-2 bg-gray-50"
              />
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              hidden
              required
              accept="image/*"
            />
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="md:col-span-2 text-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 px-6 py-2 text-white rounded-md transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              "Memproses..."
            ) : (
              <>
                <FaPlus /> Tambah Produk
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
