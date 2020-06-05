declare module "*.gql" {
  const doc: import("graphql").DocumentNode;
  export default doc;
}
