import { cli } from 'cleye'

import config from './commands/config'
import { COMMAND_NAME, VERSION } from './utils/constants'
import { handleCliError } from './utils/cli-error'
import log from './utils/log'
import { linter } from './linter'

cli(
  {
    name: COMMAND_NAME,
    version: VERSION,
    commands: [config],
  },
  argv => {
    const input = argv._.join(' ')
    linter({ input }).catch((err: any) => {
      log({ type: 'error', msg: `An error occured, ${err.message}` })
      handleCliError(err)
      process.exit(1)
    })
  }
)
