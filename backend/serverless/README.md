# Backend

Functions are in `functions` folder, and organized in subfolders according to their trigger. The `src` folder contains the source code for the functions, and the `migrations` and `seeds` folders contain the database schema and sample data.

## Instructions for Local Development

1. Download Visual Studio Code and recommended workspace extensions.
2. Create a .env file under `serverless/functions` and add the environment variables from the `.env.example` file. Can use `cp .env.example .env` to copy the file. 
3. Open command prompt using `Ctrl + ~` and navigate to the `serverless/functions folder. 
4. Run `npm run build:db`.
5. Run `npm run dev`
6. Send a POST request to corresponding endpoint shown from CLI. 

Example POST request format with fetch:

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "deviceType": "iOS",
  "breakingNewsAlerts": true,
  "weeklySummaryAlerts": false,
  "expoPushToken": "ExpoPushToken[1001]"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("YOUR_CREATE_DEVICE_ENDPOINT", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```