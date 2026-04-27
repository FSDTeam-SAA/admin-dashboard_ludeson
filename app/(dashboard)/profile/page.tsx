"use client";

import { Camera, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  changePassword,
  getProfile,
  toApiError,
  updateProfile,
  uploadProfileImage,
} from "@/lib/api";
import { getFullName } from "@/lib/utils";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileForm, setProfileForm] = useState<{
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
  } | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      setIsEditing(false);
      setProfileForm(null);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: async () => {
      toast.success("Profile image updated.");
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully.");
      setShowPasswordForm(false);
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
    }
    event.target.value = "";
  }

  if (profileQuery.isLoading) {
    return <Skeleton className="h-160 rounded-[20px]" />;
  }

  if (!profileQuery.data) {
    return (
      <EmptyState
        title="Profile unavailable"
        description="The current admin profile could not be loaded."
      />
    );
  }

  const profile = profileQuery.data;
  const profileValues = profileForm ?? {
    first_name: profile.first_name ?? "",
    last_name: profile.last_name ?? "",
    phone_number: profile.phone_number ?? "",
    address: profile.address ?? "",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-5 pt-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <ProfileAvatar user={profile} size="lg" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadImageMutation.isPending}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100 disabled:cursor-not-allowed"
                aria-label="Upload profile image"
              >
                <Camera className="size-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {getFullName(profile)}
              </h1>
              <p className="text-xl text-(--muted-foreground)">
                {profile.email}
              </p>
            </div>
          </div>
          <StatusPill value={profile.role} className="min-w-32" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Contact Information</CardTitle>
          {isEditing ? (
            <Button
              loading={updateProfileMutation.isPending}
              onClick={() => updateProfileMutation.mutate(profileValues)}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setProfileForm({
                  first_name: profile.first_name ?? "",
                  last_name: profile.last_name ?? "",
                  phone_number: profile.phone_number ?? "",
                  address: profile.address ?? "",
                });
                setIsEditing(true);
              }}
            >
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              First Name
            </label>
            <Input
              value={profileValues.first_name}
              disabled={!isEditing}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...(current ?? profileValues),
                  first_name: event.target.value,
                }))
              }
              placeholder="First Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Last Name
            </label>
            <Input
              value={profileValues.last_name}
              disabled={!isEditing}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...(current ?? profileValues),
                  last_name: event.target.value,
                }))
              }
              placeholder="Last Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input value={profile.email} disabled placeholder="Email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <Input
              value={profileValues.phone_number}
              disabled={!isEditing}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...(current ?? profileValues),
                  phone_number: event.target.value,
                }))
              }
              placeholder="Phone Number"
            />
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-4">
            <label className="text-sm font-medium text-foreground">
              Address
            </label>
            <Input
              value={profileValues.address}
              disabled={!isEditing}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...(current ?? profileValues),
                  address: event.target.value,
                }))
              }
              placeholder="Address"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          className="cursor-pointer flex-row items-center justify-between"
          onClick={() => setShowPasswordForm((value) => !value)}
        >
          <CardTitle>Change Password</CardTitle>
          {showPasswordForm ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </CardHeader>
        {showPasswordForm ? (
          <CardContent className="space-y-5">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.current_password}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        current_password: event.target.value,
                      }))
                    }
                    placeholder="Current Password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.new_password}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        new_password: event.target.value,
                      }))
                    }
                    placeholder="New Password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirm_password}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        confirm_password: event.target.value,
                      }))
                    }
                    placeholder="Confirm Password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                loading={changePasswordMutation.isPending}
                onClick={() => changePasswordMutation.mutate(passwordForm)}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}
