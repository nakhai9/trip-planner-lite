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
};
