# Brown Daily Herald Mobile App Backend

## Build & Run Commands
- `npm run dev` - Run the Next.js dev server with Redis
- `npm run build` - Build the Next.js application
- `npm run build:db` - Build database components
- `npm run dangerous:update:db` - Update database schema
- `npm run knex:db` - Run database migrations

## Test Commands
- `npm run test` - Run Jest tests
- `npm run test:pw` - Run Playwright tests
- `npm run test:all` - Run all tests
- Single test: `npx jest __unit_tests__/add.test.ts`

## Lint Commands
- `npm run lint` - Run Next.js linting

## Code Style Guidelines
- TypeScript with strict null checks enabled
- Imports: external libraries first, then internal imports
- Naming: camelCase for functions/variables, snake_case for DB fields
- Error handling: try/catch with proper logging and status codes
- API patterns: consistent parameter validation, structured error responses
- Database: Knex.js for queries with consistent chaining patterns
- Tests: descriptive names in Jest, organized in describe blocks