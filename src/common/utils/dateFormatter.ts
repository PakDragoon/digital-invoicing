import * as dayjs from "dayjs";

export const formatDateTime = (
  dateInput: string | Date,
  format: "date" | "time",
): string => {
  // Convert to Date object if it's a string
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  if (format === "date") {
    // Format as MM/DD/YY
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  } else {
    // Format as time (e.g., 03:41 pm)
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours || 12; // Convert 0 to 12
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  }
};

export const isValidDate = (date: string | Date): boolean =>
  dayjs(date).isValid();

export function formatUSDate(date?: Date | string | null): string | null {
  if (!date || !isValidDate(date)) return null;
  return dayjs(date).format("MM/DD/YYYY");
}
