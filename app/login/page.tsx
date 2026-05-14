"use client";

import { useState } from "react";
import { login, register } from "./actions";
import { useRouter } from "next/navigation";
import WhimstackLogo from "@/components/WhimstackLogo";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = isLogin ? await login(formData) : await register(formData);
    if (res?.success) {
      if (isLogin) {
        router.push("/dashboard");
      } else {
        setMessage(res.message || "Registration successful.");
      }
    } else {
      alert(res?.message || "Error");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f4",
      fontFamily: "'Inter', sans-serif",
      padding: "1rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .ws-input {
          width: 100%;
          height: 38px;
          padding: 0 11px;
          border: 1px solid #e2e2e2;
          border-radius: 8px;
          background: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          color: #111;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ws-input:focus {
          border-color: #3B7BF6;
          box-shadow: 0 0 0 3px rgba(59,123,246,0.1);
        }
        .ws-input::placeholder { color: #aaa; }
        .ws-btn {
          width: 100%;
          height: 38px;
          background: #3B7BF6;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ws-btn:hover { background: #2563EB; }
        .ws-btn:active { opacity: 0.9; }
        .ws-toggle {
          background: none;
          border: none;
          color: #3B7BF6;
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }
        .ws-toggle:hover { text-decoration: underline; }
      `}</style>

      <div style={{
        width: "100%",
        maxWidth: "380px",
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: "14px",
        padding: "2rem 2rem 1.75rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>

        {/* Logo */}
        <div style={{ marginBottom: "1.75rem" }}>
          <WhimstackLogo size={72} />
          <p style={{ fontSize: "18px", fontWeight: 600, color: "#111", margin: "10px 0 2px", letterSpacing: "-0.3px" }}>
            Whim<span style={{ color: "#3B7BF6" }}>stack</span>
          </p>
          <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {message && (
          <div style={{
            backgroundColor: "#f0f7ff",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "13px",
            color: "#1d4ed8",
            marginBottom: "1rem",
          }}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.9rem" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 500, color: "#555", marginBottom: "5px" }}>
              Email
            </label>
            <input className="ws-input" name="username" type="email" placeholder="name@company.com" required />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 500, color: "#555", marginBottom: "5px" }}>
              Password
            </label>
            <input className="ws-input" name="password" type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="ws-btn" style={{ marginTop: "1.1rem" }}>
            {isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: "1.25rem",
          paddingTop: "1.1rem",
          borderTop: "1px solid #f0f0f0",
          textAlign: "center",
          fontSize: "12.5px",
          color: "#888",
        }}>
          {isLogin ? "No account? " : "Already have an account? "}
          <button className="ws-toggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Contact your admin" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
