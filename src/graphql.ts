import * as path from "path";
import { readFileSync } from "fs";

import gqt from "graphql-tag";

import gql from "./index.gql";

const graphqlFile = readFileSync(path.resolve(__dirname, gql)).toString();

let graphql = gqt(graphqlFile);

graphql.toString = () => graphql.loc && graphql.loc.source.body;

export default graphql;

export const filename = gql;
