import { UUID } from "../base";

export default interface User {
  id: UUID;
  name: string;
  shop: UUID;
  users: UUID[];
}
