export function formatDates(publishedAt: string) {
  // Parse the publishedAt string as a date object
  const date = new Date(publishedAt + 'Z'); // Adding 'Z' indicates the input is in GMT

  // Get the user's timezone offset in minutes and convert to hours
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const timezoneOffsetHours = timezoneOffsetMinutes / 60;

  // Adjust the date to the user's local timezone
  const localDate = new Date(date.getTime() - timezoneOffsetMinutes * 60000);

  // Format the date components
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short'











  };

  // Format the localDate to the required string format
  const formattedDate = localDate.toLocaleDateString(undefined, options);

  return formattedDate;










}






export function shortFormatDates(publishedAt: string) {
  const publishedDate = new Date(publishedAt);

  // Manually adjust the time by -4 hours
  publishedDate.setHours(publishedDate.getHours() - 4);

  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - publishedDate.getTime();
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check if the date is within the last 24 hours
  if (timeDifference < oneDay) {
    let hour = publishedDate.getHours();
    const minute = publishedDate.getMinutes();
    const ampm = hour >= 12 ? "pm" : "am";
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute}${ampm} EDT`;
  }

  // Otherwise, return formatted date
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[publishedDate.getMonth()];
  const day = publishedDate.getDate();

  return `${month} ${day}`;
}
