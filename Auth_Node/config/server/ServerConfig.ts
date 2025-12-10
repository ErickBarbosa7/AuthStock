import express from "express";
import { SERVER_PORT } from "../../globals/Environment";
import http from "http";

export default class ServerConfig {
    private static _instance: ServerConfig;
    public app: express.Application;
    public port: number;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
    }
    public static get instance() {
        return this._instance || (this._instance = new this());
    }
    start(callback: any) {
        this.httpServer.listen(this.port, callback);
    }
}