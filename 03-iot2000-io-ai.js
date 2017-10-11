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
 
    function iot2000_io_ai(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        node.pin = n.pin;

        function readInput() {
            var aval = node.m_ain.read();
            if (aval == -1) {
                return null;
            }
            var fval = parseFloat(aval);
            if (isNaN(fval)) {
                node.warn(node.pin + ": Invalid analog numeric value.");
                return null;
            }
            return fval;
        }

        var ionum;

        switch (node.pin) {
            case "U0": ionum = 0; break;
            case "I0": ionum = 1; break;
            case "U1": ionum = 2; break;
            case "I1": ionum = 3; break;
        }

        node.m_ain = new mraa.Aio(ionum);
        var ai_preValue = 0.0;

        node.on("input", function (msg) {
            var ain_value = readInput();

            if (ain_value == null) {
                return;
            }

            if (ai_preValue != ain_value) {
                msg.payload = ain_value.toString();
                msg.topic = node.pin;
                node.send(msg);
            }

            ai_preValue = ain_value;
        });
    }

    RED.nodes.registerType("iot2000-io-ai", iot2000_io_ai);
}
