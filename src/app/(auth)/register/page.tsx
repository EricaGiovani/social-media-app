"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/shared/password-input";
import { registerSchema, type RegisterValues } from "@/schemas/auth";
import { register as registerApi } from "@/lib/api/auth";
import { setCredentials } from "@/store/authSlice";
import { getReturnTo } from "@/lib/return-to";


const fields = [
  { name: "name", label: "Name", placeholder: "Enter your name" },
  { name: "username", label: "Username", placeholder: "Enter your username" },
  { name: "email", label: "Email", placeholder: "Enter your email" },
  { name: "phone", label: "Number Phone", placeholder: "Enter your number phone", type: "tel" },
] as const;

const passwordFields = [
  { name: "password", label: "Password", placeholder: "Enter your password" },
  { name: "confirmPassword", label: "Confirm Password", placeholder: "Enter your confirm password" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (res) => {
      dispatch(setCredentials(res.data));
      router.push(getReturnTo());
    },
  });

  return (
    <>
      <h1 className="mt-4 text-xl text-center xl:text-display-xs md:text-[22px] font-bold">Register</h1>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>{f.label}</Label>
              <Input
                id={f.name}
                type={"type" in f ? f.type : "text"}
                placeholder={f.placeholder}
                aria-invalid={!!errors[f.name]}
                {...register(f.name)}
              />
              {errors[f.name] && (
                <p className="text-xs text-destructive">{errors[f.name]?.message}</p>
              )}
            </div>
          ))}

          {passwordFields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>{f.label}</Label>
              <PasswordInput
                id={f.name}
                placeholder={f.placeholder}
                aria-invalid={!!errors[f.name]}
                {...register(f.name)}
              />
              {errors[f.name] && (
                <p className="text-xs text-destructive">{errors[f.name]?.message}</p>
              )}
            </div>
          ))}

          {mutation.error && (
            <p className="text-sm text-destructive">{mutation.error.message}</p>
          )}

          <Button type="submit" disabled={mutation.isPending} className="w-full h-12 rounded-full text-md text-bold text-gray-25 bg-primary-300">
            {mutation.isPending ? "Loading..." : "Submit"}
          </Button>
        </form>

        <p className="text-center text-sm xl:text-md md:text-[15px]">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-200">
            Log in
          </Link>
        </p>
    </>
  );
}