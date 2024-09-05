Prepend NODE_ENV= to command to set node env. 

To run locally:
1. Go to the nms/db folder in integrated terminal.
2. Run `npm run update`
3. Go to the nms folder in integrated terminal.
4. Run `npm run dev` to start the server and watch for changes.


To edit a migration file:
0. Modify the latest seed or migrations file.
1. Go to the nms/db folder in integrated terminal.
2. Run `npm run update`
3. Go to the nms folder in integrated terminal.
4. Run `npm run dev` to start the server and watch for changes.

To create a new migration file:
0. Go to the nms/db folder in integrated terminal.
1. Run `npm run new -- {name}` to create a new migration file.
2. Update the seed file in the seeds folder, if you would like.
3. Run `npm run update`
4. Go to the nms folder in integrated terminal.
5. Run `npm run dev` to start the server and watch for changes.