import { blue, green, red, dim } from 'kolorist'

type Type = 'info' | 'success' | 'error'

const log = ({
  type,
  msg,
  isConsole = true,
  newLine = true,
}: {
  type?: Type
  msg: string
  isConsole?: boolean
  newLine?: boolean
}) => {
  switch (type) {
    case 'info':
      return isConsole
        ? console.info(`${newLine ? '\n' : ''} ${blue('❔')} ${msg}`)
        : `${newLine ? '\n' : ''} ${blue('❔')} ${msg}`
    case 'success':
      return isConsole
        ? console.log(`${newLine ? '\n' : ''} ${green('✔')} ${msg}`)
        : `${newLine ? '\n' : ''} ${green('✔')} ${msg}`
    case 'error':
      return isConsole
        ? console.error(` ${newLine ? '\n' : ''} ${red('❌')} ${msg}`)
        : `${newLine ? '\n' : ''} ${red('❌')} ${msg}`
    default:
      return isConsole
        ? console.log(`${newLine ? '\n' : ''} ${dim('❕')} ${msg}`)
        : `${newLine ? '\n' : ''} ${dim('❕')} ${msg}`
  }
}

export default log
