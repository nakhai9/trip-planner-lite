import clsx from "clsx";

export type Tab = {
  key: string;
  title: string;
  isHide?: boolean;
};
type TabsProps = {
  tabs: Tab[];
  current?: Tab | null;
  onClick?: (tab: Tab) => void;
};
export default function Tabs({ tabs = [], onClick, current }: TabsProps) {
  return (
    <div className="flex justify-center items-center gap-4">
      {tabs.map((t) => (
        <div
          onClick={() => onClick?.(t)}
          className={clsx(
            "px-4 py-2 border-2 border-amber-600 rounded-full text-amber-600 text-sm cursor-pointer",
            current && current?.key === t.key ? "bg-amber-600 text-white" : "",
          )}
          key={t.key}
        >
          {t.title}
        </div>
      ))}
    </div>
  );
}
