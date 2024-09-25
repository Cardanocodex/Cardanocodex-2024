import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { RNG } from "rng-ts-lib";
import { mint } from "./mint.js";
import { sleep } from "./utils.js";

const { number: gameNumber } = await inquirer.prompt([
  { type: "input", name: "number", message: "Enter Game Number:" },
]);

export const instance = new RNG({
  blockfrostApiKey: process.env.BLOCKFROST_API_KEY,
  network: 0,
  ogmiosURL: process.env.OGMIOS_URL,
  oracleCBOR: process.env.ORACLE_CBOR,
  rngAPIURL: process.env.RNG_API_URL,
  rngCBOR: process.env.RNG_CBOR,
  walletSeed: process.env.WALLET_SEED,
  rngOutputLen: 3,
});

const { CURR_ORACLE_UPDATED_TX: oracleUpdatedHash, unit } = await mint(
  gameNumber
);

let CURR_ORACLE_UPDATED_TX = oracleUpdatedHash;

async function playGame() {
  const names = await inquirer.prompt([
    { type: "input", name: "1", message: "Enter name for number 1:" },
    { type: "input", name: "2", message: "Enter name for number 2:" },
    { type: "input", name: "3", message: "Enter name for number 3:" },
    { type: "input", name: "4", message: "Enter name for number 4:" },
    { type: "input", name: "5", message: "Enter name for number 5:" },
    { type: "input", name: "6", message: "Enter name for number 6:" },
    { type: "input", name: "7", message: "Enter name for number 7:" },
    { type: "input", name: "8", message: "Enter name for number 8:" },
    { type: "input", name: "9", message: "Enter name for number 9:" },
    { type: "input", name: "0", message: "Enter name for number 0:" },
  ]);

  const spinner = ora("Spinning...").start();
  const result = await spin();

  if (!result) {
    spinner.fail("Failed to spin");
    throw Error("Failed to spin");
  }

  spinner.stop();

  console.log(chalk.blueBright("Top 3 Winners:"));
  console.log(chalk.greenBright(`1st Place: ${names[result[0]]}`));
  let remainingResults = result.slice(1);
  console.log(chalk.greenBright(`2nd Place: ${names[remainingResults[0]]}`));
  remainingResults = remainingResults.slice(1);
  console.log(chalk.greenBright(`3rd Place: ${names[remainingResults[0]]}`));
}

async function spin() {
  const { data: promptRngInitData, error: promptRngInitError } =
    await instance.init();

  if (!promptRngInitData) throw Error(promptRngInitError);

  await sleep(120 * 1000);

  const { data: updateData, error: oracleUpdateError } =
    await instance.oracle.update({
      initRNGTx: promptRngInitData.txHash,
      oracleDIDUnit: unit,
      currUpdatedOracleDIDTx: CURR_ORACLE_UPDATED_TX,
    });

  if (!updateData?.txHash) throw Error(oracleUpdateError);

  await sleep(120 * 1000);

  return updateData.rngOutput;
}

while (true) {
  const userInput = await inquirer
    .prompt({
      type: "input",
      name: "userInput",
      message: "Press 'y' to continue or 'q' to exit:",
    })
    .then((answers) => answers.userInput);
  if (userInput && userInput.toLowerCase() === "q") {
    console.log("Exiting the game...");
    break;
  }
  await playGame();
}
