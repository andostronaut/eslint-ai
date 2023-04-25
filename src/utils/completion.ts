import { OpenAIApi, Configuration, ChatCompletionRequestMessage } from 'openai'
import dedent from 'dedent'
import { IncomingMessage } from 'http'
import { CliError } from './cli-error'
import type { AxiosError } from 'axios'
import { streamToString } from './stream-to-string'

function getOpenAi(key: string, apiEndpoint: string) {
  const openAi = new OpenAIApi(
    new Configuration({ apiKey: key, basePath: apiEndpoint })
  )
  return openAi
}

export const generateCompletion = async ({
  prompt,
  number = 1,
  key,
  model,
  apiEndpoint,
}: {
  prompt: string | ChatCompletionRequestMessage[]
  number?: number
  model?: string
  key: string
  apiEndpoint: string
}) => {
  const openAi = getOpenAi(key, apiEndpoint)
  try {
    const completion = await openAi.createChatCompletion(
      {
        model: model || 'gpt-3.5-turbo',
        messages: Array.isArray(prompt)
          ? prompt
          : [{ role: 'user', content: prompt }],
        n: Math.min(number, 10),
        stream: true,
      },
      { responseType: 'stream' }
    )

    return completion.data as unknown as IncomingMessage
  } catch (err) {
    const error = err as AxiosError

    if (error.code === 'ENOTFOUND') {
      throw new CliError(
        `Error connecting to ${error.request.hostname} (${error.request.syscall}). Are you connected to the internet?`
      )
    }

    const response = error.response
    let message = response?.data as string | object | IncomingMessage
    if (response && message instanceof IncomingMessage) {
      message = await streamToString(
        response.data as unknown as IncomingMessage
      )
      try {
        message = JSON.parse(message)
      } catch (e) {
        /* ignore */
      }
    }

    const messageString = message && JSON.stringify(message, null, 2)
    if (response?.status === 429) {
      throw new CliError(
        dedent`
        Request to OpenAI failed with status 429. This is due to incorrect billing setup or excessive quota usage. Please follow this guide to fix it: https://help.openai.com/en/articles/6891831-error-code-429-you-exceeded-your-current-quota-please-check-your-plan-and-billing-details

        You can activate billing here: https://platform.openai.com/account/billing/overview . Make sure to add a payment method if not under an active grant from OpenAI.

        Full message from OpenAI:
      ` +
          '\n\n' +
          messageString +
          '\n'
      )
    } else if (response && message) {
      throw new CliError(
        dedent`
        Request to OpenAI failed with status ${response?.status}:
      ` +
          '\n\n' +
          messageString +
          '\n'
      )
    }

    throw error
  }
}
