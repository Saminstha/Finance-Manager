import { useRef, useState, type ChangeEvent } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "@/components/ui/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/auth/authSlice";
import { updateProfile, uploadProfilePhoto } from "@/api/authApi";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  phone: z
    .string()
    .trim()
    .regex(/^9[678]\d{8}$/, "Enter a valid phone number"),

  dateOfBirth: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),

    values: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      dateOfBirth: user?.dateOfBirth?.slice(0, 10) ?? "",
    },
  });

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const profilePhoto = await uploadProfilePhoto(file);

      if (user) {
        dispatch(setUser({ ...user, profilePhoto }));
      }

      toast.success("Profile photo updated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update profile photo",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updatedUser = await updateProfile({
        name: data.name,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth || undefined,
      });

      dispatch(setUser({ ...user, ...updatedUser }));

      toast.success("Profile updated successfully");

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>

          <DialogDescription>
            Update your personal details and profile photo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage src={user?.profilePhoto} alt={user?.name} />

              <AvatarFallback className="text-lg">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <button
              type="button"
              aria-label="Change profile photo"
              disabled={isUploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/80 disabled:opacity-50"
            >
              <Camera className="size-3.5" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>

            <Input id="profile-name" {...register("name")} />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">Phone</Label>

            <Input id="profile-phone" {...register("phone")} />

            {errors.phone && (
              <p className="text-sm text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-dob">Date of Birth</Label>

            <Input id="profile-dob" type="date" {...register("dateOfBirth")} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
