import * as dayjs from "dayjs";

export interface TimeObject {
  CreatedAt: string | Date | null;
  AcceptedAt?: string | Date | null;
  fromNow?: boolean;
}
function calculateTimeDifference(start: Date, end: Date) {
  const diffMs = end.getTime() - start.getTime();

  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;
  const msInMonth = msInDay * 30;
  const msInYear = msInDay * 365;

  const years = Math.floor(diffMs / msInYear);
  const months = Math.floor((diffMs % msInYear) / msInMonth);
  const days = Math.floor((diffMs % msInMonth) / msInDay);
  const hours = Math.floor((diffMs % msInDay) / msInHour);
  const minutes = Math.floor((diffMs % msInHour) / msInMinute);
  const seconds = Math.floor((diffMs % msInMinute) / msInSecond);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export const calculateDuration = (timeObj: TimeObject): string => {
  const { CreatedAt, AcceptedAt, fromNow } = timeObj;

  if (!CreatedAt) {
    return "N/A";
  }

  const createdDate = new Date(CreatedAt);

  if (fromNow) {
    return getRelativeTime(createdDate);
  }

  if (AcceptedAt) {
    const acceptedDate = new Date(AcceptedAt);
    const diff = calculateTimeDifference(createdDate, acceptedDate);

    let formattedDuration = "";

    if (diff.years > 0)
      formattedDuration += `${diff.years} ${diff.years > 1 ? "yrs" : "yr"} `;
    if (diff.months > 0)
      formattedDuration += `${diff.months} ${diff.months > 1 ? "mnths" : "mnth"} `;
    if (diff.days > 0)
      formattedDuration += `${diff.days} ${diff.days > 1 ? "days" : "day"} `;
    if (diff.hours > 0)
      formattedDuration += `${diff.hours} ${diff.hours > 1 ? "hrs" : "hr"} `;
    if (diff.minutes > 0)
      formattedDuration += `${diff.minutes} ${diff.minutes > 1 ? "mins" : "min"} `;
    if (formattedDuration === "" && diff.seconds > 0) {
      formattedDuration = `${diff.seconds} ${diff.seconds > 1 ? "secs" : "sec"}`;
    }

    return formattedDuration || "N/A";
  }

  return "N/A";
};

export function formatDuration(minutes: number): string {
  if (minutes < 0) return "0 mins";

  const minsInDay = 60 * 24;
  const minsInHour = 60;

  if (minutes < minsInHour) return `${minutes} mins`;

  if (minutes < minsInDay) {
    const hours = Math.floor(minutes / minsInHour);
    const mins = minutes % minsInHour;
    return mins > 0 ? `${hours} hr ${mins} mins` : `${hours} hr`;
  }

  const days = Math.floor(minutes / minsInDay);
  const remainder = minutes % minsInDay;
  const hours = Math.floor(remainder / minsInHour);

  return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
}

export const _calculateAge = (
  startDate: string | Date,
  endDate?: string | Date,
): number => {
  const START_DATE = dayjs(startDate);
  const END_DATE = endDate
    ? dayjs(endDate).startOf("day")
    : dayjs().startOf("day");

  const age = Math.floor(END_DATE.diff(START_DATE, "day", true));
  return age;
};
