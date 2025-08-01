import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const DaftarProdukKeluar = ({ url }) => {
  const [produkKeluar, setProdukKeluar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterJenis, setFilterJenis] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchProdukKeluar = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}/api/bahanKeluar/daftarProdukKeluar`);
      if (response.data.success) {
        setProdukKeluar(response.data.data);
      } else {
        toast.error("Gagal mengambil data produk keluar!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Terjadi kesalahan saat mengambil data!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProdukKeluar();
  }, []);

  const editProduk = (id) => {
    navigate(`/bahanKeluar/edit/${id}`);
  };

  const removeProduk = async (id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus data ini?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${url}/api/bahanKeluar/hapusProdukKeluar`, { id });
          if (response.data.success) {
            toast.success(response.data.message);
            fetchProdukKeluar();
          } else {
            toast.error("Gagal menghapus data!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Terjadi kesalahan saat menghapus data!");
        }
      }
    });
  };

  const formatTanggal = (isoDate) => {
    const tanggal = new Date(isoDate);
    return tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Filter dan search data
  const dataTerfilter = produkKeluar.filter((item) => {
    const cocokJenis = filterJenis === "" || item.jenisPengeluaran === filterJenis;
    const cocokTanggal = filterTanggal === "" || item.tanggal.startsWith(filterTanggal);
    const cocokSearch =
      search.trim() === "" ||
      item.namaProduk.toLowerCase().includes(search.toLowerCase());

    return cocokJenis && cocokTanggal && cocokSearch;
  });

  const totalHargaKeseluruhan = dataTerfilter.reduce((acc, item) => {
    const harga = Number(item?.harga) || 0;
    const jumlah = Number(item?.jumlah) || 0;
    return acc + harga * jumlah;
  }, 0);

  // Dapatkan opsi jenis dari data untuk dropdown filter
  const jenisOptions = [...new Set(produkKeluar.map((item) => item.jenisPengeluaran))];

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-blue-200">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-800 flex items-center gap-2">
              📦 Daftar Produk Keluar
            </h1>
            <p className="text-gray-600">Kelola data produk yang telah keluar dari gudang</p>
          </div>
          <button
            onClick={() => navigate("/produk-keluar/tambah")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow"
          >
            <FaPlus /> Tambah Produk
          </button>
        </div>

        {/* Filter dan Search */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama produk..."
              className="w-full focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none"
          >
            <option value="">Semua Jenis</option>
            {jenisOptions.map((jenis, index) => (
              <option key={index} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none"
            title="Filter Tanggal"
          />
          <button
            onClick={() => {
              setFilterJenis("");
              setFilterTanggal("");
              setSearch("");
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md px-4 py-2"
          >
            Reset Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                {[
                  "Nama Produk",
                  "Jenis",
                  "Jumlah",
                  "Harga Satuan",
                  "Total",
                  "Tanggal",
                  "Keterangan",
                  "Aksi",
                ].map((title) => (
                  <th
                    key={title}
                    className={`px-5 py-3 font-semibold text-center text-base${
                      title === "Jumlah" ||
                      title === "Harga Satuan" ||
                      title === "Total"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-blue-500 font-semibold animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : dataTerfilter.length > 0 ? (
                dataTerfilter.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-blue-200 hover:bg-blue-50"
                  >
                    <td className="px-5 py-3 font-medium text-center text-base">{item.namaProduk}</td>
                    <td className="px-5 py-3 font-medium text-center text-base text-purple-700 ">{item.jenisPengeluaran}</td>
                    <td className="px-5 py-3 font-medium text-center text-base">{item.jumlah}</td>
                    <td className="px-5 py-3 font-medium text-center text-base text-green-600 ">
                      Rp {Number(item.harga).toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3 font-medium text-center text-base ">
                      Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3 font-medium text-center text-base">{formatTanggal(item.tanggal)}</td>
                    <td className="px-5 py-3 font-medium text-center text-base text-gray-600 max-w-xs truncate">{item.keterangan}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => editProduk(item._id)}
                          className="p-2 rounded-full bg-green-400 hover:bg-green-500 text-white shadow-md"
                          title="Edit Data"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => removeProduk(item._id)}
                          className="p-2 rounded-full bg-red-400 hover:bg-red-500 text-white shadow-md"
                          title="Hapus Data"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Tidak ada data produk keluar yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-blue-100 font-semibold text-blue-800">
                <td colSpan="4" className="text-right px-5 py-3">
                  Total Harga Keseluruhan:
                </td>
                <td className="text-right px-5 py-3">
                  Rp {totalHargaKeseluruhan.toLocaleString("id-ID")}
                </td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DaftarProdukKeluar;
