# Tetris

A Tetris game to learn how to use the Canvas API.

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
