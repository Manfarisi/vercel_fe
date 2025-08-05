import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillLightningChargeFill } from "react-icons/bs";
import Swal from "sweetalert2";

const Add = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    namaProduk: "",
    keterangan: "",
    jumlah: "",
    harga: "",
    kategori: "",
    hpp: "",
    kodeAngka: "",
    idProduk: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Generate otomatis ID Produk
  useEffect(() => {
    const inisial = data.namaProduk.replace(/\s+/g, "").toUpperCase().slice(0, 3);
    const angka = data.kodeAngka.toString().padStart(3, "0");
    if (data.namaProduk && data.kodeAngka) {
      setData((prev) => ({
        ...prev,
        idProduk: `PJ-${inisial}-${angka}`,
      }));
    }
  }, [data.namaProduk, data.kodeAngka]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/food`,
        formData
      );

      if (response.data.success) {
        Swal.fire({
          title: "Sukses!",
          text: response.data.message,
          icon: "success",
          timer: 2000,
        });

        // Reset state
        setData({
          namaProduk: "",
          keterangan: "",
          jumlah: "",
          harga: "",
          kategori: "",
          hpp: "",
          kodeAngka: "",
          idProduk: "",
        });
        setImage(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: error.response?.data?.message || "Terjadi kesalahan.",
        icon: "error",
      });
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="space-y-4 max-w-xl mx-auto">
      {/* Nama Produk */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Nama Produk
        </label>
        <input
          type="text"
          name="namaProduk"
          value={data.namaProduk}
          onChange={onChangeHandler}
          placeholder="Masukkan Nama Produk"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Keterangan */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Keterangan
        </label>
        <textarea
          name="keterangan"
          value={data.keterangan}
          onChange={onChangeHandler}
          placeholder="Masukkan Keterangan"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Kode Angka */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Kode Angka
        </label>
        <input
          type="number"
          name="kodeAngka"
          value={data.kodeAngka}
          onChange={onChangeHandler}
          placeholder="Contoh: 1"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* ID Produk */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          ID Produk
        </label>
        <input
          type="text"
          name="idProduk"
          value={data.idProduk}
          onChange={onChangeHandler}
          placeholder="Contoh: PJ-AYM-001"
          className="w-full p-2 border rounded-md"
          required
        />
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
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* HPP */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Harga Modal (HPP)
        </label>
        <input
          type="number"
          name="hpp"
          value={data.hpp}
          onChange={onChangeHandler}
          placeholder="Masukkan HPP"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Harga (Readonly) */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Harga Jual (Readonly)
        </label>
        <input
          type="number"
          name="harga"
          value={data.hpp ? Math.round(Number(data.hpp) * 1.2) : ""}
          readOnly
          placeholder="Akan dihitung otomatis dari HPP x 1.2"
          className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Kategori */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Kategori
        </label>
        <select
          name="kategori"
          value={data.kategori}
          onChange={onChangeHandler}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Pilih Kategori</option>
          <option value="Hampers">Hampers</option>
          <option value="Frozen">Frozen</option>
          <option value="Paket Mini Frozen">Paket Mini Frozen</option>
          <option value="Paket Matang">Paket Matang</option>
          <option value="Hampers Neela Klappertart">Hampers Neela Klappertart</option>
        </select>
      </div>

      {/* Upload Gambar */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Gambar Produk
        </label>
        <input
          type="file"
          name="image"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          className="w-full"
          required
        />
      </div>

      {/* Tombol Submit */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Simpan Produk
        </button>
      </div>
    </form>
  );
};

export default Add;
