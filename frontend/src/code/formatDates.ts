export function formatDates(publishedAt: string) {
  const timeData = publishedAt.split(" ")[1];
  var hour = timeData.split(":")[0];
  var minute = timeData.split(":")[1];
  var ampm = "";

  if (parseInt(hour) > 12) {
    ampm = "p.m.";
    hour = (parseInt(hour) - 12).toString();
  } else {
    ampm = "a.m.";
  }

  const dateData = publishedAt.split(" ")[0].split("-");
  var year = dateData[0];
  var month = dateData[1];
  var day = dateData[2];

  const month_dict: { [id: string]: string } = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  return (
    month_dict[month] +
    " " +
    day +
    ", " +
    year +
    "  |  " +
    hour +
    ":" +
    minute +
    " " +
    ampm +
    " ET"
  );
}

export function shortFormatDates(publishedAt: string) {
  const publishedDate = new Date(publishedAt);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - publishedDate.getTime();
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check if the date is within the last 24 hours
  if (timeDifference < oneDay) {
    const hour = publishedDate.getHours();
    const minute = publishedDate.getMinutes();
    const ampm = hour >= 12 ? "pm" : "am";
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format

    return `${formattedHour}:${minute.toString().padStart(2, '0')}${ampm} EDT`;
  }

  // Otherwise, return formatted date
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[publishedDate.getMonth()];
  const day = publishedDate.getDate();

  return `${month} ${day}`;
}
