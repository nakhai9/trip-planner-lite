export type LocationInfo = {
  name: string;
  codeName: string;
  status?: "UPCOMING" | "VISITED" | "NOT_VISITED";
};

export type LocationModel = {
  id?: number;
  name: string;
  codeName: string;
  svgData: string;
};

export type Province = {
  id: string;
  codeName: string;
  name: string;
  mergedInto: string;
  isMerged?: boolean;
};
