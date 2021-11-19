// @ts-check
// mcos is a game server, written from scratch, for an old game
// Copyright (C) <2017-2021>  <Drazi Crendraven>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { readFileSync } from "fs";
import P from "pino";
import { SslOptions } from "../types";
import { AppConfiguration } from "./index";

const log = P().child({ service: "mcoserver:AdminServer;" });
log.level = process.env["LOG_LEVEL"] || "info";

/**
 *
 * @typedef {Object} sslOptionsObj
 * @property {string} cert
 * @property {boolean} honorCipherOrder
 * @property {string} key
 * @property {boolean} rejectUnauthorized
 */

/**
   *
 * @param {Object} certificateSettings
 * @param {string} certificateSettings.privateKeyFilename
 * @param {string} certificateSettings.publicKeyFilename
 * @param {string} certificateSettings.certFilename
 * @param {string} serviceName

   * @return {Promise<sslOptionsObj>}
   */
export function _sslOptions(
  certificateSettings: AppConfiguration["certificate"]
): SslOptions {
  log.debug(`Reading ${certificateSettings.certFilename}`);

  let cert = "";
  let key = "";

  try {
    cert = readFileSync(certificateSettings.certFilename, {
      encoding: "utf-8",
    });
  } catch (error) {
    throw new Error(
      `Error loading ${certificateSettings.certFilename}: (${error}), server must quit!`
    );
  }

  try {
    key = readFileSync(certificateSettings.privateKeyFilename, {
      encoding: "utf-8",
    });
  } catch (error) {
    throw new Error(
      `Error loading ${certificateSettings.privateKeyFilename}: (${error}), server must quit!`
    );
  }

  return {
    cert,
    honorCipherOrder: true,
    key,
    rejectUnauthorized: false,
  };
}