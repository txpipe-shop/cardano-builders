# Vesting example

A vesting contract is a common type of contract that allows funds to be locked for a period of time and unlocked later—once a specified time has passed. Typically, a vesting contract defines a beneficiary who may be different from the original owner.

In this example, an Owner address locks 3 tAda that will be available for unlocking 5 minutes after the initial locking transaction, by either the Beneficiary stated in the datum or the Owner.

## Folder structure

```shell
.
├── offchain
│   ├
│   ├
│   └
├── onchain
│   └── validators
│     └── vesting.ak
│   └── plutus.json
│   └── plutus.ts
└── README.md
```


In typical dApp fashion, there is an offchain and an onchain. In the `offchain` directory, we have the code related to building, signing and submitting the locking and unlocking transactions. In the `onchain` directory, we have the validator code that will be used to verify that the transaction is correct on the blockchain.

## Setup for the demo
> ## OUTDATED

To run this example we need [Deno][1], for the offchain code. The validator compiled code is already included, but to make modifications, you need to install [Aiken][2].

We also need to make a `.env` file in the [`offchain` directory](./offchain/), with the following keys:

```shell
BENEFICIARY = "addr_test1..."
SEED_BENEFICIARY = "fade buddy legend ..."
```

The `BENEFICIARY` key corresponds to a Cardano address, and the `SEED_BENEFICIARY` is the seed phrase for the Beneficiary.

## Unlock vesting
> ## OUTDATED

Sitting in the [`offchain`](./offchain/) folder, run the following command to unlock funds in the Vesting contract:

```bash
deno run --allow-net --allow-env --env-file vestingUnlock.ts
```

## Create a Vesting
> ## OUTDATED

To create a vesting, you first need to add the address and seed phrase of the vesting owner, as shown below:

```shell
OWNER = "addr_test1..."
SEED_OWNER = "fade buddy legend ..."
```

Running the following command inside the [`offchain`](./offchain/) folder will lock 3 tAda, which will be available for unlocking 5 minutes after the initial locking transaction:

```bash
deno run --allow-net --allow-env --env-file vestingLock.ts
```

## Resources
> ## OUTDATED


Find more on the [Aiken's user manual](https://aiken-lang.org).

[1]: https://deno.com/
[2]: https://aiken-lang.org
[3]: https://blockfrost.io/