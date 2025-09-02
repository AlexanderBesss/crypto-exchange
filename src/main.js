import http from "node:http";
import { DependencyContainer } from "./core/dependency-container.js";

function initResources(){
    new DependencyContainer();
}

function createServer(){
    initResources();

    const server = http.createServer(async (req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Test\n");
    });

    server.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
}

createServer();
