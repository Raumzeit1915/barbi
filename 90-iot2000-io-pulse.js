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
     
    function iot2000_io_pulse(n) {
        RED.nodes.createNode(this,n);

        var node = this;
        node.interval = parseInt(n.interval) || 500;

        var interval_id = null;
        var msg = {payload: "1", topic: "one puls"};

        interval_id = setInterval(function () {
            node.send(msg);
        }, node.interval);

        node.on('close', function () {
            if (interval_id != null) {
                clearInterval(interval_id);
            }
        });
    }

    RED.nodes.registerType("iot2000-io-pulse", iot2000_io_pulse);
}
