/*
 * Copyright 2019 Scott Bender <scott@scottbender.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const spawn = require('child_process').spawn

module.exports = function(app) {
  var plugin = {};
  var unsubscribes = []

  plugin.start = function(props) {
  }

  plugin.registerWithRouter = function(router) {
    router.post("/shutdown", (req, res) => {
      if ( app.securityStrategy.isDummy() ) {
        app.error('security must be enabled to shutdown he server')
        res.sendStatus(403)
      } else {
        app.debug('shutting down...')
        spawn(
          'sudo',
          ['shutdown', 'now']
        )
        res.send("ok")
      }
    })
  }

  plugin.stop = function() {
    unsubscribes.forEach(f => f())
    unsubscribes = []
  }
  
  plugin.id = "signalk-server-shutdown"
  plugin.name = "Server Shutdown"
  plugin.description = "Provides an API to shutdown the machine the server is running on"

  plugin.schema = {
    type: "object",
    properties: {
    }
  }

  return plugin;
}
