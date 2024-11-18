import {IntegrationDefinition, z} from '@botpress/sdk'
import { integrationName } from './package.json'

export default new IntegrationDefinition({
  name: integrationName,
  version: '0.0.1',
  readme: 'hub.md',
  icon: 'icon.svg',
  actions: {
    createTrackableLink: {
      title: 'Create Trackable Link',
      description: 'Takes a link as an input and returns a link that notifies the author when the link is clicked.',
      input: {
        schema: z.object({
          conversationId: z.string().describe('ID of the conversation'),
          originalLink: z.string().describe('URL of the link to be tracked'),
        }),
      },
      output: {
        schema: z.object({
          trackableLink: z.string().describe('URL of the trackable link'),
        })
      },
    }
  },
  events: {
    clickedLink: {
      schema: z.object({
        conversationId: z.string().describe("ID of the conversation to notify the user"),
        originalLink: z.string(),
      })
    },
  },
})
