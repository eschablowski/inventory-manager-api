import { UUID } from "../base";
import { Stages } from "../item";

export default interface Product {
  /**
   * The unique identifier for this Product.
   * @category Attributes
   * @unique
   */
  id: UUID;
  /**
   * The [Stock Keeping Unit](https://en.wikipedia.org/wiki/Stock_keeping_unit) for this Product
   * @category Attributes
   */
  sku: string;
  /**
   * The minimum quantity that should be in every stage at any time.
   * @category Attributes
   */
  minQuantity: Quantity;
  /**
   * The actual quantity that is currently in every stage.
   * @category Attributes
   */
  quantity: Quantity;
  /**
   * When to consider an item overstocked at any stage.
   * @category Attributes
   */
  highQuantity: Quantity;
  /**
   * The dependencies to make one of this Product.
   *
   * I.E. The resources used to manufacture this product.
   * @category Attributes
   */
  dependencies: {
    [key: string]: number;
  };
  /**
   * The [[Shop.id]] that owns this Product.
   * @category Associations
   */
  shop: UUID;
  /**
   * The [[Vendor.id]] that Manufactures this Product.
   * @category Associations
   */
  vendor: UUID;
}

type QuantityT = {
  [stage in Stages]: number;
};

/**
 * A small utility interface to store Quantities with their respective Stage
 */
export interface Quantity extends QuantityT {}
