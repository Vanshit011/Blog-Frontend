import PublicBlogView from './PublicBlogView';
import Navbar from '../../common/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <PublicBlogView />
      </main>
    </div>
  );
};

export default Home;
