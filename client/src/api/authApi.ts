import httpClient from "./httpClient";
import { endpoints } from "./endpoints";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  createdAt?: string;
}

export interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
}

interface MeResponse {
  user: User;
}

interface UpdateProfileResponse {
  message: string;
  user: User;
}

interface UploadPhotoResponse {
  message: string;
  profilePhoto: string;
}

export async function registerUser(data: RegisterData) {
  const response = await httpClient.post<RegisterResponse>(
    endpoints.auth.register,
    data,
  );

  return response.data;
}

export async function loginUser(data: LoginData) {
  const response = await httpClient.post<LoginResponse>(
    endpoints.auth.login,
    data,
  );

  return response.data;
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await httpClient.post<RefreshResponse>(
    endpoints.auth.refresh,
    {
      refreshToken,
    },
  );

  return response.data.accessToken;
}

export async function getCurrentUser() {
  const response = await httpClient.get<MeResponse>(endpoints.users.me);

  return response.data.user;
}

export async function updateProfile(data: UpdateProfileData) {
  const response = await httpClient.patch<UpdateProfileResponse>(
    endpoints.users.me,
    data,
  );

  return response.data.user;
}

export async function changePassword(data: ChangePasswordData) {
  const response = await httpClient.patch<{ message: string }>(
    endpoints.users.password,
    data,
  );

  return response.data.message;
}

export async function uploadProfilePhoto(file: File) {
  const formData = new FormData();

  formData.append("photo", file);

  const response = await httpClient.patch<UploadPhotoResponse>(
    endpoints.users.photo,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.profilePhoto;
}
