import type {DocumentNode} from "graphql";
import graphql from "./index.gql";

// let gql = graphql;
graphql.toString = () => graphql.loc && graphql.loc.source.body;

export default graphql as DocumentNode;
