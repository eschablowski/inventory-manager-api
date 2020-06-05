# Inventory Manager IDs

> Note, most applications can treat IDs as black boxes, though this specification can be used to get metadata about the datum from the ID as well as check for corruption.

- [Inventory Manager IDs](#inventory-manager-ids)
  - [Description](#description)
  - [Anatomy of the Byte Data](#anatomy-of-the-byte-data)
    - [Current list of types](#current-list-of-types)
    - [id](#id)

## Description
Inventory Manager IDs are base64 encoded data, the breakdown of which can be viewed at [Anatomy](#anatomy-of-the-byte-data). IDs are unique strings that correspond to a datum in the inventory manager. IDs tie to one datum, although datums can have more than one ID since there are multiple generations of IDs.

## Anatomy of the Byte Data

|                 |                                      format                                       |                    type                     |                                   id                                    |                      crc16                      |
| --------------- | :-------------------------------------------------------------------------------: | :-----------------------------------------: | :---------------------------------------------------------------------: | :---------------------------------------------: |
| **Format**      |                 Determined by the [documentation](Generation.md)                  |                   8 bits                    |                           64 bits(Big Endian)                           |                     16 bits                     |
| **Required**    |                                     Required                                      |                  Required                   |                                Required                                 |  Highly encouraged to prevent data corruption   |
| **Description** | Denotes the Format or generation of the ID, referenced by the hex representation. | Denotes the type of data this ID represents |          The identifier used to represent this specific datum           | CRC-16 Checksum to validate all previous fields |
| **Example**     |                                     00000000                                      |                  00000001                   | 01011001 11001010 01011010 01010010 01010001 00010010 00100100 01000100 |                00111111 10110100                |
> The Example ID, base64 encoded is `WcpaUlESJC6r`

### Current list of types
1. Server
2. Shop
3. User
4. Team
5. Document
6. Product
7. Item
8. Vendor
9. Workflow
10. Incoming Order
11. Outgoing Order
12. Add-On
13. Licence

### id
For most models the id is a combination of 16 bits denoting the Shop, and 48 bits of a counter within the Shop.