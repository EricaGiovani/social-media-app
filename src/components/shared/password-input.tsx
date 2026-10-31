"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? "text" : "password"} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        aria-label="Toggle password"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}