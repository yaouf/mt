# Serverless Local Development

TODO: Out of Date

1. cd into serverless/db
2. npm i -g firebase-tools sqlite3 knex typescript
3. npm run build
4. npm run update (make sure this doesn't error)
5. (Optional) If it does error, then copy the following file into serverless/db/dist
    
    [dev.sqlite3](Serverless%20Local%20Development%20e2afe51c3afa424288dca868a069b592/dev.sqlite3)
    
6. cd into serverless/functions
7. firebase login
8. Delete functions/lib folder
9. npm run dev
10. to test if working, make POST request to createDevice in POSTMAN or on frontend: 

```jsx
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "deviceType": "iOS",
  "breakingNewsAlerts": true,
  "weeklySummaryAlerts": false,
  "expoPushToken": "ExpoPushToken[12345]"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:5000/bdh-mobileapp-dev/us-central1/createDevice", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```