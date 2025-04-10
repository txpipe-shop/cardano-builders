import {
  Addresses,
  Blockfrost,
  Data,
  Lucid,
} from "https://deno.land/x/lucid@0.20.5/mod.ts";
import { VestingVestingSpend } from "../onchain/plutus.ts";

const ownerAddress = Deno.env.get("OWNER");
if (!ownerAddress) throw Error("Unable to get owner's address from env");
const ownerPublicKeyHash = Addresses.addressToCredential(ownerAddress).hash;

const beneficiaryAddress = Deno.env.get("BENEFICIARY")!;
if (!ownerAddress) throw Error("Unable to get beneficiary's address from env");
const beneficiaryPublicKeyHash =
  Addresses.addressToCredential(beneficiaryAddress).hash;

const lucid = new Lucid({
  provider: new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "preprod5Khk9WnIQMDLlnkZDimpStXxtXO4CHSK"
  ),
});
const seed = Deno.env.get("SEED_OWNER");

if (!seed) throw Error("Unable to read wallet's seed from env");

lucid.selectWalletFromSeed(seed);

const datum = {
  lockUntil: BigInt(Date.now() + 5 * 60 * 1000), // Time in 5 minutes
  owner: ownerPublicKeyHash,
  beneficiary: beneficiaryPublicKeyHash,
};

const validator = new VestingVestingSpend();
const validatorAddress = lucid.newScript(validator).toAddress();
console.log("Validator address: ", validatorAddress);

const txLock = await lucid
  .newTx()
  .payToContract(
    validatorAddress,
    { Inline: Data.to(datum, VestingVestingSpend.datum) },
    { lovelace: 3_000_000n } // 3 ADA
  )
  .commit();

const signedTx = await txLock.sign().commit();

const tx = await signedTx.submit();

console.log("Awaiting tx confirmation...");

await lucid.awaitTx(tx);

console.log(`\n\t3 tADA locked into the contract\n\tTx Id: ${tx}\n`);
console.log("Datum:");
console.dir(datum, { depth: null });
