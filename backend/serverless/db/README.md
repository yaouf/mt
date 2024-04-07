1. `cp .env.example .env`
2. Replace the values in `.env` with your own
3. `cd ../functions`
4. `cp .env.example .env`
5. Replace the values in `.env` with your own (make sure ENV is the same as the one in db)
6. `npm run update:db`
7. `npm run dev`

What happens if I have a corrupt file?
Undo deletion and migrate:rollback then delete