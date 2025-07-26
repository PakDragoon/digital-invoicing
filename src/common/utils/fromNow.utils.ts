import * as dayjs from "dayjs";

export function fromNow(dateInput: string | Date | number): string {
  const now = dayjs();
  const date = dayjs(dateInput);
  let result: string;

  let diffInSeconds = now.diff(date, "second");
  const isFuture = diffInSeconds < 0;
  diffInSeconds = Math.abs(diffInSeconds);

  if (diffInSeconds < 60)
    result = `${diffInSeconds} second${diffInSeconds === 1 ? "" : "s"}`;
  else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    result = `${minutes} minute${minutes === 1 ? "" : "s"}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    result = `${hours} hour${hours === 1 ? "" : "s"}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    result = `${days} day${days === 1 ? "" : "s"}`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    result = `${months} month${months === 1 ? "" : "s"}`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    result = `${years} year${years === 1 ? "" : "s"}`;
  }

  return isFuture ? `in ${result}` : `${result} ago`;
}
