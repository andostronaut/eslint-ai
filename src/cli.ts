import { cli } from 'cleye'
import { red } from 'kolorist'

import config from './commands/config'

import { COMMAND_NAME, VERSION } from './utils/constants'
import { handleCliError } from './utils/cli-error'

import { linter } from './linter'

cli(
  {
    name: COMMAND_NAME,
    version: VERSION,
    commands: [config],
  },
  argv => {
    const prompt = argv._.join(' ')
    linter({ prompt }).catch(err => {
      console.error(`\n${red('✖')} ${err.message}`)
      handleCliError(err)
      process.exit(1)
    })
  }
)
