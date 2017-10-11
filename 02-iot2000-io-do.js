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

    function iot2000_io_do(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.pin = n.pin;
        node.valueonstart = n.valueonstart;

        function readPayload(msg) {
            var inpValue = Number(msg.payload);

            if (isNaN(inpValue)) {
                node.warn(node.pin + ": Invalid msg.payload numeric value.");
                return null;
            }

            return (inpValue != 0);
        }

        var ionum;

        switch (node.pin) {
            case "DQ1": ionum = 7; break;
            case "DQ0": ionum = 8; break;
        }

        var do_prestate = (node.valueonstart == "on");

        node.m_dout = new mraa.Gpio(ionum);
        node.m_dout.mode(mraa.PIN_GPIO);
        node.m_dout.dir(mraa.DIR_OUT);
        node.m_dout.write(do_prestate ? 1 : 0);

        node.on("input", function (msg) {
            var msgState = readPayload(msg);

            if (msgState == null) {
                return;
            }

            if (msgState != do_prestate) {
                node.m_dout.write(msgState ? 1 : 0);
            }

            do_prestate = msgState;
        });
    }

    RED.nodes.registerType("iot2000-io-do", iot2000_io_do);
}
