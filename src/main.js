import http from "node:http";
import { DependencyContainer } from "./core/dependency-container.js";
import { Router } from "./core/router/router.js";
import { GlobalResponseHandler } from "./core/response/global-response-handler.js";
import { NoContentHttpResponse } from "./core/response/http-response-type.js";

function initResources(){
    new DependencyContainer();
}

async function processRequest(req, res){
    const url = req.url;
    if (url === "/favicon.ico") {
        return new NoContentHttpResponse();
    }
    console.log("URL: ", url);
    const route = Router.get(url);
    console.log("Route: ", route);
    return route.process(req, res);
}

async function createServer() {
    initResources();

    const server = http.createServer(async (req, res) => {
        await GlobalResponseHandler.handle(processRequest, req, res);
    });

    server.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
}

createServer();
