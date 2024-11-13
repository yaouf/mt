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

7. After making a change, you are ready to deploy new development versions of the functions to the frontend. Make sure that you're using the dev version of firebase project (`firebase use dev`). Make sure that you have an env file .env.<firebase-dev-project-id> with the correct env vars.
Then, run `npm run deploy` to deploy the new versions of the functions if you want to redeploy all functions and that will automatically update the dev project firebase functions with the env variables in the .env.<firebase-dev-project-id> file.
If you only want to redeploy certain functions, run `firebase deploy --only <function1>,<function2>`, which is better if you are only changing one function.

8. After testing with the frontend, you are ready to deploy new production versions of the functions to the frontend. Make sure that you're using the production version of firebase project (`firebase use prod`). Make sure that you have an env file .env.<firebase-prod-project-id> with the correct env vars. Then, run `npm run deploy` to deploy the new versions of the functions.

Don't worry about updating the api urls on the frontend. When you deploy, firebase will use the same urls for each project.
