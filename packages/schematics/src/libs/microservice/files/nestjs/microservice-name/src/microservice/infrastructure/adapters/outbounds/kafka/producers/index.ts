import { KafkaMicroserviceNameCreatedPublisher } from './microserviceName-created/microserviceName-created.adapter'
import { KafkaMicroserviceNameDescriptionUpdatedPublisher } from './microserviceName-updated/microserviceName-updated.publisher'

export const KafkaProducers = [
  KafkaMicroserviceNameCreatedPublisher,
  KafkaMicroserviceNameDescriptionUpdatedPublisher
]
