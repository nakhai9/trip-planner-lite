"use client";

import { Tabs, Tab, Box, IconButton as MuiIconButton } from "@mui/material";
import { Plus } from "lucide-react";

export type TbTab = {
  key: string;
  title: string;
  isHide?: boolean;
};
type TbTabsProps = {
  tabs: TbTab[];
  current?: TbTab | null;
  onChooseTab?: (tab: TbTab) => void;
  onAdd?: () => void;
};
export default function TbTabs({
  tabs = [],
  onChooseTab,
  current,
  onAdd,
}: TbTabsProps) {
  const selectedKey = current?.key ?? tabs[0]?.key ?? false;

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        bgcolor: "background.paper",
        overflowX: "auto",
      }}
    >
      <Tabs
        value={selectedKey}
        onChange={(_, v) => {
          const t = tabs.find((x) => x.key === v);
          if (t) onChooseTab?.(t);
        }}
        scrollButtons="auto"
        sx={{
          minHeight: 40,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            minHeight: 40,
          },
          "& .Mui-selected": {
            color: "primary.main",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: 3,
          },
        }}
      >
        {tabs.map((t) => (
          <Tab key={t.key} label={t.title} value={t.key} />
        ))}
      </Tabs>
      {onAdd && (
        <MuiIconButton
          size="small"
          onClick={onAdd}
          sx={{ ml: 0.5 }}
          aria-label="Thêm ngày"
        >
          <Plus />
        </MuiIconButton>
      )}
    </Box>
  );
}
