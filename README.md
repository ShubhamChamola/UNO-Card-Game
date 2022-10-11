# UNO - A Multiplayer Card Game

## Project Description

- This web app is a multiplayer platform for **UNO**.
- About UNO
  - Uno is a multiplayer card game in which the objective is to be the first player to get rid of all the cards in their hand.
  - Each player is dealt with 7 cards and players take turn drawing cards.
  - If you want to know about UNO [Click Here](https://www.ultraboardgames.com/uno/game-rules.php)
- I made this project so i can improve my **Typescript** skills.
- I always wanted to create an app without using any kind of library/framework.
- This project taught me DOM manipulation, how to dynamically style your page based on some conditions or based on user input.
- TechStack Used
  - HTML
  - CSS preprocessor **SASS**.
  - TYPESCRIPT
  - WEBPACK
  - FIREBASE as Backend
  - GIT as Version Control

## Features

- This is a multiplayer game so players can either join a server or create their own server and invite their friends to play.
- The app is responsive so it can be playable in any screen size.
- Minimum 2 players are required to initiate a game and maximum 4 players can join a game.
- Players can even chat together in a server with the help of **ChatBox** at the bottom right of the screen.

## How to Install and Run the Project

- Fork the repo
- create a directory on you local machine with `mkdir [dir name]`
- go to the created directory with `cd [path of created directory]`
- initiate the git with `git init`
- link your local repo with remote repo with `git remote add origin [url of remote repo]`
- change the name of your initail branch from master to main `git brnach -M main`.
- clone the forked repo `git clone origin`
- open the repo in your IDE like VS Code `code .`
- In the terminal or bash type `npm init` to install all the dependencies.
- As this project uses firebase as backend, you need to provide create a firebase config file.
- create a project in firebase and connect it to the current repo.
- click on this link to understand the procedure [Click Here](https://firebase.google.com/docs/web/setup)
- type `npm run dev` to run the project in a local host.
- type `npm run build` to make production ready repo for your project.

## How To Use The Project

- A user is required to create an account which could either be created with the help of an email or link with your google account
- Then a user is directed to the home page of the app.
- In the home page you will get two options:-
  - Create a server
  - Join a server from a list of open servers
- To create a server just click on the button **Create Server** and then you will get a form asking for server name as well as the number of players you need to play with
- when you choose the server or create one you will be directed to the lobby where the game will be initiated when the required number of players have joined the game.
- **Note**
  - If you leave the game which is in progress you will get a penalty of **-1** point from your current score.
  - If someone else left from the ongoining session, the game will still continue his cards will be reshuffled back to the unflipped deck.

## Dev Dependencies

- css-loader, css-minimizer-webpack-plugin, sass, sass-loader, style-loader, mini-css-extract-plugin
- webpack, webpacj-cli, webpack-merge, webpack-dev-server
- html-loader, html-webpack-plugin
- ts-loader, typescript
- git
- file-loader

## Dependencies

- firebase
