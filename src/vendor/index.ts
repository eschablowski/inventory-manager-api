import { UUID } from "../base";

export default interface Vendor {
  /**
   * The unique idenfifier for this Order.
   * @category Attributes
   * @unique
   */
  id: UUID;
  name: string;
  shop: UUID;
  orders: UUID[];
  orderWorkflow: UUID;
}
