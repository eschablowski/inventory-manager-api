import { UUID } from "../base";

export default interface Document {
  /**
   * The unique idenfifier for this Item.
   * @category Attributes
   * @unique
   */
  id: UUID;
  /**
   * The serial number for this Item.
   *
   * Should be unique unless a faulty method of generation is present.
   * @category Attributes
   */
  serialNumber: string;
  /**
   * Specifies if this item was used in the creation of another item or thrown out.
   *
   * TLDR: The item is not permanently gone and should not be displayed.
   * @category Attributes
   */
  used: boolean;
  /**
   * The lifecycle stage of this Item.
   * @see [[Stages]]
   * @category Attributes
   */
  stage: Stages;
  /**
   * The IDs of the Associated [[Document|Documents]],
   * @category Attributes
   */
  documents: UUID[];
}

/**
 * The Stages of Production
 */
export enum Stages {
  /**
   * Specifies that an item is currently in an order, i.e. it is being shipped from a vendor.
   */
  ORDER = "order",
  /**
   * This specifies that an item is currently in stock.
   */
  STOCK = "stock",
  /**
   * This specifies that an item was used.
   *
   * This means that an Item is no longer available.
   * @see [[Item.used]]
   */
  USED = "used",
  /**
   * This specifies that an item is currently in production.
   */
  PRODUCTION = "production"
}
