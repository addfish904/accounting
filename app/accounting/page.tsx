"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Form from "../components/Form";
import List from "../components/List";

type Record = {
  id: number;
  type: "收入" | "支出";
  amount: number;
  purpose: string;
};

export default function AccountingPage() {
  const router = useRouter();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  //檢查使用者是否已登入
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        setUserEmail(user.email)
        console.log(userEmail)
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const addRecord = (record: Omit<Record, "id">) => {
    setRecords([...records, { id: Date.now(), ...record }]);
  };
  const deleteRecord = (id: number) => {
    setRecords(records.filter((r) => r.id != id));
  };

  const total = records.reduce((sum, record) => {
    return record.type === "收入" ? sum + record.amount : sum - record.amount;
  }, 0);

  if (loading) return <p className="text-center mt-10">載入中...</p>;

  return (
    <div className="text-center mx-auto pt-12">
      <h2 className="m-2 font-bold">你已經使用 {userEmail} 登入</h2>
      <Form onAdd={addRecord} />
      <hr className="text-gray-300 mb-8" />
      <List records={records} onDelete={deleteRecord} />
      <p className="mt-[60px]">小計：{total}</p>
      <button
        className="bg-[#EEEEEE] px-4 py-2 rounded transition cursor-pointer hover:bg-[#223345] hover:text-white"
        onClick={() => router.push("/")}
      >
        返回首頁
      </button>
    </div>
  );
}
