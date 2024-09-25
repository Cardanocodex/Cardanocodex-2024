import chalk from "chalk";
import { instance } from "./index.js";
import ora from "ora";
import { sleep } from "./utils.js";

export async function mint(number: number) {
  const oracleName = `CampusChampionsDID${number}`;

  const mintingOracle = ora("Minting Oracle DID to your wallet").start();

  const { data: oracleMintData, error: oracleMintError } =
    await instance.oracle.mint(oracleName);

  if (!oracleMintData?.txHash) throw Error(JSON.stringify(oracleMintError));

  mintingOracle.stop();

  await sleep(120 * 1000);

  const { data: rngInitData, error: rngInitError } = await instance.init();

  if (!rngInitData) throw Error(rngInitError);

  await sleep(120 * 1000);

  const registeringOracle = ora(
    `Registering CampusChampionsDID${number} to Oracle Contract`
  ).start();

  const { data: oracleRegisterData, error: oracleRegisterError } =
    await instance.oracle.register({
      initRNGTx: rngInitData.txHash,
      oracleDIDUnit: oracleMintData.oracleDIDUnit,
    });

  if (!oracleRegisterData?.txHash) throw Error(oracleRegisterError);

  await sleep(120 * 1000);

  registeringOracle.stop();

  return {
    registered: true,
    unit: oracleMintData.oracleDIDUnit,
    CURR_ORACLE_UPDATED_TX: oracleRegisterData.txHash,
  };
}
