// mco-server is a game server, written from scratch, for an old game
// Copyright (C) <2017-2018>  <Joseph W Becher>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

const { IncomingMessage, ServerResponse } = require('http') // lgtm [js/unused-local-variable]
const { Socket } = require('net') // lgtm [js/unused-local-variable]
const { MCServer } = require('../MCServer') // lgtm [js/unused-local-variable]

const logger = require('../@mcoserver/mco-logger').child({ service: 'mcoserver:AdminServer' })
const fs = require('fs')
const https = require('https')
const util = require('util')

const readFilePromise = util.promisify(fs.readFile)

/**
 * SSL web server for managing the state of the system
 * @module AdminServer
 */

/**
 *
 *
 * @property {MCServer} mcServer
 * @property {Server} httpServer
 */
module.exports.AdminServer = class AdminServer {
  /**
   * @class
   * @param {MCServer} mcServer
   */
  constructor (mcServer) {
    this.mcServer = mcServer
  }

  /**
   * Create the SSL options object
   *
   * @param {IServerConfig} configuration
   * @returns {Promise<ISslOptions>}
   */
  async _sslOptions (configuration) {
    logger.debug(`Reading ${configuration.certFilename}`)

    let cert
    let key

    try {
      cert = await readFilePromise(configuration.certFilename, { encoding: 'utf-8' })
    } catch (error) {
      throw new Error(
        `Error loading ${configuration.certFilename}, server must quit!`
      )
    }

    try {
      key = await readFilePromise(configuration.privateKeyFilename, { encoding: 'utf-8' })
    } catch (error) {
      throw new Error(
        `Error loading ${configuration.privateKeyFilename}, server must quit!`
      )
    }

    return {
      cert,
      honorCipherOrder: true,
      key,
      rejectUnauthorized: false
    }
  }

  /**
   *
   * @return {string}
   */
  _handleGetBans () {
    const banlist = {
      mcServer: this.mcServer.mgr.getBans()
    }
    return JSON.stringify(banlist)
  }

  /**
   *
   * @return {string}
   */
  _handleGetConnections () {
    const connections = this.mcServer.mgr.dumpConnections()
    let responseText = ''
    connections.forEach((connection, index) => {
      const displayConnection = `
        index: ${index} - ${connection.id}
            remoteAddress: ${connection.remoteAddress}:${connection.localPort}
            Encryption ID: ${connection.enc.getId()}
            inQueue:       ${connection.inQueue}
        `
      responseText += displayConnection
    })
    return responseText
  }

  /**
   *
   * @return {string}
   */
  _handleResetAllQueueState () {
    this.mcServer.mgr.resetAllQueueState()
    const connections = this.mcServer.mgr.dumpConnections()
    let responseText = 'Queue state reset for all connections\n\n'
    connections.forEach((connection, /** @type {number} */ index) => {
      const displayConnection = `
        index: ${index} - ${connection.id}
            remoteAddress: ${connection.remoteAddress}:${connection.localPort}
            Encryption ID: ${connection.enc.getId()}
            inQueue:       ${connection.inQueue}
        `
      responseText += displayConnection
    })
    return responseText
  }

  /**
   *
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   * @return {void}
   */
  _httpsHandler (request, response) {
    logger.info(
      `[Admin] Request from ${request.socket.remoteAddress} for ${request.method} ${request.url}`
    )
    logger.info(
      'Requested recieved',
      {
        url: request.url,
        remoteAddress: request.socket.remoteAddress
      }
    )
    switch (request.url) {
      case '/admin/connections':
        response.setHeader('Content-Type', 'text/plain')
        return response.end(this._handleGetConnections())

      case '/admin/connections/resetAllQueueState':
        response.setHeader('Content-Type', 'text/plain')
        return response.end(this._handleResetAllQueueState())

      case '/admin/bans':
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        return response.end(this._handleGetBans())

      case '/admin/poweroff':
        response.end('ok')
        process.exit(0)

      default:
        if (request.url && request.url.startsWith('/admin')) {
          return response.end('Jiggawatt!')
        }
        response.statusCode = 404
        response.end('Unknown request.')
        break
    }
  }

  /**
   *
   * @param {Socket} socket
   * @returns {void}
   */
  _socketEventHandler (socket) {
    socket.on('error', error => {
      throw new Error(`[AdminServer] SSL Socket Error: ${error.message}`)
    })
  }

  /**
   *
   * @param {IServerConfig} config
   * @returns {Promise<void>}
   */
  async start (config) {
    try {
      const sslOptions = await this._sslOptions(config)

      /** @type {https.Server|undefined} */
      this.httpsServer = https.createServer(
        sslOptions,
        (req, res) => {
          this._httpsHandler(req, res)
        }
      )
    } catch (err) {
      throw new Error(`${err.message}, ${err.stack}`)
    }
    this.httpsServer.listen({ port: 88, host: '0.0.0.0' }, () => {
      logger.debug('port 88 listening')
    })
    this.httpsServer.on('connection', this._socketEventHandler)
  }
}