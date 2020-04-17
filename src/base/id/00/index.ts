import { crc16 } from "crc";

import { Types, IProperties } from "../index";
import { UnsupportedTypeError, CorruptedIDError } from "../errors";

export function parse(idBuffer: Buffer, offset: number): IProperties {
  const crc = crc16(idBuffer.subarray(0, 10)).toString(16);
  if (idBuffer.subarray(11).toString("hex") === crc) {
    throw new CorruptedIDError(Buffer.from(crc), idBuffer.subarray(11));
  }
  let type: Types = idBuffer.readUInt8(offset) as Types;
  if (!Types[type]) {
    throw new UnsupportedTypeError(type, 0);
  }
  let id: Buffer = Buffer.allocUnsafe(8);
  idBuffer.copy(id, 0, offset + 1, offset + 9);
  return {
    type,
    id,
  };
}

export function generate(type: Types, id: Buffer) {
  if (type > 255) {
    throw new UnsupportedTypeError(type, 0);
  }
  if (id.length < 8) {
    const temp = Buffer.alloc(8, 0);
    id.copy(temp, 8 - id.length, 0, 8);
    id = temp;
  }
  // Allocate a buffer of the correct length, for a GEN 0
  const idBuffer = Buffer.allocUnsafe(12);
  // Write the Generation of the ID.
  idBuffer.writeInt8(0);
  // Write the type.
  idBuffer.writeUInt8(type, 1);
  // Write the actual ID.
  id.copy(idBuffer, 2, 0, 8);
  // Calculate and append the CRC-16 value.
  idBuffer.writeUInt16BE(crc16(idBuffer.subarray(0, 10)), 10);
  return idBuffer.toString("base64");
}
