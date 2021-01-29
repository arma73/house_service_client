require("dotenv").config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./db";
import { typeDefs, resolvers } from "./graphql";

const { PORT } = process.env;

const mount = async (app: Application) => {
    const db = await connectDatabase();
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        context() {
            return { db };
        }
    });

    server.applyMiddleware({ app, "path": "/api" });
    
    app.listen(PORT, () => console.log(`[app]: http://localhost:${PORT}`));
};

mount(express());
