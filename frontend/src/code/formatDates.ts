export function formatDates(publishedAt: string) {
  const timeData = publishedAt.split(" ")[1];
  var hour = timeData.split(":")[0];
  var minute = timeData.split(":")[1];
  var ampm = "";

  if (parseInt(hour) > 12) {
    ampm = "pm";
    hour = (parseInt(hour) - 12).toString();
  } else {
    ampm = "am";
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
    ampm +
    " EDT"
  );
}

export function shortFormatDates(publishedAt: string) {
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

  return month_dict[month] + " " + day + ", " + year;
}
