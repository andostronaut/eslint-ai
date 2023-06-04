import { exec } from 'node:child_process'
import path from 'path'
import * as p from '@clack/prompts'
import _ from 'lodash'

import { CliError } from './cli-error'
import log from './log'
import { CANCELED_OP_MSG } from './constants'
import { generateCompletion } from './completion'
import { getConfig } from './config'

export const linter = async ({ input }: { input: string }) => {
  const files = _.isEmpty(input) ? [] : input.split(' ')
  const spin = p.spinner()
  let cmd = ''

  if (Array.isArray(files) && files.length !== 0) {
    const hasValidExt = files.every(
      file => path.extname(file) === '.js' || path.extname(file) === '.ts'
    )

    if (!hasValidExt) {
      throw new CliError(
        'An error occured, please enter a valid file with `.js or .ts` extension.'
      )
    }

    cmd = `npx eslint ${files.join(' ')}`
  } else {
    cmd = 'npx eslint'
  }

  ;(() => {
    p.intro('ESLint: AI')
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

        p.group(
          {
            error: () => p.note(`An error found, '${prompt}'`),
            assist: () =>
              p.confirm({
                message: 'Check response for this error ?',
                initialValue: true,
              }),
          },
          {
            onCancel: () => {
              p.cancel(CANCELED_OP_MSG)
              process.exit(0)
            },
          }
        )
          .then(async ({ assist }) => {
            if (assist) {
              const {
                OPENAI_KEY: key,
                OPENAI_MODEL: model,
                OPENAI_API_ENDPOINT: apiEndpoint,
              } = await getConfig()

              if (!key) {
                throw new CliError(
                  'Please set your OpenAI API key via `eslint-ai config set OPENAI_KEY=<your token>`'
                )
              }

              spin.start('Checking response')

              const completion = await generateCompletion({
                prompt,
                key,
                model,
                apiEndpoint,
              })

              spin.stop(
                log({
                  type: 'info',
                  msg: completion,
                  isConsole: false,
                  newLine: false,
                }) as string
              )
            }
          })
          .finally(() => {
            p.outro('Goodbye!')
          })
      } else {
        spin.stop(
          log({
            type: 'success',
            msg: 'All files linted successfully with no error.',
            isConsole: false,
            newLine: false,
          }) as string
        )

        p.outro('Goodbye!')
      }
    })
  })()
}
