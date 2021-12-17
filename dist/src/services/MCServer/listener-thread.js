"use strict";
// Mco-server is a game server, written from scratch, for an old game
// Copyright (C) <2017-2018>  <Joseph W Becher>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerThread = void 0;
const mco_logger_1 = require("@drazisil/mco-logger");
const net_1 = require("net");
const { log } = mco_logger_1.Logger.getInstance();
/**
 * TCP Listener thread
 * @module ListenerThread
 */
/**
 * @class
 */
class ListenerThread {
    /**
     * The onData handler
     * takes the data buffer and creates a IRawPacket object
     *
     * @param {Buffer} data
     * @param {ConnectionObj} connection
     * @return {Promise<void>}
     */
    async _onData(data, connection) {
        try {
            const { localPort, remoteAddress } = connection.sock;
            /** @type {IRawPacket} */
            const rawPacket = {
                connectionId: connection.id,
                connection,
                data,
                localPort,
                remoteAddress,
                timestamp: Date.now(),
            };
            // Dump the raw packet
            log('debug', `rawPacket's data prior to proccessing, { data: ${rawPacket.data.toString('hex')}}`, { service: 'mcoserver:ListenerThread' });
            /** @type {ConnectionObj} */
            let newConnection;
            try {
                newConnection = await connection.mgr.processData(rawPacket);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new TypeError(`Error in listenerThread::onData 1: ${error}`);
                }
                throw new Error('Error in listenerThread::onData 1, error unknown');
            }
            if (!connection.remoteAddress) {
                throw new Error(`Remote address is empty: ${connection.toString()}`);
            }
            try {
                await connection.mgr._updateConnectionByAddressAndPort(connection.remoteAddress, connection.localPort, newConnection);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new TypeError(`Error in listenerThread::onData 2: ${error.message}`);
                }
                throw new Error('Error in listenerThread::onData 2, error unknown');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new TypeError(`Error in listenerThread::onData 3: ${error.message}`);
            }
            throw new Error('Error in listenerThread::onData 3, error unknown');
        }
    }
    /**
     * Server listener method
     *
     * @param {Socket} socket
     * @param {ConnectionMgr} connectionMgr
     * @return {void}
     */
    _listener(socket, connectionMgr) {
        // Received a new connection
        // Turn it into a connection object
        const connection = connectionMgr.findOrNewConnection(socket);
        const { localPort, remoteAddress } = socket;
        log('info', `Client ${remoteAddress} connected to port ${localPort}`, {
            service: 'mcoserver:ListenerThread',
        });
        if (socket.localPort === 7003 && connection.inQueue) {
            /**
             * Debug seems hard-coded to use the connection queue
             * Craft a packet that tells the client it's allowed to login
             */
            // socket.write(Buffer.from([0x02, 0x30, 0x00, 0x00]))
            connection.inQueue = false;
        }
        socket.on('end', () => {
            log('info', `Client ${remoteAddress} disconnected from port ${localPort}`, {
                service: 'mcoserver:ListenerThread',
            });
        });
        socket.on('data', data => {
            this._onData(data, connection);
        });
        socket.on('error', error => {
            if (!error.message.includes('ECONNRESET')) {
                throw new Error(`Socket error: ${error}`);
            }
        });
    }
    /**
     * Given a port and a connection manager object,
     * create a new TCP socket listener for that port
     *
     */
    async startTCPListener(localPort, connectionMgr) {
        return net_1.createServer(socket => {
            this._listener(socket, connectionMgr);
        }).listen({ port: localPort, host: '0.0.0.0' });
    }
}
exports.ListenerThread = ListenerThread;
//# sourceMappingURL=listener-thread.js.map