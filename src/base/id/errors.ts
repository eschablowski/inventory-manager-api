export class IDGenerationUnimplementedError extends Error {
  constructor(generation: string | Buffer) {
    super(
      `Received invalid ID generation of ${
        Buffer.isBuffer(generation) ? generation.toString("hex") : generation
      }.`
    );
  }
}

export class CorruptedIDError extends Error {
  constructor(expected: Buffer, actual: Buffer) {
    super(
      `ID Checksum mismatch, expected 0x${expected.toString(
        "hex"
      )}, actual 0x${actual.toString("hex")}`
    );
  }
}

export class UnsupportedTypeError extends Error {
  constructor(type: number, generation: number) {
    super(
      `ID of generation ${generation} received with unsupported type ${type}.`
    );
  }
}
