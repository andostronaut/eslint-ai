import { dim } from 'kolorist'
import { AUTHOR, PROJECT_NAME, VERSION } from './constants'

export class CliError extends Error {}

const indent = ' '.repeat(4)

export const handleCliError = (error: any) => {
  if (error instanceof Error && !(error instanceof CliError)) {
    if (error.stack) {
      console.error(dim(error.stack.split('\n').slice(1).join('\n')))
    }
    console.error(`\n${indent}${dim(`${PROJECT_NAME} v${VERSION}`)}`)
    console.error(
      `\n${indent}Please open a Bug report with the information above:`
    )
    console.error(
      `${indent}https://github.com/${AUTHOR}/${PROJECT_NAME}/issues/new`
    )
  }
}
