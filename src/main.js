import http from "node:http";
import { DependencyContainer } from "./core/dependency-container.js";
import { Router } from "./core/router.js";

function initResources(){
    new DependencyContainer();
}

function createServer(){
    initResources();

    const server = http.createServer(async (req, res) => {
        const url = req.url;
        if (url === "/favicon.ico") {
            res.writeHead(204);
            return res.end();
        }
        console.log("URL: ", url);
        const route = Router.get(url);
        console.log("Route: ", route);
        route.process(req, res);
    });

    server.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
}

createServer();
