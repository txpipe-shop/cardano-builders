import {
  Addresses,
  Blockfrost,
  Data,
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
    Deno.env.get("PREPROD_BLOCKFROST_KEY")
  ),
});
const seed = Deno.env.get("SEED_B");

if (!seed) throw Error("Unable to read wallet's seed from env");

lucid.selectWalletFromSeed(seed);

const validator = new VestingVestingSpend();
const validatorAddress = lucid.newScript(validator).toAddress();

const scriptsUtxo = await lucid.utxosAt(validatorAddress);
const currentTime = Date.now() ;
console.log("Current time (in unix): ", currentTime);
const utxos = scriptsUtxo.filter((utxo) => {
  const datum = Data.from(utxo.datum ?? "", VestingVestingSpend.datum);
  return (
    datum.beneficiary === beneficiaryPublicKeyHash &&
    datum.lockUntil <= currentTime
  );
});

if (utxos.length === 0) {
  console.log("No redeemable utxo found. You need to wait a little longer...");
  Deno.exit(1);
}
const laterTime = new Date(currentTime + 2 * 60 * 60 * 1000).getTime(); // add two hours (TTL: time to live)
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

console.log(`1 tADA recovered from the contract
    Tx ID: ${tx}
`);
