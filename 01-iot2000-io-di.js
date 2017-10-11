/**
 * Copyright 2017 D. Yolcubal (deryayolcubal@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function (RED) {
    "use strict";
    var mraa = require('mraa');

    function iot2000_io_di(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.pin = n.pin;

        function readInput() {
            var n_state = node.m_din.read();

            if (n_state < 0) {
                node.warn(node.pin + ": Invalid digital input value.");
                return null;
            }
            return (n_state != 0);
        }

        var ionum;

        switch (node.pin) {
            case "DI4": ionum = 4; break;
            case "DI3": ionum = 9; break;
            case "DI2": ionum = 10; break;
            case "DI1": ionum = 11; break;
            case "DI0": ionum = 12; break;
        }          

        node.m_din = new mraa.Gpio(ionum);
        node.m_din.mode(mraa.PIN_GPIO);
        node.m_din.dir(mraa.DIR_IN);

        var di_prestate = false;

        node.on("input", function (msg) {
            var diState = readInput();

            if (diState == null) {
                return;
            }

            if (di_prestate != diState) {
                msg.payload = diState ? "1" : "0";
                msg.topic = node.pin;
                node.send(msg);
            }

            di_prestate = diState;
        });
    }

    RED.nodes.registerType("iot2000-io-di", iot2000_io_di);
}
