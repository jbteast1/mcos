// mcos is a game server, written from scratch, for an old game
// Copyright (C) <2017>  <Drazi Crendraven>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Logger } from "../../interfaces/index.js";
import { BinaryStructure } from "../../shared/index.js";


/**
 * @class
 * @extends {BinaryStructure}
 */
export class GSMessageBase extends BinaryStructure {
    /**
     * Creates an instance of GSMessageBase.
     * @author Drazi Crendraven
     * @param {Logger} log
     * @memberof GSMessageBase
     */
    constructor(log: Logger) {
        super(log);
        log("debug", "new GSMessageBase");
        this._add({
            name: "msgId",
            order: "little",
            type: "u16",
            size: 2,
            value: Buffer.alloc(2),
        });

        this._add({
            name: "totalMsgLen",
            order: "little",
            type: "u16",
            size: 2,
            value: Buffer.alloc(2), // TOMC
        });

        this._add({
            name: "msgVersion",
            order: "little",
            type: "u16",
            size: 2,
            value: Buffer.alloc(2), // TOMC
        });
        this._add({
            name: "reserved",
            order: "little",
            type: "u16",
            size: 2,
            value: Buffer.alloc(2), // TOMC
        });
        this._add({
            name: "checksum",
            order: "little",
            type: "u16",
            size: 2,
            value: Buffer.alloc(2), // TOMC
        });
    }
    // 10 bytes total in this class

    calulateChecksum() {
        this.setValueNumber(
            "checksum",
            (Number(this.getValue("totalMsgLen")) +
                Number(this.getValue("msgVersion"))) <<
                8,
        );
    }
}
