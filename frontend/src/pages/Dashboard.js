import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import io from 'socket.io-client';

const Dashboard = () => {
  const [allReports, setAllReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showMenu, setShowMenu] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allReportsData = response.data;
      setAllReports(allReportsData.filter(report => report.createdBy !== user._id));
      setUserReports(allReportsData.filter(report => report.createdBy === user._id));
      setError('');
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user._id, token]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    fetchReports();

    socket.on('newReport', fetchReports);
    socket.on('updateReport', fetchReports);
    socket.on('deleteReport', fetchReports);

    return () => socket.disconnect();
  }, [fetchReports]);

  const deleteReport = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายงานนี้?')) {
      try {
        await api.delete(`/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchReports();
        setShowMenu(null);
        setError('');
      } catch (error) {
        console.error('Error deleting report:', error);
        if (error.response && error.response.status === 403) {
          setError('คุณไม่มีสิทธิ์ลบรายงานนี้');
        } else if (error.response && error.response.status === 404) {
          setError('ไม่พบรายงานที่ต้องการลบ');
        } else {
          setError('เกิดข้อผิดพลาดในการลบรายงาน โปรดลองอีกครั้งในภายหลัง');
        }
      }
    }
  };

  const editReport = (id) => {
    // TODO: Implement edit functionality
    console.log('Edit report', id);
    setShowMenu(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const getUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };

  const filterReports = (reports) => {
    return reports.filter(report => 
      (!categoryFilter || report.category === categoryFilter) &&
      (!statusFilter || report.status === statusFilter)
    );
  };

  const renderReportList = (reports, title) => (
    <div className="mb-8">
      {reports.length > 0 && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
      {reports.length === 0 ? (
        <p>ไม่มีรายการแจ้งซ่อมในขณะนี้</p>
      ) : (
        <ul className="space-y-4">
          {filterReports(reports).map((report) => (
            <li key={report._id} className="border p-4 rounded shadow bg-white relative">
              {report.createdBy === user._id && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setShowMenu(showMenu === report._id ? null : report._id)}
                    className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {showMenu === report._id && (
                    <div className="absolute top-10 right-0 bg-white p-2 shadow rounded z-10">
                      <button
                        onClick={() => editReport(report._id)}
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                      >
                        แก้ไขรายงาน
                      </button>
                      <button
                        onClick={() => deleteReport(report._id)}
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500"
                      >
                        ลบรายงาน
                      </button>
                    </div>
                  )}
                </div>
              )}
              <h4 className="font-bold text-lg">{report.name}</h4>
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
      )}
    </div>
  );

  if (loading) {
    return <div className="text-center mt-8">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-white relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* SVG background elements */}
      </div>
      <div className="relative z-10 container mx-auto mt-10 p-4">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">แดชบอร์ด</h2>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">ทุกหมวดหมู่</option>
                <option value="ไมค์โครโฟน">ไมค์โครโฟน</option>
                <option value="อินเตอร์เน็ต">อินเตอร์เน็ต</option>
                <option value="โปรเจคเตอร์">โปรเจคเตอร์</option>
                <option value="จอแสดงภาพ">จอแสดงภาพ</option>
                <option value="ลำโพง">ลำโพง</option>
                <option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">ทุกสถานะ</option>
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
              </select>
            </div>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {user && user.email && (
            <p className="mb-4">
              รหัสนักศึกษาของคุณคือ {getUsernameFromEmail(user.email)}!
            </p>
          )}

          {renderReportList(userReports, "รายการแจ้งซ่อมของคุณ")}
          {renderReportList(allReports, "รายการแจ้งซ่อมทั้งหมด")}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;