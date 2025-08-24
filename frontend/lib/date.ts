import { isToday, isYesterday, formatDistanceToNow } from "date-fns";

export function formatDate(dateStr: string) {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    const daysAgo = formatDistanceToNow(date, { 
        addSuffix: true 
    }); 
    return daysAgo;
}