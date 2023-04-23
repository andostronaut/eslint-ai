import { configParsers } from '../utils/config'

export type ConfigKeys = keyof typeof configParsers

export type RawConfig = {
  [key in ConfigKeys]?: string
}

export type ValidConfig = {
  [Key in ConfigKeys]: ReturnType<(typeof configParsers)[Key]>
}
