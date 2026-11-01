import { api } from "./client";
import type { ApiResponse } from "./auth";

export const FEED_LIMIT = 20;

export type Author = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export type FeedPage = ApiResponse<{ items: Post[] }>;

export const getFeed = (page: number) =>
  api<FeedPage>(`/api/feed?page=${page}&limit=${FEED_LIMIT}`);

export const likePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}/like`, { method: "POST" });

export const unlikePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}/like`, { method: "DELETE" });