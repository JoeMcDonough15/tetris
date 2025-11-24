# Tetris

An object oriented Tetris game animated with the Canvas API on the frontend combined with Nest.js on the backend and a PostgreSQL database to persist high scores using Prisma ORM. Features include:

Sound FX - optional on/off, off as default

Music - optional on/off, off as default plus optional 3 different music themes

Three Color Palettes - one as default

Custom Key Controls - inside settings menu, highlight the input field you'd like to change and press the key you want to use for that control. Controls must be unique and if they are not, an error message will display when you attempt to submit the form with Apply Settings button.

## How to Play

On mobile and tablet, tap buttons during gameplay to rotate shape, move left, move right, and soft drop. Pause game with middle button.

On desktop, UpArrow rotates shape, LeftArrow moves left, RightArrow moves right, DownArrow soft drops piece. p to pause game.

# Setup

## Run the app's server in development environment

cd backend &&
npm install &&
npm run start:dev

## Run the PostgreSQL server to start the database in development environment (in a new terminal window)

cd backend &&
npx prisma dev

### If there are any changes to the prisma.schema file or the database table(s)

npx prisma migrate dev --name name-of-migration

This automatically runs npx prisma generate

## Frontend Routes

In development, all static assets are served using Nest.js ServeStaticModule from @nestjs/serve-static.

In production, all frontend routes are redirected to the frontend directory through the vercel.json file.
The app acts like a single page application using cleanup functions to remove any event listeners from the current UI
before clearing all of those elements and rebuilding the UI for the next page. So the only frontend route is /

The three page builder functions are inside frontend/pages

## API Routes

In development, all API routes are served using Nest.js. The only CRUD resource is api/high-scores.

In production, since Vercel is serverless, the backend/src/serverless.ts wrapper and backend/src/vercel-handler.js
act as wrappers to convert the API endpoints to match the Vercel environment.

# API Endpoints

All database exceptions:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## High Scores

### View high scores, sorted in descending order by score

GET api/high-scores

Request body: none

Request headers: none

Exceptions: none

Response status: 200

Response body:

```json
[
  {
    "id": "d07bb721-e921-47a4-92af-d1d3f126f53d",
    "name": "Leila",
    "score": 9000,
    "createdAt": "2025-10-29T01:45:31.358Z"
  },
  {
    "id": "edbda94c-acce-4131-90e9-31eb731bc95f",
    "name": "Joe",
    "score": 7000,
    "createdAt": "2025-10-29T03:40:06.114Z"
  }
]
```

### Create a new high score

POST api/high-scores

Request headers:

```json
{
  "Content-Type": "application/json"
}
```

Request body:

```json
{
  "name": "Joe",
  "score": 5000
}
```

Exceptions:

```json

// request body validation fail (message array can include one or more of these strings)

{
  "message": [
    "name must be a string",
    "name should not be empty",
    "name must be shorter than or equal to 18 characters",
    "score must be an integer number"
    "score must be a positive number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Response status: 201

Response body:

```json
{
  "id": "edbda94c-acce-4131-90e9-31eb731bc95f",
  "name": "Mary",
  "score": 1000,
  "createdAt": "2025-10-29T03:40:06.114Z"
}
```

### Delete a high score by id

DELETE api/high-scores/[:id]

Request body: none

Request headers: none

Exceptions:

```json

// missing uuid

{
  "message":"Cannot DELETE /api/high-scores/",
  "error":"Not Found",
  "statusCode":404
}

// uuid validation fail

{
  "message": "Validation failed (uuid is expected)",
  "error": "Bad Request",
  "statusCode": 400
}

```

Response status: 204

Response body: none
