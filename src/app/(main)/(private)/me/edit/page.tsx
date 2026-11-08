"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileSchema, type ProfileValues } from "@/schemas/profile";
import { updateMe } from "@/lib/api/profile";
import { useMe } from "@/hooks/use-profile";
import { useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/authSlice";
import { fixUrl } from "@/lib/url";
import Image from "next/image";
import { TextArea } from "@/components/shared/textarea";

const maxSize = 5 * 1024 * 1024;
const types = ["image/png", "image/jpeg", "image/webp"];

export default function EditProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useMe();
  const profile = data?.data.profile;

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          name: profile.name,
          username: profile.username,
          phone: profile.phone,
          bio: profile.bio ?? "",
        }
      : undefined,
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!types.includes(f.type)) {
      setFileError("Use PNG, JPG, or WEBP");
      return;
    }
    if (f.size > maxSize) {
      setFileError("Max file size is 5MB");
      return;
    }
    setFileError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const mutation = useMutation({
    mutationFn: (v: ProfileValues) => {
      const fd = new FormData();
      fd.append("name", v.name);
      fd.append("username", v.username);
      fd.append("phone", v.phone);
      fd.append("bio", v.bio);
      if (file) fd.append("avatar", file);
      return updateMe(fd);
    },
    onSuccess: (res) => {
      const { name, username, phone, avatarUrl } = res.data;
      dispatch(updateUser({ name, username, phone, avatarUrl }));
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["my-posts"] });
      toast.success("Profile Success Update");
      router.push("/me");
    },
  });

  if (isLoading || !profile) {
    return <div className="h-96 animate-pulse rounded-md bg-gray-900" />;
  }

  return (
    <div className="space-y-6">
      <Link href="/me" className="flex items-center gap-2 font-bold text-md xl:text-display-xs md:text-[19px] text-gray-25">
        <Image src="/ArrowLeft.svg" alt="" width={24} height={24}/> Edit Profile
      </Link>

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="space-y-4"
      >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">

      {/* Foto Profil */}
        <div className="flex flex-col items-center gap-2 md:items-center">
          <Avatar className="size-24 md:size-36">
            <AvatarImage src={preview ?? fixUrl(profile.avatarUrl)} alt="" />
            <AvatarFallback>{profile.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm font-bold md:text-[15px]"
        >
          Change Photo
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onPickFile}
          className="hidden"
        />

        {fileError && (
          <p className="text-xs text-destructive">{fileError}</p>
        )}
        </div>

      {/* Form Profile */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            aria-invalid={!!errors.username}
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile.email} disabled readOnly />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Number Phone</Label>
          <Input
            id="phone"
            type="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <TextArea id="bio" {...register("bio")} />
        </div>

        {mutation.error && (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        )}

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="h-12 w-full rounded-full"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
    </form>
  </div>
  );
}