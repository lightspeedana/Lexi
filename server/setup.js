/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

const fs = require("fs");
const readline = require("readline");
const { execSync } = require("child_process");
const crypto = require("crypto");
execSync("npm install dotenv", { stdio: "inherit" });
const dotenv = require("dotenv");
dotenv.config();

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
};

const emojis = {
  success: "✅",
  warning: "⚠️",
  info: "ℹ️",
  error: "❌",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

(async function setup() {
  console.log(
    colors.cyan,
    `${emojis.info} Starting setup process...`,
    colors.reset
  );

  console.log(
    colors.cyan,
    `${emojis.info} Installing dependencies...`,
    colors.reset
  );
  execSync("npm i", { stdio: "inherit" });

  console.log(colors.cyan, `${emojis.info} Installing types...`, colors.reset);
  execSync("npm i --save-dev @types/node", { stdio: "inherit" });

  console.log(
    colors.cyan,
    `${emojis.info} Building the project...`,
    colors.reset
  );
  execSync("npm run build", { stdio: "inherit" });

// Read admin username and password from environment variables
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

  console.log(
    colors.cyan,
    `${emojis.info} Creating admin user...`,
    colors.reset
  );
  execSync(
    `node build/server.js create-user ${adminUsername} ${adminPassword}`,
    { stdio: "inherit" }
  );

  rl.close();
  console.log(colors.green, `${emojis.success} Setup complete!`, colors.reset);
})();
