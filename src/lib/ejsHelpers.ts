export const formatLocaleDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const formatLocaleDateDigits = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const isWithinLastTwoWeeks = (date: string | Date) => {
  const currentDate = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(currentDate.getDate() - 14);

  const givenDate = date instanceof Date ? date : new Date(date);
  return givenDate >= twoWeeksAgo && givenDate <= currentDate;
};
