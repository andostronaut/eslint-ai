import { exec } from 'node:child_process'
import path from 'path'
import * as p from '@clack/prompts'

import { CliError } from './cli-error'
import log from './log'

export const linter = async ({ input }: { input: string }) => {
  const files = input.split(' ')
  const spin = p.spinner()

  const hasValidExt = files.every(
    file => path.extname(file) === '.js' || path.extname(file) === '.ts'
  )

  if (!hasValidExt) {
    throw new CliError(
      'An error occured, please enter a valid file with `.js or .ts` extension.'
    )
  }

  const cmd = `eslint ${
    Array.isArray(files) && files.length !== 0 ? files.join(' ') : ''
  }`

  spin.start('Linting your code')

  exec(cmd, err => {
    if (err) {
      const error = err.stack?.split('\n').filter(e => e !== '')[3] || ''
      throw new CliError(`An error occured, ${error}.`)
    }

    spin.stop(
      log({
        type: 'success',
        msg: 'All files linted successfully with no error.',
        isConsole: false,
      }) as string
    )
  })
}
