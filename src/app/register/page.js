"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);
  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      setUserCreated(true);
    } else {
      setError(true);
    }
    setCreatingUser(false);
  }
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        Đăng ký
      </h1>
      {userCreated && (
        <div className="my-4 text-center">
          Đã có tài khoản? 
          <br />
          Hãy{" "}
          <Link className="underline" href={"/login"}>
           Đăng nhập &raquo;
          </Link>
        </div>
      )}
      {error && (
        <div className="my-4 text-center">
          Đã có Lỗi
          <br />
          Xin thử lại
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder={"E-mail"}
          value={email}
          
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <input
          type="password"
          placeholder={"Mật khẩu"}
          value={password}
          
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button type="submit-1">
         Đăng ký
        </button>
        <div className="my-4 text-center text-gray-500">
          {"Hoặc đăng nhập với nhà cung cấp"}
      </div>
      <div>
          <button type="button" onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex gap-4 justify-center">
            <Image src={'/google.png'} alt={''} width={24} height={24} />
            {"Đăng nhập bằng google"}
          </button>
      </div>
      </form>
    </section>
  );
}

