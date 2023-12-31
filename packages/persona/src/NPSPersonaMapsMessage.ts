import { PersonaRecord } from "../../interfaces/index.js";
import { NPSMessage } from "../../shared/index.js";

/**
 *
 * @class
 * @extends {NPSMessage}
 * @property {PersonaRecord[]} personas
 * @property {number} personaSize
 * @property {number} personaCount
 */
export class NPSPersonaMapsMessage extends NPSMessage {
    /**
     *
     * @type {PersonaRecord[]}
     * @memberof NPSPersonaMapsMessage
     */
    personas: PersonaRecord[] = [];
    personaSize;
    personaCount;
    /**
     *
     * @param {"sent" | "received"} direction
     */
    constructor(direction: "sent" | "received") {
        super(direction);

        /** @type {PersonaRecord[]} */
        this.personas = [];
        // Public personaSize = 1296;
        this.personaSize = 38;
        this.msgNo = 1543;
        this.personaCount = 0;
        this.serviceName = "mcoserver:NPSPersonaMapsMsg";
    }

    /**
     *
     * @param {PersonaRecord[]} personas
     * @return {void}
     */
    loadMaps(personas: PersonaRecord[]): void {
        this.personaCount = personas.length;
        this.personas = personas;
    }

    /**
     *
     * @param {Buffer} buf
     * @return {number}
     */
    deserializeInt8(buf: Buffer): number {
        return buf.readInt8(0);
    }

    /**
     *
     * @param {Buffer} buf
     * @return {number}
     */
    deserializeInt32(buf: Buffer): number {
        return buf.readInt32BE(0);
    }

    /**
     *
     * @param {Buffer} buf
     * @return {string}
     * @memberof! NPSPersonaMapsMsg
     */
    deserializeString(buf: Buffer): string {
        return buf.toString("utf8");
    }

    /**
     *
     * @return {Buffer}
     */
    serialize(): Buffer {
        let index = 0;
        // Create the packet content
        // const packetContent = Buffer.alloc(40);
        const packetContent = Buffer.alloc(
            this.personaSize * this.personaCount,
        );

        for (const persona of this.personas) {
            // This is the persona count
            packetContent.writeInt16BE(
                this.personaCount,
                this.personaSize * index + 0,
            );

            // This is the max persona count (confirmed - debug)
            packetContent.writeInt8(
                this.deserializeInt8(persona.maxPersonas),
                this.personaSize * index + 5,
            );

            // PersonaId
            packetContent.writeUInt32BE(
                this.deserializeInt32(persona.id),
                this.personaSize * index + 8,
            );

            // Shard ID
            // packetContent.writeInt32BE(this.shardId, 1281);
            packetContent.writeInt32BE(
                this.deserializeInt32(persona.shardId),
                this.personaSize * index + 12,
            );

            // Length of Persona Name
            packetContent.writeInt16BE(
                persona.name.length,
                this.personaSize * index + 20,
            );

            // Persona Name = 30-bit null terminated string
            packetContent.write(
                this.deserializeString(persona.name),
                this.personaSize * index + 22,
            );
            index++;
        }

        // Build the packet
        return packetContent;
    }
}
