# Backend

Functions are in `functions` folder, and organized in subfolders according to their trigger. The `src` folder contains the source code for the functions, and the `migrations` and `seeds` folders contain the database schema and sample data.

## Instructions for Local Development

1. Download Visual Studio Code and recommended workspace extensions.
2. Create a .env file under `serverless/functions` and add the APIKEY environment variable. 
2. Open command prompt using `Ctrl + ~` and navigate to the `serverless/db` folder.
3. Run `npm run update`
4. Navigate the the `serverless/functions` folder.
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
  "expoPushToken": "ExpoPushToken[12345]"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:5000/bdh-mobileapp-dev/us-central1/createDevice", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

There are two tables in the database: `users` and `devices`. Here is the schema for the tables:

```sql
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    deviceType VARCHAR(255) NOT NULL,
    breakingNewsAlerts BOOLEAN NOT NULL,
    weeklySummaryAlerts BOOLEAN NOT NULL,
    expoPushToken VARCHAR(255) UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);
```



