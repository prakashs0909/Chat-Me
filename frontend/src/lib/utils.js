export function formatMessageTime(date) {
  const msgDate = new Date(date);
  const today = new Date();

  const isToday =
    msgDate.toDateString() === today.toDateString();

  if (isToday) {
    return msgDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return msgDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


export function formatDateLabel(date) {
  const msgDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isToday =
    msgDate.toDateString() === today.toDateString();

  const isYesterday =
    msgDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return msgDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}