import { dim } from 'kolorist'

import { AUTHOR, PROJECT_NAME, VERSION } from './constants'
import log from './log'

export class CliError extends Error {}

const indent = ' '.repeat(4)

export const handleCliError = (error: any) => {
  if (error instanceof Error && !(error instanceof CliError)) {
    if (error.stack) {
      log({
        type: 'error',
        msg: error.stack.split('\n').slice(1).join('\n'),
      })
    }
    log({
      type: 'error',
      msg: `\n${indent}${dim(`${PROJECT_NAME} v${VERSION}`)}`,
    })
    log({
      type: 'error',
      msg: `\n${indent}Please open a Bug report with the information above:`,
    })
    log({
      type: 'error',
      msg: `${indent}https://github.com/${AUTHOR}/${PROJECT_NAME}/issues/new`,
    })
  }
}
