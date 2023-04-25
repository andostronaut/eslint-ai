import { blue, green, red, dim } from 'kolorist'

type Type = 'info' | 'success' | 'error'

const log = ({
  type,
  msg,
  isConsole = true,
}: {
  type?: Type
  msg: string
  isConsole?: boolean
}) => {
  switch (type) {
    case 'info':
      return isConsole
        ? console.info(`\n${blue('❔')} ${msg}`)
        : `\n${blue('❔')} ${msg}`
    case 'success':
      return isConsole
        ? console.log(`\n${green('✔')} ${msg}`)
        : `\n${green('✔')} ${msg}`
    case 'error':
      return isConsole
        ? console.error(`\n${red('❌')} ${msg}`)
        : `\n${red('❌')} ${msg}`
    default:
      return isConsole
        ? console.log(`\n${dim('❕')} ${msg}`)
        : `\n${dim('❕')} ${msg}`
  }
}

export default log
