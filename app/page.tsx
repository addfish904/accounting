"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const register = async () => {
    if (!registerEmail || !registerPassword) {
      alert("請輸入 Email 和密碼");
      return;
    }
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      alert("註冊成功，請登入");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          alert("此 Email 已被註冊，請改用其他 Email");
          break;
        case "auth/invalid-email":
          alert("請輸入有效的 Email 格式");
          break;
        case "auth/weak-password":
          alert("密碼長度至少需輸入 6 個字元");
          break;
        default:
          alert(`註冊失敗，請稍後再試`);
      }
    }
  };

  const login = async () => {
    if (!loginEmail || !loginPassword) {
      alert("請輸入 Email 和密碼");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      alert("登入成功");
      setLoginEmail("");
      setLoginPassword("");
      setUser(userCredential.user);
    } catch (error: unknown) {
      alert(`帳號或密碼錯誤，請重新輸入`);
    }
  };

  const logout = async () => {
    await signOut(auth);
    alert("登出成功");
    setUser(null);
  };

  return (
    <main className="space-y-4 text-center">
      <h1 className="bg-[#223345] text-white py-10 text-2xl font-bold">
        React 練習專案
      </h1>
      {!user ? (
        <div className="flex flex-col">
          <div id="login" className="inline-block">
            <div className="flex flex-col gap-2.5 items-center">
              <h2 className="text-xl font-black m-4">登入系統</h2>
              <div className="flex items-center gap-2">
                <span>電郵</span>
                <input
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <span>密碼</span>
                <input
                  value={loginPassword}
                  type="password"
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              <button
                onClick={login}
                className="bg-[#EEEEEE] px-4 py-2 mt-2 w-fit rounded transition cursor-pointer hover:bg-[#223345] hover:text-white"
              >
                登入
              </button>
            </div>
          </div>
          <hr className="text-gray-300 m-6" />

          <div id="register" className="inline-block">
            <div className="flex flex-col gap-2.5 items-center">
              <h2 className="text-xl font-black m-4">註冊系統</h2>
              <div className="flex items-center gap-2">
                <span>電郵</span>
                <input
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <span>密碼</span>
                <input
                  value={registerPassword}
                  type="password"
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              <button
                onClick={register}
                className="bg-[#EEEEEE] px-4 py-2 mt-2 w-fit rounded transition cursor-pointer hover:bg-[#223345] hover:text-white"
              >
                註冊
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div id="login" className="inline-block">
            <div className="text-center">
              <div className="flex flex-col gap-2.5 items-center">
                <h2 className="text-xl font-black m-4">登入系統</h2>
                <div className="flex items-center gap-2">
                  <span>電郵</span>
                  <input
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>密碼</span>
                  <input
                    type="password"
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/accounting")}
                    className="bg-[#EEEEEE] px-4 py-2 mt-2 w-fit rounded transition cursor-pointer hover:bg-[#223345] hover:text-white"
                  >
                    立即開始
                  </button>
                  <button
                    onClick={logout}
                    className="bg-[#EEEEEE] px-4 py-2 mt-2 w-fit rounded transition cursor-pointer hover:bg-[#223345] hover:text-white"
                  >
                    登出
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="text-gray-300 m-6" />

          <div id="register" className="inline-block">
            <div className="text-center">
              <div className="flex flex-col gap-2.5 items-center">
                <h2 className="text-xl font-black m-4">註冊系統</h2>
                <div className="flex items-center gap-2">
                  <span>電郵</span>
                  <input
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>密碼</span>
                  <input
                    type="password"
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>
                <button
                  onClick={register}
                  className="bg-[#EEEEEE] px-4 py-2 mt-2 w-fit rounded transition cursor-pointer hover:bg-[#223345] hover:text-white"
                >
                  註冊
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
