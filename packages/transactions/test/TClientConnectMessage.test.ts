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

import { describe, it, expect } from "vitest";
import { mock } from "node:test"
import { TClientConnectMessage } from "../src/TClientConnectMessage.js";

describe("TClientConnectMessage", () => {
    describe(".byteLength", () => {
        it("should have a value of 51", () => {
            // Arrange
            const log = mock.fn()
            const testMessage = new TClientConnectMessage(log);

            // Assert
            expect(testMessage.getByteLength()).toBe(51);
        });
    });
    describe("#get", () => {
        it("should return a ByteField object when passed a valid field name", () => {
            // Arrange
            /** @type module:shared/TServerLogger */
            const log = () => {
                return;
            };

            const testMessage = new TClientConnectMessage(log);
            /** @type module:mcos/shared/ByteField */
            const expectedField = {
                name: "customerId",
                size: 4,
                offset: 13,
                type: "u32",
                value: Buffer.alloc(4),
                order: "little",
            };

            // Assert
            expect(testMessage.get("customerId")).toEqual(expectedField);
        });
    });
});
