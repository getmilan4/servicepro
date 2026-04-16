"use client";

import { useState } from "react";
import { login, register } from "./actions";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = isLogin
      ? await login(formData)
      : await register(formData);

    if (res?.success) {
      router.push("/dashboard");
    } else {
      alert(res?.message || "Error");
    }
  }

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create account" : "Already have an account?"}
      </button>
    </div>
  );
}