// 0 ? []  {}

export const calculateDurationInWeeks = (
  startDate: string,
  endDate: string,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Calculate the difference in milliseconds
  const timeDifference = end.getTime() - start.getTime();
  // Convert milliseconds to days, then to weeks
  const days = timeDifference / (1000 * 60 * 60 * 24);
  const weeks = days / 7;

  // Round up to the nearest integer
  return Math.ceil(weeks);
};
