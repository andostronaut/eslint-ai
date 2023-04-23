import { blue, green, red, dim } from 'kolorist'

type Type = 'info' | 'success' | 'error'

const log = ({ type, msg }: { type: Type; msg: string }) => {
  switch (type) {
    case 'info':
      return console.info(`\n${blue('❔')} ${msg}`)
    case 'success':
      return console.log(`\n${green('✔')} ${msg}`)
    case 'error':
      return console.error(`\n${red('❌')} ${msg}`)
    default:
      return console.log(`\n${dim('❕')} ${msg}`)
  }
}

export default log
