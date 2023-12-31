/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import EventEmitter from "node:events";
import { SubprocessThread, GatewayServer, Logger } from "../interfaces/index.js";
export declare class SubThread extends EventEmitter implements SubprocessThread {
    name: string;
    loopInterval: number;
    timer: NodeJS.Timeout | null;
    parentThread: GatewayServer | undefined;
    log: Logger;
    constructor(name: string, log: Logger, loopInterval?: number);
    init(): void;
    run(): void;
    shutdown(): void;
}
//# sourceMappingURL=SubThread.d.ts.map