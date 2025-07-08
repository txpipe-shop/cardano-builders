import { generateBlueprint } from "@blaze-cardano/blueprint";

await generateBlueprint({
  infile: "../onchain/plutus.json",
  outfile: "./blueprint.ts",
  useSdk: true,
});
