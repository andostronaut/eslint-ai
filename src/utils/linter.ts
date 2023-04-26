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

  ;(async () => {
    spin.start('Linting your code')

    exec(cmd, err => {
      if (err) {
        const error: string =
          err.stack?.split('\n').filter(e => e !== '')[3] || ''

        const prompt = `eslint: ${error.toLocaleLowerCase()}`

        spin.stop(
          log({
            type: 'error',
            msg: prompt,
            isConsole: false,
            newLine: false,
          }) as string
        )
      } else {
        spin.stop(
          log({
            type: 'success',
            msg: 'All files linted successfully with no error.',
            isConsole: false,
          }) as string
        )
      }
    })
  })()
}
