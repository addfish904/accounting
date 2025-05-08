"use client";
import { useState } from "react";

type Props = {
  onAdd: (record: {
    type: "收入" | "支出";
    amount: number;
    purpose: string;
  }) => void;
};

export default function Form({ onAdd }: Props) {
  const [type, setType] = useState<"收入" | "支出">("支出");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ type, amount: Number(amount), purpose });
    setAmount("");
    setPurpose("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center gap-2 p-4 mt-10 mb-2.5">
      <div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "收入" | "支出")}
          className="border rounded px-2 py-1 "
        >
          <option value="支出">支出</option>
          <option value="收入">收入</option>
        </select>
      </div>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <button type="submit" className="whitespace-nowrap bg-[#EEEEEE] px-4 py-2 rounded transition cursor-pointer hover:bg-[#223345] hover:text-white">
        新增紀錄
      </button>
    </form>
  );
}
