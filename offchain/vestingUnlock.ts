import {
  Addresses,
  Blockfrost,
  Data,
  UTxO,
  Lucid,
} from "https://deno.land/x/lucid@0.20.5/mod.ts";
import { VestingVestingSpend } from "../onchain/plutus.ts";

const beneficiaryAddress = Deno.env.get("BENEFICIARY");
if (!beneficiaryAddress)
  throw Error("Unable to get beneficiary's address from env");

const beneficiaryPublicKeyHash =
  Addresses.addressToCredential(beneficiaryAddress).hash;

const lucid = new Lucid({
  provider: new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "preprod5Khk9WnIQMDLlnkZDimpStXxtXO4CHSK"
  ),
});
const seed = Deno.env.get("SEED_BENEFICIARY");

if (!seed) throw Error("Unable to read wallet's seed from env");

lucid.selectWalletFromSeed(seed);

const validator = new VestingVestingSpend();
const validatorAddress = lucid.newScript(validator).toAddress();

const currentTime = Date.now() - 60 * 1000; // subtract 1 minute

const printVestings = (utxos : UTxO[]) => {
  for (let i = 0; i < utxos.length; i++) {
    console.log("============ Vesting #" + i + " ============ ");
    console.dir({
      TxHash: utxos[i].txHash,
      Index: utxos[i].outputIndex,
      Assets: utxos[i].assets,
      CBORDatum: utxos[i].datum,
      TypedDatum: Data.from(
        utxos[i].datum,
        VestingVestingSpend.datum
      ),
    });
  }
}

const utxos = (await lucid.utxosAt(validatorAddress)).filter(
  ({ txHash, outputIndex, datum }) => {
    if (!datum) {
      console.warn(`UTxO without datum found: ${txHash}#${outputIndex}`);
      return false;
    }
    try {
      const { beneficiary } = Data.from(
        datum,
        VestingVestingSpend.datum
      );
      return (
        beneficiary === beneficiaryPublicKeyHash
      );
    } catch (_e) {
      console.warn(`UTxO with invalid datum found: ${txHash}#${outputIndex}`);
      return false;
    }
  }
);

if (utxos.length === 0) {
  console.log("No redeemable utxo found. You need to wait a little longer...");
  Deno.exit(1);
}

printVestings(utxos);

// add two hours (TTL: time to live)
const laterTime = new Date(currentTime + 2 * 60 * 60 * 1000).getTime();
const txUnlock = await lucid
  .newTx()
  .collectFrom(utxos, Data.void())
  .addSigner(beneficiaryPublicKeyHash)
  .validFrom(currentTime)
  .validTo(laterTime)
  .attachScript(validator)
  .commit();

const signedTx = await txUnlock.sign().commit();

const tx = await signedTx.submit();

console.log("Awaiting tx confirmation...");

await lucid.awaitTx(tx);

console.log(`\n\tADAs recovered from the contract\n\tTx ID: ${tx}\n`);
