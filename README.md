# Battle Ship Game project

[Assignment link](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/battleship/assignment.md)

## Requirements

- Node.js >= 22.14.0

## Installation

```bash
npm install
cp env.example .env
```

## Scripts

- `npm run start` — Start project in basic mode
- `npm run start:dev` — Start in development mode (with hot reload, TypeScript, and nodemon)

## Environment Variables

- `PORT` — Port to run the server (default: 3000)

## Notes:

- If user previously registered, the app will validate its name and password as a registered user and respond with an error message if the password is not valid for the current user
- User name and password are trimmed while registration, registration with whitespaces in the this fields could lead to login errors
- When player creates a room, he automatically added to the room
- One user can't get into 1 room twice
- [Hit rule] If player hits already shot cell or missed cell, game turn leeds to other player.
