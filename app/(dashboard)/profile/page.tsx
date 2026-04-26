"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
} from "@/lib/api";
import { getFullName } from "@/lib/utils";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
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

  if (profileQuery.isLoading) {
    return <Skeleton className="h-[640px] rounded-[20px]" />;
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
            <ProfileAvatar user={profile} size="lg" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[var(--foreground)]">{getFullName(profile)}</h1>
              <p className="text-2xl text-[var(--muted-foreground)]">{profile.email}</p>
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
            <label className="text-sm font-medium text-[var(--foreground)]">First Name</label>
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
            <label className="text-sm font-medium text-[var(--foreground)]">Last Name</label>
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
            <label className="text-sm font-medium text-[var(--foreground)]">Email</label>
            <Input value={profile.email} disabled placeholder="Email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">Phone Number</label>
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
            <label className="text-sm font-medium text-[var(--foreground)]">Address</label>
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
          {showPasswordForm ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </CardHeader>
        {showPasswordForm ? (
          <CardContent className="space-y-5">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      current_password: event.target.value,
                    }))
                  }
                  placeholder="Current Password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      new_password: event.target.value,
                    }))
                  }
                  placeholder="New Password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirm_password: event.target.value,
                    }))
                  }
                  placeholder="Confirm Password"
                />
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
