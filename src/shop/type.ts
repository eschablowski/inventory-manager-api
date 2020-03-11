import { UUID } from "../base";

export default interface Shop {
  id: UUID;
  name: string;
  emailServer: string;
  teams: UUID[];
  workflows: UUID[];
  vendors: UUID[];
  addOns: UUID[];
}
