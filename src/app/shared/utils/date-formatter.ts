export const dateToString = (date: {
  year: number;
  month: number;
  day: number;
}) => `${date.year}-${date.month}-${date.day}`;

export const dateToNgb = (date: string) => {
  const format = date.slice(0, 10);

  const [year, month, day] = format.split('-');

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day)
  }
}
