export const readData =
  (
    iterableStream: AsyncGenerator<string, void>,
    startSignal: (content: string) => boolean,
    excluded?: string
  ) =>
  (writer: (data: string) => void): Promise<string> =>
    new Promise(async resolve => {
      let data = ''
      let content = ''
      let dataStart = false

      for await (const chunk of iterableStream) {
        const payloads = chunk.toString().split('\n\n')

        for (const payload of payloads) {
          if (payload.includes('[DONE]')) {
            dataStart = false
            resolve(data)
            return
          }

          if (payload.startsWith('data:')) {
            content = parseContent(payload)
            if (!dataStart && content.includes(excluded ?? '')) {
              dataStart = startSignal(content)
              if (excluded) break
            }

            if (dataStart && content) {
              const contentWithoutExcluded = excluded
                ? content.replaceAll(excluded, '')
                : content
              data += contentWithoutExcluded
              writer(contentWithoutExcluded)
            }
          }
        }
      }

      function parseContent(payload: string): string {
        const data = payload.replaceAll(/(\n)?^data:\s*/g, '')
        try {
          const delta = JSON.parse(data.trim())
          return delta.choices?.[0].delta?.content ?? ''
        } catch (error) {
          return `Error with JSON.parse and ${payload}.\n${error}`
        }
      }

      resolve(data)
    })
