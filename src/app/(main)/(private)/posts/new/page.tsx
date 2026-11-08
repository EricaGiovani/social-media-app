"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/api/posts";
import { cn } from "@/lib/utils";
import { TextArea } from "@/components/shared/textarea"; 

const icons = {
  upload: "/IconUpload.svg",
  change: "/IconChangeImage.svg",
  remove: "/IconDelete.svg",
};

const maxSizes= 5 * 1024 * 1024;
const types = ["image/png", "image/jpeg", "image/webp"];

const validate = (f: File) =>
  !types.includes(f.type)
    ? "Use PNG, JPG, or WEBP"
    : f.size > maxSizes
      ? "Max file size is 5MB"
      : "";

export default function CreatePostPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);

  const { register, handleSubmit } = useForm<{ caption: string }>({
    defaultValues: { caption: "" },
  });

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const setImage = (f?: File) => {
    if (!f) return;
    const err = validate(f);
    if (err) {
      setImageError(err);
      return;
    }
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const url = URL.createObjectURL(f);
    previewRef.current = url;
    setFile(f);
    setPreview(url);
    setImageError("");
  };

  const removeImage = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const mutation = useMutation({
    mutationFn: ({ file, caption }: { file: File; caption: string }) => {
      const fd = new FormData();
      fd.append("image", file);
      if (caption.trim()) fd.append("caption", caption.trim());
      return createPost(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["my-posts"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Success Post");
      router.push("/feed");
    },
  });

  const onSubmit = handleSubmit((v) => {
    if (!file) {
      setImageError("Photo is required");
      return;
    }
    mutation.mutate({ file, caption: v.caption });
  });

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 font-bold text-md xl:text-display-xs md:text-[19px] text-gray-25"
      >
        <Image src="/ArrowLeft.svg" alt="" width={20} height={20}/> Add Post
      </button>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-25">Photo</p>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              setImage(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          {preview ? (
            <div className="space-y-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-900">
                <Image
                  src={preview}
                  alt="Selected photo preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-2 text-sm font-medium"
                >
                  <Image src={icons.change} alt="" width={20} height={20} />
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-2 text-sm font-medium text-red"
                >
                  <Image src={icons.remove} alt="" width={20} height={20} />
                  Delete Image
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                setImage(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center",
                dragging && "border-primary bg-gray-900",
                imageError && "border-red",
              )}
            >
              <span className="flex size-10 items-center justify-center rounded-lg border border-border">      
                <Image src={icons.upload} alt="" width={20} height={20} /> 
              </span>
  
              <span className="text-sm font-semibold">
                <span className="font-bold text-primary-200">
                  Click to upload
                </span>{" "}
                or drag and drop
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                PNG or JPG (max 5mb)
              </span>
            </button>
          )}

          {imageError && <p className="text-xs text-red">{imageError}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="caption" className="text-sm font-bold text-gray-25">
            Caption
          </label>
          <TextArea
            id="caption"
            placeholder="Create your caption"
            {...register("caption")}
          />
        </div>

        {mutation.error && (
          <p className="text-md text-red">{mutation.error.message}</p>
        )}

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="h-12 w-full rounded-full text-md font-bold"
        >
          {mutation.isPending ? "Sharing..." : "Share"}
        </Button>
      </form>
    </div>
  );
}