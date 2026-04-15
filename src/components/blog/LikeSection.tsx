import { Heart } from 'lucide-react';
import { getLikes, likeBlog, unlikeBlog } from '../../services/api';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface LikeSectionProps {
  blogId: string;
  userId?: string | null;
  token?: string | null;
}

const LikeSection = ({ blogId, userId, token }: LikeSectionProps) => {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!blogId) return;

    const fetchLikes = async () => {
      try {
        const res = await getLikes(blogId);
        const data = res.data;
        setLikes(data?.count ?? 0);
        setIsLiked(data?.isLiked ?? false);
      } catch {
        console.error('Failed to fetch likes');
      }
    };

    fetchLikes();
  }, [blogId, userId]);

  const handleLike = async () => {
    if (!token) {
      toast.info('Please login first');
      return;
    }

    if (loading) return;

    const wasLiked = isLiked;

    setIsLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    setLoading(true);

    try {
      if (wasLiked) {
        await unlikeBlog(blogId);
      } else {
        await likeBlog(blogId);
      }
    } catch (err) {
      setIsLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));

      if (err?.response?.data?.message !== 'You already liked this blog') {
        toast.error('Like failed');
        setIsLiked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      title={isLiked ? 'Unlike this post' : 'Like this post'}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 shadow-sm select-none ${
        isLiked
          ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600 shadow-rose-200 shadow-md'
          : 'bg-white border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50'
      } ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 ${
          isLiked ? 'fill-white scale-110' : 'fill-none'
        }`}
      />
      <span>{likes}</span>
      <span>{isLiked ? 'Liked' : 'Like'}</span>
    </button>
  );
};

export default LikeSection;
