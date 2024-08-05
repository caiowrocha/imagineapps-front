export const dateToString = (date: {
  year: number;
  month: number;
  day: number;
}) => `${date.year}-${date.month}-${date.day}`;
