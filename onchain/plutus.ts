// deno-lint-ignore-file
import {
  applyParamsToScript,
  Data as LucidData,
  Script,
} from "https://deno.land/x/lucid@0.20.9/mod.ts";

export type Data = LucidData;
export type Int = bigint;
export type AikenCryptoVerificationKeyHash = string;
export type VestingVestingDatum = {
  lockUntil: Int;
  owner: AikenCryptoVerificationKeyHash;
  beneficiary: AikenCryptoVerificationKeyHash;
};

const definitions = {
  "Data": { "title": "Data", "description": "Any Plutus data." },
  "Int": { "dataType": "integer" },
  "aiken/crypto/VerificationKeyHash": {
    "title": "VerificationKeyHash",
    "dataType": "bytes",
  },
  "vesting/VestingDatum": {
    "title": "VestingDatum",
    "anyOf": [{
      "title": "VestingDatum",
      "dataType": "constructor",
      "index": 0,
      "fields": [{
        "title": "lockUntil",
        "description": "POSIX time in milliseconds, e.g. 1672843961000",
        "$ref": "#/definitions/Int",
      }, {
        "title": "owner",
        "description": "Owner's credentials",
        "$ref": "#/definitions/aiken/crypto/VerificationKeyHash",
      }, {
        "title": "beneficiary",
        "description": "Beneficiary's credentials",
        "$ref": "#/definitions/aiken/crypto/VerificationKeyHash",
      }],
    }],
  },
};

export interface VestingVestingSpend {
  new (): Script;
  datum: VestingVestingDatum;
  _redeemer: Data;
}

export const VestingVestingSpend = Object.assign(
  function () {
    return {
      type: "PlutusV3",
      script:
        "59018d01010029800aba2aba1aba0aab9faab9eaab9dab9a488888896600264653001300800198041804800cdc3a400530080024888966002600460106ea800e2646644b30013370e900018059baa0018cc004c03cc030dd5000c8c040c044c044c044c044c044c044c044c04400644646600200200644b30010018a508acc004cdc79bae30130010038a51899801001180a000a01c40449112cc004cc004dd6180118079baa007375c60246026601e6ea800e29462b30013300137586004601e6ea801cdd718091809980998079baa003899191919912cc004c034c04cdd50014566002601a60266ea8c05cc06000e266e20004dd6980b980a1baa002899b89001375a602e60286ea8009012452820243015001375a602a60246ea8018cc04cc050004cc04e6002601460206ea8c050c05400698103d87a8000a60103d8798000403c97ae030103754602660206ea8004c048c04cc04cc04cc04cc04cc04cc04cc03cdd5003c528201a40348b2014300d001300d300e0013009375400716401c300800130033754011149a26cac8009",
    };
  },
  {
    datum: {
      "shape": { "$ref": "#/definitions/vesting/VestingDatum" },
      definitions,
    },
  },
  { _redeemer: { "shape": { "$ref": "#/definitions/Data" }, definitions } },
) as unknown as VestingVestingSpend;
