# ComputerCraft: Tweaked Turtle Quarrying Software

Software is developed in [TypeScript](https://www.typescriptlang.org/) and transpiled to a Lua 5.1 target using 
absolutely fantastic [typescript-to-lua](https://typescripttolua.github.io/) package.

## Project Setup

_It is recommended to use Linux or WSL 2 for development!_

First, install the latest LTS build of node.js if you don't have it installed already. I recommend using `nvm`
for installing and managing multiple node and npm versions in parallel: https://github.com/nvm-sh/nvm

Now clone this repository and install its dependencies by running

```npm i```

It is recommedned to install the `typescript-to-lua`package globally to allow usage of the `tstl`command, 
but it is not strictly necessary for this project.

## Auto-Publishing Build Assets (Dist Files)

If you want to automatically move dist files (lua) into a computercraft computer / turtle after each build, 
copy the `.env.dist` file and name it `.env` to activate the necessary environment variables. Next, edit the `.env` 
file and set `PUBLISH_ASSETS` to `true` and paste a valid UNIX-Path to the computer's/turtle's location on your 
local disk into `PUBLISH_PATH`. Note: The full path must exist. The script won't create the directory structure.

## Building the Project
To run an incremental build, run 

```npm run build```

It is also possible to build watch for changes in the project files to trigger incremental builds automatically on 
each change. To start the watcher, run 

```npm run watch```

You can also re-publish already built dist files by running 

```npm run publish```

as long as the `PUBLISH_PATH`environment variable is set to a valid location.
