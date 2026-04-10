import Sidebar from '../../components/admin/sidebar';
import Header from '../../common/Header';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-8 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
