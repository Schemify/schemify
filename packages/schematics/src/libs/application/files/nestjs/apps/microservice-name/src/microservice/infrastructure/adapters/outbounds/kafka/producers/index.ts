import { KafkaMicroserviceNameCreatedPublisher } from './microservice-name-created/microservice-name-created.adapter'
import { KafkaMicroserviceNameDescriptionUpdatedPublisher } from './microservice-name-updated/microservice-name-updated.publisher'

export const KafkaProducers = [
  KafkaMicroserviceNameCreatedPublisher,
  KafkaMicroserviceNameDescriptionUpdatedPublisher
]
