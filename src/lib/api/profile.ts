import { api } from "./client";
import type { ApiResponse } from "./auth";
import { FEED_LIMIT, type Author, type Pagination, type Post } from "./posts";

export type Profile = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export type ProfileStats = {
  posts: number;
  followers: number;
  following: number;
  likes: number;
};

export type PublicUser = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  counts: { post: number; followers: number; following: number; likes: number };
  isFollowing: boolean;
  isMe: boolean;
};

export type Paged<T> = { items: T[]; pagination: Pagination };
export type GridPost = Pick<Post, "id" | "imageUrl" | "caption">;
export type FollowUser = Author & { isFollowedByMe: boolean };

const enc = encodeURIComponent;

async function fetchList<T>(
  path: string,
  key: "posts" | "users",
  page: number,
): Promise<Paged<T>> {
  const res = await api<
    ApiResponse<{ pagination: Pagination } & Record<string, unknown>>
  >(`${path}?page=${page}&limit=${FEED_LIMIT}`);
  return { items: res.data[key] as T[], pagination: res.data.pagination };
}

export const getMe = () =>
  api<ApiResponse<{ profile: Profile; stats: ProfileStats }>>("/api/me");

export const updateMe = (form: FormData) =>
  api<ApiResponse<Omit<Profile, "createdAt"> & { updatedAt: string }>>(
    "/api/me",
    { method: "PATCH", body: form },
  );

export const getMyPosts = async (page: number) => {
  const res = await api<ApiResponse<Paged<Post>>>(
    `/api/me/posts?page=${page}&limit=${FEED_LIMIT}`,
  );
  return res.data;
};

export const getMyLikes = (page: number) =>
  fetchList<GridPost>("/api/me/likes", "posts", page);

export const getMySaved = (page: number) =>
  fetchList<GridPost>("/api/me/saved", "posts", page);

export const getMyFollowers = (page: number) =>
  fetchList<FollowUser>("/api/me/followers", "users", page);

export const getMyFollowing = (page: number) =>
  fetchList<FollowUser>("/api/me/following", "users", page);

export const getUser = (username: string) =>
  api<ApiResponse<PublicUser>>(`/api/users/${enc(username)}`);

export const getUserPosts = (username: string, page: number) =>
  fetchList<GridPost>(`/api/users/${enc(username)}/posts`, "posts", page);

export const getUserLikes = (username: string, page: number) =>
  fetchList<GridPost>(`/api/users/${enc(username)}/likes`, "posts", page);

export const getUserFollowers = (username: string, page: number) =>
  fetchList<FollowUser>(`/api/users/${enc(username)}/followers`, "users", page);

export const getUserFollowing = (username: string, page: number) =>
  fetchList<FollowUser>(`/api/users/${enc(username)}/following`, "users", page);

export const searchUsers = async (
  q: string,
  page: number,
): Promise<Paged<FollowUser>> => {
  const res = await api<
    ApiResponse<{ users: FollowUser[]; pagination: Pagination }>
  >(`/api/users/search?q=${enc(q)}&page=${page}&limit=${FEED_LIMIT}`);
  return { items: res.data.users, pagination: res.data.pagination };
};