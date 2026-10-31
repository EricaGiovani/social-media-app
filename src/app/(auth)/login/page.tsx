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
import Image from "next/image";

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] h-[120vh] w-[200vw] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-[#5613A3] to-[#522BC8] blur-[150px]"/>

      <div className="relative z-10 w-full max-w-sm space-y-6 rounded-2xl bg-card p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Image src="/icon Sociality.svg" alt="" width={30} height={30} priority />
            <span className="text-display-xs font-bold">Sociality</span>
          </div>
            <h1 className="mt-4 text-xl xl:text-display-xs md:text-[22px] font-bold">Welcome Back!</h1>
        </div>

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
            className="w-full rounded-full bg-primary-300"
          >
            {mutation.isPending ? "Loading..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}