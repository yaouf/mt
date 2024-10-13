# Backend

TODO: sync Notion with README. Is there an automatic way to do this?
TODO: do I need an outer serverless folder?
TODO: sync repo todo with Notion todo.

Functions are in `functions` folder, and organized in subfolders according to their trigger. The `src` folder contains the source code for the functions, and the `migrations` and `seeds` folders contain the database schema and sample data.

## Instructions for Local Development

1. Download Visual Studio Code and recommended workspace extensions.
2. Create a .env file under `serverless/functions` and add the environment variables from the `.env.example` file. Can use `cp .env.example .env` to copy the file.
3. Open command prompt using `Ctrl + ~` and navigate to the `serverless/functions folder.
4. Run `npm run build:db`.
5. Run `npm run dev` for local development.
6. Send a POST request to corresponding endpoint shown from CLI.

Example POST request format with fetch:

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "deviceType": "iOS",
  "Breaking News": true,
  "University News": false,
  "Metro": false,
  "isPushEnabled": true,
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

7. After making a change, deploy new versions of the functions to the frontend. Make sure that you're using the dev version of firebase project. Make sure that the env vars are set to the staging versions. Like such:
firebase functions:config:set api.key="<your-api-key>" \
  db.url="<your-db-url>" \
  env.name="<development or staging or production>" \
  db.name?="<your-db-name>" \
  db.user?="<your-db-user>" \
  db.password?="<your-db-password>"

Then, run `npm run deploy` to deploy the new versions of the functions if you want to redeploy all functions.
If you only want to redeploy certain functions, run `firebase deploy --only <function1>,<function2>`, which is better if you are only changing one function.
8. After testing with the frontend, change the ENV vars to point to the production versions of the functions. Log into production firebase using `firebase use prod`, and then run `npm run deploy` again to deploy the new versions of the functions.
