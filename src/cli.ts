import { cli } from 'cleye'

import config from './commands/config'
import { COMMAND_NAME, VERSION } from './utils/constants'
import { handleCliError } from './utils/cli-error'
import log from './utils/log'
import { linter } from './utils/linter'

cli(
  {
    name: COMMAND_NAME,
    version: VERSION,
    commands: [config],
  },
  argv => {
    const input = argv._.join(' ')
    linter({ input }).catch((err: any) => {
      log({ type: 'error', msg: err.message })
      handleCliError(err)
      process.exit(1)
    })
  }
)
