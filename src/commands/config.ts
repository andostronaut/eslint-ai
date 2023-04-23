import { command } from 'cleye'

import { hasOwn, getConfig, setConfigs, showConfigUI } from '../utils/config'
import { CliError, handleCliError } from '../utils/cli-error'
import log from '../utils/log'

export default command(
  {
    name: 'config',
    parameters: ['[mode]', '[key=value...]'],
    description: 'Configure the CLI',
  },
  argv => {
    ;(async () => {
      const { mode, keyValue: keyValues } = argv._

      if (mode === 'ui' || !mode) {
        await showConfigUI()
        return
      }

      if (!keyValues.length) {
        log({
          type: 'error',
          msg: 'An error occured, missing required parameter "key=value"\n',
        })
        argv.showHelp()
        return process.exit(1)
      }

      if (mode === 'get') {
        const config = await getConfig()
        for (const key of keyValues) {
          if (hasOwn(config, key)) {
            console.log(`${key}=${config[key as keyof typeof config]}`)
          }
        }
        return
      }

      if (mode === 'set') {
        await setConfigs(
          keyValues.map(keyValue => keyValue.split('=') as [string, string])
        )
        return
      }

      throw new CliError(`An error occured, invalid mode: ${mode}`)
    })().catch((err: any) => {
      log({ type: 'error', msg: `An error occured, ${err.message}` })
      handleCliError(err)
      process.exit(1)
    })
  }
)
