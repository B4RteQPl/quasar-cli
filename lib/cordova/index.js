const
  log = require('../helpers/logger')('app:cordova'),
  CordovaConfig = require('./cordova-config'),
  spawn = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../build/app-paths')

class CordovaRunner {
  constructor () {
    this.pid = 0
    this.config = new CordovaConfig()

    onShutdown(() => {
      this.stop()
    })
  }

  run (quasarConfig) {
    if (this.pid) {
      return
    }

    const cfg = quasarConfig.getBuildConfig()

    return this.__runCordovaCommand(
      cfg,
      ['run', cfg.ctx.targetName]
    )
  }

  build (quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()

    return this.__runCordovaCommand(
      cfg,
      ['build', cfg.ctx.debug ? '--debug' : '--release', cfg.ctx.targetName]
    )
  }

  stop () {
    if (!this.pid) { return }

    log('Shutting down Cordova process...')
    process.kill(this.pid)
    this.__cleanup()
  }

  __runCordovaCommand (cfg, args) {
    this.config.prepare(cfg)

    return new Promise((resolve, reject) => {
      this.pid = spawn(
        'cordova',
        args,
        appPaths.cordovaDir,
        code => {
          this.config.reset()
          resolve(code)
        }
      )
    })
  }

  __cleanup () {
    this.pid = 0
    this.config.reset()
  }
}

module.exports = new CordovaRunner()
