/**
 * Container object for Stock cars
 */
// DWORD   brandedPartID;
// DWORD   retailPrice;
// WORD    bIsDealOfTheDay;
/**
 * @class
 * @property {number} brandedPartId
 * @property {number} retailPrice
 * @property {0 | 1} bIsDealOfTheDay
 */

export class StockCar {
    brandedPartId;
    retailPrice;
    bIsDealOfTheDay;
    serviceName;
    /**
     * @param {number} brandedPartId
     * @param {number} retailPrice
     * @param {0|1} bIsDealOfTheDay
     */
    constructor(
        brandedPartId: number,
        retailPrice: number,
        bIsDealOfTheDay: 0 | 1
    ) {
        this.brandedPartId = brandedPartId;
        this.retailPrice = retailPrice;
        this.bIsDealOfTheDay = bIsDealOfTheDay;
        this.serviceName = "mcoserver:StockCar";
    }

    /**
     *
     * @return {Buffer}
     */
    serialize() {
        const packet = Buffer.alloc(10);
        packet.writeInt32LE(this.brandedPartId, 0);
        packet.writeInt32LE(this.retailPrice, 4);
        packet.writeInt16LE(this.bIsDealOfTheDay, 8);
        return packet;
    }

    /**
     * DumpPacket
     * @return {string}
     */
    dumpPacket() {
        return `
        [StockCar]======================================
        brandedPartId:     ${this.brandedPartId}
        retailPrice:       ${this.retailPrice}
        isDealOfTheDay:    ${this.bIsDealOfTheDay}
        [/StockCar]======================================`;
    }
}
