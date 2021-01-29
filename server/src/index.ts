import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./db";
import { typeDefs, resolvers } from "./graphql";

const app = express();
const port = 9000;

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
    
    app.listen(port, () => console.log(`[app]: http://localhost:${port}`));
};

mount(app);
