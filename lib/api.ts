"use client";

import axios, {
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getBaseUrl } from "@/lib/utils";
import type {
  AdminProfile,
  ApiEnvelope,
  ChangePasswordPayload,
  DashboardPeriod,
  DashboardSummary,
  DriverDetail,
  DriversResponse,
  ForgotPasswordPayload,
  NewDriversResponse,
  PaginationQuery,
  PassengerDetail,
  PassengersResponse,
  ProfileUpdatePayload,
  ResetPasswordPayload,
  SupportTicketsResponse,
  TopDriversResponse,
  UserStatusSummary,
  VerifyOtpPayload,
} from "@/types";

class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

const publicApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

function applyHeader(config: InternalAxiosRequestConfig, key: string, value: string) {
  const headers = AxiosHeaders.from(config.headers);
  headers.set(key, value);
  config.headers = headers;
}

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const { getSession } = await import("next-auth/react");
  const session = await getSession();

  if (session?.accessToken) {
    applyHeader(config, "Authorization", `Bearer ${session.accessToken}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "Unable to complete the request.";

    if (typeof window !== "undefined" && error.response?.status === 401) {
      const pathname = window.location.pathname;
      if (!pathname.startsWith("/sign-in")) {
        const { signOut } = await import("next-auth/react");
        await signOut({ callbackUrl: "/sign-in" });
      }
    }

    return Promise.reject(new ApiRequestError(message, error.response?.status));
  },
);

function unwrapData<T>(response: AxiosResponse<ApiEnvelope<T>>) {
  return response.data.data;
}

function buildListParams(params?: PaginationQuery) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const response = await publicApi.post<ApiEnvelope<Record<string, never>>>(
    "/auth/forgot-password",
    payload,
  );
  return response.data;
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  const response = await publicApi.post<ApiEnvelope<{ reset_token: string }>>(
    "/auth/verify-otp",
    payload,
  );
  return response.data.data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await publicApi.post<ApiEnvelope<Record<string, never>>>(
    "/auth/reset-password",
    payload,
  );
  return response.data;
}

export async function logoutApi() {
  const response = await api.post<ApiEnvelope<Record<string, never>>>("/auth/logout");
  return response.data;
}

export async function getProfile() {
  const response = await api.get<ApiEnvelope<AdminProfile>>("/auth/me");
  return unwrapData(response);
}

export async function updateProfile(payload: ProfileUpdatePayload) {
  const response = await api.put<ApiEnvelope<{ user: AdminProfile }>>("/users/profile", payload);
  return response.data.data.user;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const response = await api.put<ApiEnvelope<Record<string, never>>>(
    "/users/change-password",
    payload,
  );
  return response.data;
}

export async function getDashboardSummary(
  period: DashboardPeriod,
  dates?: { startDate?: string; endDate?: string },
) {
  const response = await api.get<ApiEnvelope<DashboardSummary>>("/admin/dashboard", {
    params: {
      period,
      start_date: dates?.startDate,
      end_date: dates?.endDate,
    },
  });
  return unwrapData(response);
}

export async function getUserStatus() {
  const response = await api.get<ApiEnvelope<UserStatusSummary>>(
    "/admin/dashboard/user-status",
  );
  return unwrapData(response);
}

export async function getTopDrivers(
  period: DashboardPeriod,
  dates?: { startDate?: string; endDate?: string },
) {
  const response = await api.get<ApiEnvelope<TopDriversResponse>>(
    "/admin/dashboard/top-drivers",
    {
      params: {
        period,
        start_date: dates?.startDate,
        end_date: dates?.endDate,
      },
    },
  );
  return unwrapData(response);
}

export async function getNewDrivers() {
  const response = await api.get<ApiEnvelope<NewDriversResponse>>(
    "/admin/dashboard/new-drivers",
  );
  return unwrapData(response);
}

export async function getPassengers(params: PaginationQuery) {
  const response = await api.get<ApiEnvelope<PassengersResponse>>("/admin/passengers", {
    params: buildListParams(params),
  });
  return unwrapData(response);
}

export async function getPassengerDetail(id: string) {
  const response = await api.get<ApiEnvelope<PassengerDetail>>(`/admin/passengers/${id}`);
  return unwrapData(response);
}

export async function blockPassenger(id: string, reason?: string) {
  const response = await api.put<ApiEnvelope<Record<string, never>>>(
    `/admin/passengers/${id}/block`,
    reason ? { reason } : undefined,
  );
  return response.data;
}

export async function getDrivers(params: PaginationQuery) {
  const response = await api.get<ApiEnvelope<DriversResponse>>("/admin/drivers", {
    params: buildListParams(params),
  });
  return unwrapData(response);
}

export async function getDriverDetail(id: string) {
  const response = await api.get<ApiEnvelope<DriverDetail>>(`/admin/drivers/${id}`);
  return unwrapData(response);
}

export async function approveDriver(id: string) {
  const response = await api.put<ApiEnvelope<Record<string, never>>>(
    `/admin/drivers/${id}/approve`,
  );
  return response.data;
}

export async function rejectDriver(id: string) {
  const response = await api.put<ApiEnvelope<Record<string, never>>>(
    `/admin/drivers/${id}/reject`,
  );
  return response.data;
}

export async function blockDriver(id: string, reason?: string) {
  const response = await api.put<ApiEnvelope<Record<string, never>>>(
    `/admin/drivers/${id}/block`,
    reason ? { reason } : undefined,
  );
  return response.data;
}

export async function getSupportTickets(params: PaginationQuery) {
  const response = await api.get<ApiEnvelope<SupportTicketsResponse>>("/admin/support", {
    params: buildListParams(params),
  });
  return unwrapData(response);
}

export function toApiError(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiRequestError(error.message);
  }

  return new ApiRequestError("Something went wrong.");
}
