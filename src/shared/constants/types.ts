export interface ErrorResponse {
  message: string;
}

export interface Author {
  id: string;
  first_name: string;
  last_name: string;
  user_name?: string;
  about?: string;
  display_name?: string;
  profile_picture?: string;
}
export interface Comment {
  display_name: string;
  id: string;
  content: string;
  created_at: string;
  user?: Author;
  userId?: string;
}

export interface Like {
  id: string;
  userId: string;
  blogId: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at?: string;
  status?: string;
  author?: Author;
  coverImage?: string;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  comments?: Comment[];
  categoryId?: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
}

export interface EditBlogForm {
  title: string;
  content: string;
  slug: string;
  coverImage: string;
  status: string;
  keywords?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  created_at: string;
}
export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}
