import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  const reportsPerPage = 5;

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, categoryFilter, statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports');
      setReports(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(report => report.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const getUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const uniqueCategories = ['all', ...new Set(reports.map(report => report.category))];
  const statusOptions = ['all', 'รอดำเนินการ', 'กำลังดำเนินการ', 'เสร็จสิ้น'];

  if (loading) {
    return <div className="text-center mt-8">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-white relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-32 h-32 text-white opacity-50"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M50 5 A45 45 0 0 1 95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 A45 45 0 0 1 50 5" />
        </svg>
        <svg
          className="absolute top-1/4 right-0 w-40 h-40 text-white opacity-50"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M50 5 A45 45 0 0 1 95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 A45 45 0 0 1 50 5" />
        </svg>
        <svg
          className="absolute bottom-0 left-1/4 w-36 h-36 text-white opacity-50"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M50 5 A45 45 0 0 1 95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 A45 45 0 0 1 50 5" />
        </svg>
      </div>
      <div className="relative z-10 container mx-auto mt-10 p-4">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">แดชบอร์ด</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {user && user.email && (
            <p className="mb-4">
              รหัสนักศึกษาของคุณคือ {getUsernameFromEmail(user.email)}!
            </p>
          )}
          <div className="mb-4">
            <p className="font-semibold">จำนวนรายงานทั้งหมด: {reports.length}</p>
          </div>
          <div className="flex mb-4 space-x-4">
            <div>
              <label htmlFor="category" className="mr-2">หมวดหมู่:</label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded p-1"
              >
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'ทั้งหมด' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="mr-2">สถานะ:</label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded p-1"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'ทั้งหมด' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">รายการแจ้งซ่อมล่าสุด</h3>
          {currentReports.length === 0 ? (
            <p>ไม่มีรายการแจ้งซ่อมที่ตรงกับเงื่อนไขในขณะนี้</p>
          ) : (
            <ul className="space-y-4">
              {currentReports.map((report) => (
                <li key={report._id} className="border p-4 rounded shadow bg-white">
                  <h4 className="font-bold text-lg">{report.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p>
                        <strong>อาคาร:</strong> {report.building}
                      </p>
                      <p>
                        <strong>เลขห้อง:</strong> {report.roomNumber}
                      </p>
                      <p>
                        <strong>หมวดหมู่:</strong> {report.category}
                      </p>
                      <p>
                        <strong>วันที่รายงาน:</strong> {formatDate(report.reportDate)}
                      </p>
                      <p>
                        <strong>สถานะ:</strong>{' '}
                        <span
                          className={`font-semibold ${
                            report.status === 'รอดำเนินการ'
                              ? 'text-yellow-600'
                              : report.status === 'กำลังดำเนินการ'
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}
                        >
                          {report.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>รายละเอียด:</strong>
                      </p>
                      <p className="mt-1">{report.details}</p>
                      {report.note && (
                        <div className="mt-2 bg-yellow-50 p-2 rounded">
                          <p>
                            <strong>หมายเหตุ:</strong> {report.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex justify-center">
            {Array.from({ length: Math.ceil(filteredReports.length / reportsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-purple-500 text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;