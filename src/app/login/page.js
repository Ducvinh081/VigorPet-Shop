'use client';
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);

    await signIn('credentials', { email, password, callbackUrl: '/' });

    setLoginInProgress(false);
  }
  
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        {"Đăng nhập"}
      </h1>
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="email" name="email" placeholder={"E-mail"} value={email}
          
          onChange={ev => setEmail(ev.target.value)} />
        <input type="password" name="password" placeholder={"Password"} value={password}
          
          onChange={ev => setPassword(ev.target.value)} /> 
        <button onClick={() => signIn('Credentials', { callbackUrl: '/' })}  type="submit-1">
          Đăng nhập</button>
      </form>
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
      
    </section>
  );
}