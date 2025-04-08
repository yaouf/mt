# Deploying Firebase Functions

# Backend

Run this on personal computer since Azure VM doesn’t have firebase yet. 

## Deploying to Development

- Ensure you're using the dev version of Firebase project: `firebase use dev`Create an env file: `.env.` with correct env vars
- To deploy all functions: Run `npm run deploy`
    - This updates dev project Firebase functions with env variables

To deploy specific functions: Run `firebase deploy --only functions:"<function1>", "<function2>"`

- Recommended when changing only one function

## Deploying to Production

- Switch to production Firebase project: `firebase use prod`Create an env file: `.env.` with correct env vars
- Run `npm run deploy` to deploy new versions of the functions
    - This updates dev project Firebase functions with env variables
- To deploy specific functions: Run `firebase deploy --only functions:"<function1>", "<function2>`"
    - Recommended when changing only one function

<aside>
Note: Don't worry about updating API URLs on the frontend. Firebase will use the same URLs for each project when you deploy.

</aside>