import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [allReports, setAllReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [otherReports, setOtherReports] = useState([]);
  const [filteredUserReports, setFilteredUserReports] = useState([]);
  const [filteredOtherReports, setFilteredOtherReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentOtherPage, setCurrentOtherPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  const reportsPerPage = 5;

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports');
      setAllReports(response.data);
      setError('');
      console.log('Fetched reports:', response.data); // Log fetched data
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const separateReports = useCallback(() => {
    const userId = user?.id; // Assuming user object has an 'id' field
    console.log('Current user ID:', userId); // Log current user ID

    const userReports = allReports.filter(report => {
      console.log('Report:', report); // Log each report
      return report.userId === userId || report.createdBy === userId;
    });
    const otherReports = allReports.filter(report => report.userId !== userId && report.createdBy !== userId);

    console.log('User reports:', userReports); // Log user reports
    console.log('Other reports:', otherReports); // Log other reports

    setUserReports(userReports);
    setOtherReports(otherReports);
  }, [allReports, user]);

  const filterReports = useCallback(() => {
    const filterFunction = (reports) => {
      let filtered = reports;
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(report => report.category === categoryFilter);
      }
      if (statusFilter !== 'all') {
        filtered = filtered.filter(report => report.status === statusFilter);
      }
      return filtered;
    };

    setFilteredUserReports(filterFunction(userReports));
    setFilteredOtherReports(filterFunction(otherReports));
    setCurrentUserPage(1);
    setCurrentOtherPage(1);
  }, [userReports, otherReports, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    separateReports();
  }, [separateReports]);

  useEffect(() => {
    filterReports();
  }, [filterReports]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const getUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };

  const paginateReports = (reports, currentPage) => {
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    return reports.slice(indexOfFirstReport, indexOfLastReport);
  };

  const paginate = (pageNumber, setPageFunction) => setPageFunction(pageNumber);

  const uniqueCategories = ['all', ...new Set(allReports.map(report => report.category))];
  const statusOptions = ['all', 'รอดำเนินการ', 'กำลังดำเนินการ', 'เสร็จสิ้น'];

  if (loading) {
    return <div className="text-center mt-8">กำลังโหลด...</div>;
  }

  const renderReportList = (reports, currentPage, setPageFunction, title) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {reports.length === 0 ? (
        <p>ไม่มีรายการแจ้งซ่อมที่ตรงกับเงื่อนไขในขณะนี้</p>
      ) : (
        <>
          <ul className="space-y-4">
            {paginateReports(reports, currentPage).map((report) => (
              <li key={report._id} className="border p-4 rounded shadow bg-white">
                <h4 className="font-bold text-lg">{report.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p><strong>อาคาร:</strong> {report.building}</p>
                    <p><strong>เลขห้อง:</strong> {report.roomNumber}</p>
                    <p><strong>หมวดหมู่:</strong> {report.category}</p>
                    <p><strong>วันที่รายงาน:</strong> {formatDate(report.reportDate)}</p>
                    <p>
                      <strong>สถานะ:</strong>{' '}
                      <span className={`font-semibold ${
                        report.status === 'รอดำเนินการ' ? 'text-yellow-600' :
                        report.status === 'กำลังดำเนินการ' ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {report.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p><strong>รายละเอียด:</strong></p>
                    <p className="mt-1">{report.details}</p>
                    {report.note && (
                      <div className="mt-2 bg-yellow-50 p-2 rounded">
                        <p><strong>หมายเหตุ:</strong> {report.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center">
            {Array.from({ length: Math.ceil(reports.length / reportsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1, setPageFunction)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-purple-500 text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-white relative overflow-hidden">
      <Navbar />
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
            <p className="font-semibold">จำนวนรายงานทั้งหมด: {allReports.length}</p>
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
          {renderReportList(filteredUserReports, currentUserPage, setCurrentUserPage, "รายการแจ้งซ่อมของคุณ")}
          {renderReportList(filteredOtherReports, currentOtherPage, setCurrentOtherPage, "รายการแจ้งซ่อมของผู้อื่น")}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;