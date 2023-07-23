import { GatewayServer, SubprocessThread, Logger } from "@mcos/interfaces";
import EventEmitter from "node:events";

export class SubThread extends EventEmitter implements SubprocessThread {
    name: string;
    loopInterval: number;
    timer: NodeJS.Timer | null = null;
    parentThread: GatewayServer | undefined;
    log: Logger;

    constructor(name: string, log: Logger, loopInterval: number = 100) {
        super();
        this.name = name;
        this.log = log;
        this.loopInterval = loopInterval;
        this.init();
    }

    init() {
        this.emit("initialized");
        this.timer = setInterval(this.run.bind(this), this.loopInterval);
    }

    run() {
        // Intentionally left blank
    }

    shutdown() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.emit("shutdownComplete");
    }
}