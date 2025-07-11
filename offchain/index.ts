import { Client } from "./protocol.js";
import { sha512 } from "@noble/hashes/sha2";
import * as ed from "@noble/ed25519";
import { VKeyWitness } from "tx3-sdk/trp";
import "dotenv/config";

ed.etc.sha512Sync = sha512;

const client = new Client({
  endpoint: "http://localhost:8164",
});

const BOB = {
  privateKey: process.env.BOB_PRIVATE_KEY!,
  address: process.env.BOB_ADDRESS!,
};

function sign(txHash: string, hexKey: string): VKeyWitness {
  const toSign = ed.etc.hexToBytes(txHash);
  const key = ed.etc.hexToBytes(hexKey);
  const signature = ed.sign(toSign, key);

  return {
    type: "vkey",
    key: {
      content: ed.etc.bytesToHex(ed.getPublicKey(key)),
      encoding: "hex",
    },
    signature: {
      content: ed.etc.bytesToHex(signature),
      encoding: "hex",
    },
  };
}

async function lockFlow(): Promise<string> {
  const resolved = await client.lockTx({
    quantity: 5_000_000,
    until: 200,
    owner: BOB.address,
    beneficiary: BOB.address,
  });

  console.log(resolved);

  const witness = await sign(resolved.hash, BOB.privateKey);

  await client.submit({
    tx: {
      content: resolved.tx,
      encoding: "hex",
    },
    witnesses: [witness],
  });

  return `${resolved.hash}#0`;
}

async function unlockFlow(lockedUtxo: string) {
  const resolved = await client.unlockTx({
    beneficiary: BOB.address,
    locked: lockedUtxo,
  });

  console.log(resolved);

  const witness = await sign(resolved.hash, BOB.privateKey);

  await client.submit({
    tx: {
      content: resolved.tx,
      encoding: "hex",
    },
    witnesses: [witness],
  });

  console.log(`utxo ${resolved.tx}#0 unlocked`);
}

const lockedUtxo = await lockFlow();

console.log(`utxo ${lockedUtxo} locked in vault`);

// unlockFlow("abc#0");
