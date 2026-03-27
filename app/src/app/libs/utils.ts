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
  },
};

export const NOOP_FNC = () => {};
