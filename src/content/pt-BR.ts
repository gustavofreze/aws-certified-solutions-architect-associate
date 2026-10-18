import type { Topic } from './types'
import * as cost from './topics/cost'
import * as foundations from './topics/foundations'
import * as performing from './topics/performing'
import * as performingData from './topics/performing-data'
import * as resilient from './topics/resilient'
import * as resources from './topics/resources'
import * as secure from './topics/secure'

/** The topics in Portuguese, in the order the roadmap walks them. */
export const topics: readonly Topic[] = [
  ...foundations.ptBR,
  ...secure.ptBR,
  ...resilient.ptBR,
  ...performing.ptBR,
  ...performingData.ptBR,
  ...cost.ptBR,
  ...resources.ptBR,
]
