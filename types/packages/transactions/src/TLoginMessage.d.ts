import { Logger } from "../../interfaces/index.js";
import { TSMessageBase } from "../../shared/index.js";
/**
 *
 *
 * @class
 * @property {number} msgNo
 * @property {number} personaId
 * @property {number} appId
 * @property {number} customerId
 * @property {string} custName
 * @property {string} personaName
 * @property {Buffer} mcVersion
 */
export declare class TLoginMessage extends TSMessageBase {
    appId: number;
    /**
     * Creates an instance of TLoginMessage.
     * @param {Logger} log
     * @memberof TLoginMessage
     */
    constructor(log: Logger);
    /**
     *
     * @return {number}
     */
    getAppId(): number;
    /**
     * DumpPacket
     * @return {string}
     */
    dumpPacket(): string;
}
//# sourceMappingURL=TLoginMessage.d.ts.map