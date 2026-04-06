export type LookupItem = {
  label: string;
  value: any;
  [key: string]: any;
};

export type ObjectId = {
  objectId?: string;
};

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

//
export type Plan = {
  id?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
  accessCode?: string;
  userId?: string;
  canView?: boolean;
};

export type Itinerary = {
  day: number;
  planId?: string;
  destination: {
    codeName: string | "UNSET";
    name: string | "UNSET";
  };
  activities: ItineraryActivity[];
} & ObjectId;

export type ItineraryActivity = {
  description: string;
  time?: string;
  location: {
    coordinates?: number[];
  };
} & ObjectId;
