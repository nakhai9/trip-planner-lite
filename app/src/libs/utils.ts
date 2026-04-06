import dayjs, { Dayjs } from "dayjs";
import { DATE_FORMAT } from "./constants";
import { format } from "path";

export const Utils = {
  object: {
    isEmpty: (obj: object): boolean => {
      return Object.keys(obj).length === 0;
    },
  },
  compare: {
    isEqual: (str1: string, str2: string) => {
      return str1 === str2;
    },
  },
  random: {
    uuid: () => {
      return crypto.randomUUID();
    },
  },
  date: {
    getStartDate: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);

      return date.toISOString().split("T")[0];
    },
    formatStringToDayjs: (dateStr: string) => {
      return dayjs(dateStr);
    },
    formatDayjsToString: (date: string) => {
      return dayjs(date).format(DATE_FORMAT);
    },
  },
};

export const NOOP_FNC = () => {};

export const watch = (data: any, title?: string) => {
  console.log("Watching data:", data);
};
