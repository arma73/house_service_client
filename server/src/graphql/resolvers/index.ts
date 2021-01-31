import merge from "lodash.merge";
import { userResolvers } from "./user";
import { viewerResolvers } from "./viewer";

export const resolvers = merge(userResolvers, viewerResolvers);
