type Props = {
  records: {
    id: number;
    type: "收入" | "支出";
    amount: number;
    purpose: string;
  }[];
  onDelete: (id: number) => void
};

export default function List({ records, onDelete }: Props) {
  return (
    <div className="w-2/5 m-auto">
      {records.length === 0 ? (
        <p className="text-gray-500">尚無紀錄</p>
      ) : (
        <ul className="flex flex-col gap-[15px]">
          {records.map((r) => {
            return (
              <li key={r.id} className="flex justify-between">
                <div className="flex items-center">
                <span
                  className={`${
                    r.type === "支出" ? "text-red-500" : "text-green-500"
                  } mr-8 text-xl`}
                >
                  {r.type === "支出" ? `-${r.amount}` : r.amount}
                </span>
                {r.purpose}
                </div>
                <button 
                className="bg-gray-100 cursor-pointer px-4 py-2 rounded"
                onClick={()=> onDelete(r.id)}
                >刪除</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
