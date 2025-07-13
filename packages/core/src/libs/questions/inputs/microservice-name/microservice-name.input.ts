import { validateName } from './validate-microservice-name.js'

export function microserviceNameQuestion() {
  return {
    type: 'input',
    name: 'name',
    message: 'Enter the name of your microservice:',
    initial: 'microservice-name',
    validate: validateName
  }
}
