#!/bin/bash

echo "⏳ Waiting for Kafka to become ready..."

until kafka-topics --bootstrap-server kafka-1microservice-name:9092 --list > /dev/null 2>&1; do
  echo "⏳ Kafka not ready, retrying..."
  sleep 5
done

echo "📝 Creating default topics for microservice-name..."

kafka-topics --create --topic microservice-name.created \
  --bootstrap-server kafka-1microservice-name:9092 \
  --partitions 1 \
  --replication-factor 1 \
  --if-not-exists

kafka-topics --create --topic microservice-name.description-updated \
  --bootstrap-server kafka-1microservice-name:9092 \
  --partitions 1 \
  --replication-factor 1 \
  --if-not-exists

echo "📋 Available topics:"
kafka-topics --list --bootstrap-server kafka-1microservice-name:9092

echo "✅ Topics created successfully!"
