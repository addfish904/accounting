"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
  } from "firebase/firestore";
import Form from "../components/Form";
import List from "../components/List";

type Record = {
  id: string;
  type: "收入" | "支出";
  amount: number;
  purpose: string;
};

export default function AccountingPage() {
  const router = useRouter();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);

  //檢查使用者是否已登入
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      if (!user) {
        router.push("/");
      } else {
        setUserEmail(user.email)
        setUserUid(user.uid);

        const q = query(
            collection(db, "accountingRecords"),
            where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const loadedRecords = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type,
        amount: doc.data().amount,
        purpose: doc.data().purpose,
        }));
        setRecords(loadedRecords);
        setLoading(false);
      }
    });

    return () => unsubscribe();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  //寫入記帳資料
  const addRecord = async (record: Omit<Record, "id">) => {
    if (!userUid) return;
    try {
      const docRef = await addDoc(collection(db, "accountingRecords"), {
        uid: userUid,
        ...record,
      });
      setRecords((prevRecords) => [...prevRecords, { id: docRef.id, ...record }]);
    } catch (error) {
      console.error("新增記錄失敗：", error);
    }
  };

  //刪除記帳資料
  const deleteRecord = async (id: string) => {
    await deleteDoc(doc(db, "accountingRecords", id));
    setRecords(records.filter((r) => r.id !== id));
  };

  const total = records.reduce((sum, record) => {
    return record.type === "收入" ? sum + record.amount : sum - record.amount;
  }, 0);

  if (loading) return <p className="text-center mt-10">載入中...</p>;

  return (
    <div className="text-center mx-auto pt-12">
      <h2 className="m-2 font-bold text-lg">你已經使用 {userEmail} 登入</h2>
      <Form onAdd={addRecord} />
      <hr className="text-gray-300 mb-8" />
      <List records={records} onDelete={deleteRecord} />
      <p className="mt-[60px] mb-4">小計：{total}</p>
      <button
        className="bg-[#EEEEEE] m-4 px-4 py-2 rounded transition cursor-pointer hover:bg-[#223345] hover:text-white"
        onClick={() => router.push("/")}
      >
        返回首頁
      </button>
    </div>
  );
}
