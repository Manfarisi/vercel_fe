import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt, FaInbox, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DaftarPengeluaran = ({ url }) => {
  const [pengeluaran, setPengeluaran] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const navigate = useNavigate();

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Pengeluaran", 14, 10);

    const tableData = filtered.map((item, idx) => [
      idx + 1,
      item.namaPengeluaran,
      `Rp ${Number(item.jumlah).toLocaleString("id-ID")}`,
      item.jenisPengeluaran,
      formatTanggal(item.tanggal),
      item.keterangan || "-",
    ]);

    autoTable(doc, {
      head: [["No", "Nama Pengeluaran", "Jumlah", "Jenis", "Tanggal", "Keterangan"]],
      body: tableData,
      startY: 20,
    });

    doc.save("laporan_pengeluaran.pdf");
  };

  const fetchPengeluaran = async () => {
    try {
      const response = await axios.get(`${url}/api/pengeluaran/daftarPengeluaran`);
      if (response.data.success) {
        setPengeluaran(response.data.data);
        setFiltered(response.data.data);
      } else {
        toast.error("Gagal mengambil data pengeluaran!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data!");
    }
  };

  const hapusPengeluaran = async (id) => {
    try {
      const response = await axios.post(`${url}/api/pengeluaran/hapusPengeluaran`, { id });
      if (response.data.success) {
        toast.success("Data berhasil dihapus!");
        fetchPengeluaran();
      } else {
        toast.error("Gagal menghapus data!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data!");
    }
  };

  const formatTanggal = (isoDate) => {
    const tanggal = new Date(isoDate);
    return tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const editPengeluaran = (id) => {
    navigate(`/daftarPengeluaran/edit/${id}`);
  };

  const filterData = () => {
    let data = [...pengeluaran];

    if (search.trim()) {
      data = data.filter((item) =>
        item.namaPengeluaran.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (startDate) {
      data = data.filter((item) => new Date(item.tanggal) >= new Date(startDate));
    }

    if (endDate) {
      data = data.filter((item) => new Date(item.tanggal) <= new Date(endDate));
    }

    if (jenisFilter) {
      data = data.filter((item) => item.jenisPengeluaran === jenisFilter);
    }

    if (filterBulan) {
      const [year, month] = filterBulan.split("-");
      data = data.filter((item) => {
        const date = new Date(item.tanggal);
        return (
          date.getFullYear().toString() === year &&
          (date.getMonth() + 1).toString().padStart(2, "0") === month
        );
      });
    }

    setFiltered(data);
    setCurrentPage(1); // Reset ke halaman 1 setiap filter berubah
  };

  useEffect(() => {
    fetchPengeluaran();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, startDate, endDate, jenisFilter, filterBulan, pengeluaran]);

  const jenisOptions = [...new Set(pengeluaran.map((item) => item.jenisPengeluaran))];
  const totalPengeluaran = filtered.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-red-200">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-800">💸 Daftar Pengeluaran</h1>
            <p className="text-gray-600">Manajemen pengeluaran harian</p>
          </div>
          <button
            onClick={() => navigate("/pengeluaran")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg shadow-md"
          >
            <FaPlus /> Tambah Pengeluaran
          </button>
        </div>

        {/* Filter & Search */}
        <div className="bg-red-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama pengeluaran..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <input
            type="month"
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
            title="Filter Bulan"
          />
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Semua Jenis</option>
            {jenisOptions.map((jenis, index) => (
              <option key={index} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="text-sm text-red-700 font-medium">Total Pengeluaran</p>
          <h2 className="text-xl font-bold text-red-600">
            Rp {totalPengeluaran.toLocaleString("id-ID")}
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <button
            onClick={exportToPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow mb-5"
          >
            Unduh Laporan
          </button>
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-red-100 text-red-800">
                {["No", "Nama Pengeluaran", "Jumlah", "Jenis", "Tanggal", "Keterangan", "Aksi"].map((title) => (
                  <th key={title} className="px-5 py-3 font-semibold text-center text-base">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr key={item._id} className="border-b border-red-200 hover:bg-red-50">
                    <td className="px-5 py-3 text-center">{startIndex + idx + 1}</td>
                    <td className="px-5 py-3 text-center">{item.namaPengeluaran}</td>
                    <td className="px-5 py-3 text-center">Rp {item.jumlah.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="bg-red-200 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {item.jenisPengeluaran}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">{formatTanggal(item.tanggal)}</td>
                    <td className="px-5 py-3 text-center">{item.keterangan}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => editPengeluaran(item._id)}
                          className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white shadow-md"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => hapusPengeluaran(item._id)}
                          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center text-gray-500 text-lg">
                      <FaInbox size={48} className="mb-3" />
                      <h3 className="text-xl font-semibold">Tidak ada data ditemukan</h3>
                      <p className="mb-4">Ubah filter atau tambahkan pengeluaran baru.</p>
                      <button
                        onClick={() => navigate("/pengeluaran")}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg shadow"
                      >
                        <FaPlus /> Tambah Pengeluaran
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === i + 1
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaftarPengeluaran;
