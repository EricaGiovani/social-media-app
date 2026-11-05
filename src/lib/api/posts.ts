import { api } from "./client";
import type { ApiResponse } from "./auth";

export const FEED_LIMIT = 20;
export const COMMENTS_LIMIT = 10;

export type SavedPost = Pick<Post, "id" | "imageUrl" | "caption" | "createdAt">;

export type LikeUser = Author & {
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Author = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type Post = {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export type Comment = {
  id: number;
  text: string;
  createdAt: string;
  author: Author;
  isMine?: boolean;
};

export type CommentsRes = ApiResponse<{
  comments: Comment[];
  pagination: Pagination;
}>;

export type PostsPage = { items: Post[]; pagination: Pagination };

export const getFeed = async (page: number): Promise<PostsPage> => {
  const res = await api<ApiResponse<PostsPage>>(
    `/api/feed?page=${page}&limit=${FEED_LIMIT}`,
  );
  return { items: res.data.items, pagination: res.data.pagination };
};

export const getPosts = async (page: number): Promise<PostsPage> => {
  const res = await api<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
    `/api/posts?page=${page}&limit=${FEED_LIMIT}`,
  );
  return { items: res.data.posts, pagination: res.data.pagination };
};

export const likePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}/like`, { method: "POST" });

export const unlikePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}/like`, { method: "DELETE" });

export const savePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}/save`, { method: "POST" });

export const unsavePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}/save`, { method: "DELETE" });

export const getSaved = (page: number) =>
  api<ApiResponse<{ posts: SavedPost[] }>>(
    `/api/me/saved?page=${page}&limit=${FEED_LIMIT}`,
  );

export const getPostLikes = async (
  id: number,
  page = 1,
): Promise<{ items: LikeUser[]; pagination: Pagination }> => {
  const res = await api<
    ApiResponse<{ users: LikeUser[]; pagination: Pagination }>
  >(`/api/posts/${id}/likes?page=${page}&limit=${FEED_LIMIT}`);
  return { items: res.data.users, pagination: res.data.pagination };
};

export const followUser = (username: string) =>
  api<ApiResponse<unknown>>(`/api/follow/${encodeURIComponent(username)}`, {
    method: "POST",
  });

export const unfollowUser = (username: string) =>
  api<ApiResponse<unknown>>(`/api/follow/${encodeURIComponent(username)}`, {
    method: "DELETE",
  });

  export const getPost = (id: number) => api<ApiResponse<Post>>(`/api/posts/${id}`);

export const deletePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}`, { method: "DELETE" });

export const getComments = (id: number, page: number) =>
  api<CommentsRes>(`/api/posts/${id}/comments?page=${page}&limit=${COMMENTS_LIMIT}`);

export const addComment = (id: number, text: string) =>
  api<ApiResponse<Comment>>(`/api/posts/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });

export const deleteComment = (id: number) =>
  api<ApiResponse<unknown>>(`/api/comments/${id}`, { method: "DELETE" });

export const createPost = (form: FormData) =>
  api<ApiResponse<Post>>("/api/posts", { method: "POST", body: form });