import { KafkaMicromicroCreatedPublisher } from './micromicro-created/micromicro-created.adapter'
import { KafkaMicromicroDescriptionUpdatedPublisher } from './micromicro-updated/micromicro-updated.publisher'

export const KafkaProducers = [
  KafkaMicromicroCreatedPublisher,
  KafkaMicromicroDescriptionUpdatedPublisher
]
