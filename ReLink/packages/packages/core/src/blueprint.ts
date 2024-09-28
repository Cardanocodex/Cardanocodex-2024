export const blueprint = {
  preamble: {
    title: "contract/validators",
    description: "Aiken contracts for project 'contract/validators'",
    version: "0.0.0",
    plutusVersion: "v2",
    compiler: {
      name: "Aiken",
      version: "v1.0.29-alpha+16fb02e",
    },
    license: "Apache-2.0",
  },
  validators: [
    {
      title: "claim_link.claimable_ada_link",
      datum: {
        title: "datum",
        schema: {
          $ref: "#/definitions/claim_link~1Datum",
        },
      },
      redeemer: {
        title: "_redeemer",
        schema: {
          $ref: "#/definitions/Void",
        },
      },
      parameters: [
        {
          title: "_",
          schema: {
            $ref: "#/definitions/aiken~1transaction~1OutputReference",
          },
        },
      ],
      compiledCode:
        "58dd0100003232323232322232232253330073253330083370e900118049baa3001300a37540042664464660020026eb0c03cc040c040c040c040c040c040c040c040c034dd50019129998078008a50132533300d3371e6eb8c0440080105288998018018009808800980618051baa002375c600260146ea80185281180618068008a4c26cac64a66600c66e1d2000300700115333009300800114985858dd5000a99980199b8748000c010dd5000899191919299980518060010a4c2c6eb8c028004c028008dd7180400098029baa001165734aae7555cf2ab9f5742ae881",
      hash: "42562079abdbd22ed779f946ea3057e3233ce68010674f27db96eb17",
    },
  ],
  definitions: {
    ByteArray: {
      dataType: "bytes",
    },
    Int: {
      dataType: "integer",
    },
    Void: {
      title: "Unit",
      description: "The nullary constructor.",
      anyOf: [
        {
          dataType: "constructor",
          index: 0,
          fields: [],
        },
      ],
    },
    "aiken/transaction/OutputReference": {
      title: "OutputReference",
      description:
        "An `OutputReference` is a unique reference to an output on-chain. The `output_index`\n corresponds to the position in the output list of the transaction (identified by its id)\n that produced that output",
      anyOf: [
        {
          title: "OutputReference",
          dataType: "constructor",
          index: 0,
          fields: [
            {
              title: "transaction_id",
              $ref: "#/definitions/aiken~1transaction~1TransactionId",
            },
            {
              title: "output_index",
              $ref: "#/definitions/Int",
            },
          ],
        },
      ],
    },
    "aiken/transaction/TransactionId": {
      title: "TransactionId",
      description:
        "A unique transaction identifier, as the hash of a transaction body. Note that the transaction id\n isn't a direct hash of the `Transaction` as visible on-chain. Rather, they correspond to hash\n digests of transaction body as they are serialized on the network.",
      anyOf: [
        {
          title: "TransactionId",
          dataType: "constructor",
          index: 0,
          fields: [
            {
              title: "hash",
              $ref: "#/definitions/ByteArray",
            },
          ],
        },
      ],
    },
    "claim_link/Datum": {
      title: "Datum",
      anyOf: [
        {
          title: "Datum",
          dataType: "constructor",
          index: 0,
          fields: [
            {
              title: "owner",
              $ref: "#/definitions/ByteArray",
            },
            {
              title: "redeemer",
              $ref: "#/definitions/ByteArray",
            },
          ],
        },
      ],
    },
  },
} as const;