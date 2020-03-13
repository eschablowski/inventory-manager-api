import { UUID } from "../base";

export default interface Order {
  /**
   * The unique idenfifier for this Order.
   * @category Attributes
   * @unique
   */
  id: UUID;
  /**
   * The tracking number for this order, used to give arrival estimates.
   * @category Attributes
   */
  trackingNumber: string;
  /**
   * The [[Item|Items]] in this Order.
   * @category Attributes
   */
  items: {
    /**
     * The number of Products in this Order.
     * This can be a decimal number.
     * @category Attributes
     */
    [product: string]: number;
  };
  /**
   * Specifies whether this Order was accepted.
   * @category Attributes
   */
  accepted: boolean;
  /**
   * The [[Shop]] that placed this Order.
   * @category Associations
   */
  shop: UUID;
  /**
   * The [[Vendor]] that is fulfilling this Order.
   * @category Associations
   */
  vendor: UUID;
  /**
   * The [[User]] that accepted this Order.
   * @category Associations
   */
  acceptor: UUID;
  /**
   * The [[User]] that placed this Order.
   * @category Associations
   */
  creator: UUID;
}
