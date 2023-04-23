import { exec } from 'node:child_process'
import path from 'path'

import { CliError } from './utils/cli-error'

export const linter = async ({ input }: { input: string }) => {
  const files = input.split(' ')

  const hasValidExt = files.every(
    file => path.extname(file) === '.js' || path.extname(file) === '.ts'
  )

  if (!hasValidExt) {
    throw new CliError(
      'An error occured, please enter a valid file with `.js or .ts` ext'
    )
  }

  const cmd = `eslint ${
    Array.isArray(files) && files.length !== 0 ? files.join(' ') : ''
  }`

  exec(cmd, (err, stdout) => {
    if (err) {
      throw new Error(`An error occured, ${err.message}`)
    }

    console.log(stdout)
  })
}
