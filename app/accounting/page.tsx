"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "../components/Form";
import List from "../components/List";


type Record = {
    id: number,
    type: "收入" | "支出"
    amount: number,
    purpose: string
}

export default function AccountingPage() {
    const router = useRouter();
    const [records, setRecords] = useState<Record[]>([]);

    const addRecord = (record: Omit<Record, "id">)=>{
        setRecords([
            ...records,
            { id: Date.now(), ...record }
        ])
    }
    const deleteRecord = (id: number) => {
        setRecords(records.filter((r)=> r.id != id))
    }

  const total = records.reduce((sum, record) => {
    return record.type === "收入"
      ? sum + record.amount
      : sum - record.amount;
  }, 0);

    return (
        <div className="text-center mx-auto space-y-8">
          <Form onAdd={addRecord}/>
          <hr className="text-gray-300 mb-8"/>
          <List records={records} onDelete={deleteRecord}/>
          <p className="mt-[60px]">小計：{total}</p>
          <button 
          className="bg-[#EEEEEE] px-4 py-2 rounded transition cursor-pointer hover:bg-[#223345] hover:text-white"
          onClick={()=> router.push("/")}
          >返回首頁</button>
        </div>
    )
}
