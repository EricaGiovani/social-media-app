import { api } from "./client";
import type { ApiResponse } from "./auth";

export const FEED_LIMIT = 20;

export type SavedPost = Pick<Post, "id" | "imageUrl" | "caption" | "createdAt">;

export type LikeUser = Author & {
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
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

export const savePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}/save`, { method: "POST" });

export const unsavePost = (id: number) =>
  api<ApiResponse<unknown>>(`/api/posts/${id}/save`, { method: "DELETE" });

export const getSaved = (page: number) =>
  api<ApiResponse<{ posts: SavedPost[] }>>(
    `/api/me/saved?page=${page}&limit=${FEED_LIMIT}`,
  );

export const getPostLikes = (id: number, page = 1) =>
  api<ApiResponse<{ users: LikeUser[] }>>(
    `/api/posts/${id}/likes?page=${page}&limit=${FEED_LIMIT}`,
  );

export const followUser = (username: string) =>
  api<ApiResponse<unknown>>(`/api/follow/${encodeURIComponent(username)}`, {
    method: "POST",
  });

export const unfollowUser = (username: string) =>
  api<ApiResponse<unknown>>(`/api/follow/${encodeURIComponent(username)}`, {
    method: "DELETE",
  });