import http from "node:http";
import { WebSocketServer } from "ws";
import { DependencyContainer } from "./core/dependency-container.js";
import { GlobalResponseHandler } from "./core/response/global-response-handler.js";
import { NoContentHttpResponse } from "./core/response/http-response-type.js";
import { HttpRouter } from "./core/router/http-router.js";

async function processRequest(req, res){
    const url = req.url;
    if (url === "/favicon.ico") {
        return new NoContentHttpResponse();
    }
    console.log("URL: ", url);
    const route = HttpRouter.get(url);
    console.log("Route: ", route);
    return route.process(req, res);
}

async function createServer() {
    const httpServer = http.createServer(async (req, res) => {
        await GlobalResponseHandler.handle(processRequest, req, res);
    });

    const wsServer = new WebSocketServer({ server: httpServer });
    
    // Initialize Dependency container
    new DependencyContainer(httpServer, wsServer);

    httpServer.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });

}

createServer();
