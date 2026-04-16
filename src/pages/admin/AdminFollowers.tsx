import { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/sidebar';
import Header from '../../common/Header';
import { adminGetMyFollowers } from '../../services/api';
import { Users, Search, UserCircle } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '../../hooks/useDebounce';

interface FollowerUser {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  username: string;
  followed_at: string;
}

const AdminFollowers = () => {
  const [activeTab, setActiveTab] = useState<'followers'>('followers');
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [followersRes] = await Promise.all([adminGetMyFollowers()]);
      setFollowers(followersRes.data.followers || []);
    } catch {
      toast.error('Failed to load followers lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredList = useMemo(() => {
    const currentList = activeTab === 'followers' ? followers : [];
    return currentList.filter((user) =>
      `${user.first_name} ${user.last_name} ${user.username}`
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );
  }, [activeTab, followers, debouncedSearch]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Community
                </h1>
                <p className="text-gray-500 font-medium mt-1">
                  Manage your followers
                </p>
              </div>

              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit mb-8">
              <button
                onClick={() => setActiveTab('followers')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'followers'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
                Followers
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'followers' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-600'}`}
                >
                  {followers.length}
                </span>
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"
                  />
                ))}
              </div>
            ) : filteredList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((user) => (
                  <div
                    key={user.id}
                    className="group bg-white p-6 rounded-3xl border border-transparent hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-500">
                          <UserCircle className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                            {user.display_name ||
                              `${user.first_name} ${user.last_name}`}
                          </h3>
                          <p className="text-xs text-indigo-500 font-semibold mb-2">
                            @{user.username}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                            <Calendar size={12} />
                            {activeTab === 'followers'
                              ? 'Followed'
                              : ' since'}{' '}
                            {new Date(user.followed_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <Users className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No members found
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  We couldn't find any {activeTab} matching your current view or
                  search.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminFollowers;

const Calendar = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
