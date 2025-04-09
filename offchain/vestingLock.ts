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
    "https://cardano-preview.blockfrost.io/api/v0",
    Deno.env.get("PREVIEW_BLOCKFROST_KEY")
  ),
});
const seed = Deno.env.get("SEED");

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
    {}
  )
  .commit();

const signedTx = await txLock.sign().commit();

const tx = await signedTx.submit();

await lucid.awaitTx(tx);

console.log(`1 tADA locked into the contract
    Tx ID: ${tx}
    Datum: ${datum}
`);
