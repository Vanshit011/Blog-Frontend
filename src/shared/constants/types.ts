export interface ErrorResponse {
  message: string;
}

export interface Author {
  id: string;
  first_name: string;
  last_name: string;
  username?: string;
  about?: string;
  display_name?: string;
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
}

export interface EditBlogForm {
  title: string;
  content: string;
  slug: string;
  coverImage: string;
  status: string;
  keywords?: string;
}
