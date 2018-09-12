# Twitter Remote Angular Jobs Bot

This is a bot that checks every single tweet in search for remote [Angular](https://angular.io/) jobs. If a tweet looks like a job advertisement then it will be saved into a database. This database will then be used in [twitter-remote-angular-jobs-rss](https://github.com/nunoarruda/twitter-remote-angular-jobs-rss).

## Juiciest bits

You can find the most interesting stuff at [`src/index.ts`](src/index.ts).

## How to run locally

1. Install [Node.js](https://nodejs.org/en/)
2. Clone or fork this repository
3. Run the command `npm install`
4. Create a [`.env`](https://devcenter.heroku.com/articles/heroku-local#add-a-config-var-to-your-env-file) file with environment variables
5. Run the command `npm run serve`

## Tech stack

[Node.js](https://nodejs.org/en/), [TypeScript](https://www.typescriptlang.org/), [node-twitter](https://github.com/desmondmorris/node-twitter), [Firebase](https://firebase.google.com/), and [Heroku](https://www.heroku.com/).
