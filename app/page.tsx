"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="text-center">
      <h1 className="bg-[#223345] text-white py-10 text-2xl font-bold">React 練習專案</h1>
      <p className="bg-[#CCDDEE] py-20">歡迎光臨我的頁面</p>
      <button 
        onClick={()=> router.push("/accounting")}
        className="bg-[#EEEEEE] px-4 py-2 rounded mt-10 transition cursor-pointer hover:bg-[#223345] hover:text-white">點此開始
      </button>
    </div>
  );
}

