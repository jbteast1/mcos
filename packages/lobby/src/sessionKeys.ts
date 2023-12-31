/**
 * @param {string} key
 * @return {Buffer}
 */

export function _generateSessionKeyBuffer(key: string): Buffer {
    const nameBuffer = Buffer.alloc(64);
    Buffer.from(key, "utf8").copy(nameBuffer);
    return nameBuffer;
}
