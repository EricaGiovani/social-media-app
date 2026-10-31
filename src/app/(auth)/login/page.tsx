"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginValues } from "@/schemas/auth";
import { login } from "@/lib/api/auth";
import { setToken } from "@/store/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      dispatch(setToken(res.data.token));
      router.push("/feed");
    },
  });

  return (
    <>
      <h1 className="mt-4 text-xl text-center xl:text-display-xs md:text-[22px] font-bold">Welcome Back!</h1>

      <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Toggle password"
              >
                {show ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {mutation.error && (
            <p className="text-sm text-destructive">{mutation.error.message}</p>
          )}

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-12 rounded-full bg-primary-300 text-md text-bold text-gray-25"
          >
            {mutation.isPending ? "Loading..." : "Login"}
          </Button>
        </form>

        <p className="text-center xl:text-md md:text-[15px] text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary">
            Register
          </Link>
        </p>
    </>
  );
}