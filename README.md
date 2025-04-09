# Vesting example

A vesting contract is a common type of contract that allows funds to be locked for a period of time and unlocked later—once a specified time has passed. Typically, a vesting contract defines a beneficiary who may be different from the original owner.

In this example, an Owner address locks 1 tAda that will be available for unlocking 5 minutes after the initial locking transaction, by either the Beneficiary stated in the datum or the Owner. 

## Folder structure

```shell
.
├── offchain
│   ├── .env
│   ├── vestingLock.ts
│   └── vestingUnlock.ts
├── onchain
│   └── validators
│     └── vesting.ak
│   └── plutus.json
│   └── plutus.ts
└── README.md
```


In typical dApp fashion, there is an offchain and an onchain. In the `offchain` directory, we have the code related to building, signing and submitting the locking and unlocking transactions. In the `onchain` directory, we have the validator code that will be used to verify that the transaction is correct on the blockchain. 

## Setup 

To run this example we need [Deno][1], for the offchain code. The validator compiled code is already included, but to make modifications, you need to install [Aiken][2]. We also need a key for the [Blockfrost][3] Cardano preprod API, which can be obtained in their website.

We also need to make a `.env` file in the [`offchain` directory](./offchain/), with the following keys:

```shell
OWNER=
SEED=
BENEFICIARY=
SEED_B=
PREPROD_BLOCKFROST_KEY=
```

The `OWNER` and `BENEFICIARY` keys correspond to Cardano addresses, and `SEED` and `SEED_B` are the seed phrases for the Owner and Beneficiary respectively. `PREPROD_BLOCKFROST_KEY` corresponds to the Blockfrost key mentioned previously.

## Run the example

Sitting in [`offchain`](./offchain/), run the following command to lock some funds in the Vesting contract:

```bash
deno run --allow-env --env vestingLock.ts
```

After a few minutes, the beneficiary will be able to unlock the funds running the following command:

```bash
deno run --allow-env --env vestingLock.ts
```

## Resources

Find more on the [Aiken's user manual](https://aiken-lang.org).

### References

[1]: https://deno.com/
[2]: https://aiken-lang.org
[3]: https://blockfrost.io/