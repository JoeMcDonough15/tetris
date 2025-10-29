# Tetris

An object oriented Tetris game to learn how to use the Canvas API on the frontend combined with Nest.js on the backend and a PostgreSQL database to persist high scores using Prisma ORM.

# Setup

## Run the app's server in development environment

cd backend

npm run start:dev

## Run the PostgreSQL server to start the database in development environment (in a new terminal window)

cd backend

npx prisma dev

### If there are any changes to the prisma.schema file or the database table(s)

npx prisma migrate dev --name name-of-migration

This automatically runs npx prisma generate

## Frontend Routes

All static assets are served using Nest.js ServeStaticModule from @nestjs/serve-static

main menu: /

game play: /play-game

high scores: /high-scores

# API Endpoints

All database exceptions are status code 500

## High Scores

### View high scores, sorted in descending order by score

GET api/high-scores

Request body: none

Exceptions: none

Response status: 200

Response body:

```json
[
  {
    "name": "Joe",
    "score": 5000,
  },
  {
    "name": "Leila",
    "score": 3500,
  },
];
```

### Create a new high score

POST api/high-scores

Request body:

```json
{
  "name": "Joe",
  "score": 5000
}
```

Exceptions:

Bad Request 400 if name is not a string that is at least 1 character long or if score is not a number or is a number less than 0.

Response status: 201

Response body:

```json
{
  "name": "Joe",
  "score": 5000
}
```

### Delete a high score by id

DELETE api/high-scores/[:id]

Request body: none

Exceptions:

Bad Request 400 if id is not a valid UUID or Resource Not Found 404 if a high-score by the provided id does not exist

Response status: 204

Response body: none
