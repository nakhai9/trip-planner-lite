"use client";

import { useRouter } from "next/navigation";
import MainLayout from "./ui/layout/MainLayout";
import { useGlobalStore } from "./store/global-store";

export default function Home() {
  const router = useRouter();
  const { setIsLoading } = useGlobalStore();

  const navigateToPage = (url?: string) => {
    if (!url) return;
    setIsLoading(true);
    router.push(url);
    setIsLoading(false);
  };

  return (
    <MainLayout hideButton={true}>
      <div className="gap-2 grid md:grid-cols-4 grid-col mt-40 p-4 md:p-0">
        <div></div>
        <div className="flex flex-col gap-2 shadow-2xl p-4 border border-slate-100 rounded-md">
          <h3 className="font-medium text-amber-600 text-lg">Tạo hành trình</h3>
          <p className="h-16 text-slate-700 text-xs md:text-sm">
            Dễ dàng lên kế hoạch cá nhân/nhóm cho những chuyến du lịch
          </p>
          <button
            type="button"
            onClick={() => navigateToPage("/lich-trinh")}
            className="flex justify-center items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm text-center cursor-pointer"
          >
            Bắt đầu
          </button>
        </div>
        <div className="flex flex-col gap-2 shadow-2xl p-4 border border-slate-100 rounded-md">
          <h3 className="font-medium text-amber-600 text-lg">Chia sẻ</h3>
          <p className="h-16 text-slate-700 text-xs md:text-sm">
            Tạo và chia sẻ hành trình những nơi đã đi qua dưới dạng hình ảnh
          </p>
          <button
            type="button"
            onClick={() => navigateToPage("/chia-se-hinh-anh")}
            className="flex justify-center items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm text-center cursor-pointer"
          >
            Bắt đầu
          </button>
        </div>
        <div></div>
      </div>
    </MainLayout>
  );
}
