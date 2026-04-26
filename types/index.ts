import type { DefaultSession } from "next-auth";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type SessionUser = DefaultSession["user"] & {
  id: string;
  role: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  status?: string;
};

export interface AuthLoginData {
  access_token: string;
  refresh_token: string;
  user: {
    _id: string;
    username?: string;
    email: string;
    role: string;
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;
    status: string;
  };
}

export type DashboardPeriod = "month" | "3month" | "6month" | "custom";

export interface DashboardMetric {
  value: number;
  change_pct: number;
}

export interface DashboardSummary {
  total_active_passengers: DashboardMetric;
  total_active_drivers: DashboardMetric;
  drivers_total_earning: DashboardMetric;
  your_total_earning: DashboardMetric;
  total_ride_completed: DashboardMetric;
}

export interface UserStatusSummary {
  passengers_count: number;
  drivers_count: number;
  passengers_pct: string;
  drivers_pct: string;
}

export interface UserReference {
  _id: string;
  username?: string;
  email: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  profile_image_url?: string;
  status: string;
  createdAt: string;
}

export interface PassengerListItem extends UserReference {
  role: "passenger";
  total_rides: number;
  total_amount: number;
}

export interface PassengerDetail extends PassengerListItem {
  total_spent: number;
  join_date: string;
}

export interface DriverDocuments {
  passport_image_url?: string;
  driving_license_front_url?: string;
  driving_license_back_url?: string;
  insurance_card_url?: string;
  vehicle_image_url?: string;
}

export interface DriverListItem {
  _id: string;
  user_id: UserReference;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  vehicle_color: string;
  vehicle_plate_number: string;
  vehicle_year: string;
  approval_status: "pending" | "active" | "inactive" | "blocked";
  total_earnings: number;
  total_rides: number;
  rating_avg: number;
  rating_count: number;
  documents?: DriverDocuments;
  can_approve: boolean;
  createdAt: string;
}

export interface DriverDetail {
  _id: string;
  user: UserReference;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  vehicle_color: string;
  vehicle_plate_number: string;
  vehicle_year: string;
  approval_status: "pending" | "active" | "inactive" | "blocked";
  total_earnings: number;
  total_rides: number;
  rating_avg: number;
  rating_count: number;
  createdAt: string;
  documents: DriverDocuments;
}

export interface TopDriver {
  driver_name: string;
  total_earnings: number;
  vehicle_model?: string;
}

export interface TopDriversResponse {
  top_drivers: TopDriver[];
}

export interface NewDriversResponse {
  drivers: DriverListItem[];
}

export interface PassengersResponse {
  passengers: PassengerListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface DriversResponse {
  drivers: DriverListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SupportTicket {
  _id: string;
  user_id: UserReference;
  role: "passenger" | "driver";
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

export interface SupportTicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
}

export interface AdminProfile extends UserReference {
  role: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
