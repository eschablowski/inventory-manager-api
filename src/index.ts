import * as UserP from "./user";
import * as TeamP from "./team";
import * as ShopP from "./shop";

export interface User extends UserP.default {}
export interface Team extends TeamP.default {}
export interface Shop extends ShopP.default {}

export const Team = TeamP;
export const Shop = ShopP;

export const shemas = {
  user: UserP.schema,
  team: TeamP.schema,
  shop: ShopP.schema
};
