#!/bin/bash

APP_NAME="todo-backend-dev"
MONGO_NAME="todo-mongo-dev"
SEED_SCRIPT_PATH="src/databases/seeders/seed.ts"
COMPOSE_FILE="docker-compose.dev.yml"
LOG_FILE="logs/dev.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

mkdir -p logs

log() {
  echo -e "$1" | tee -a $LOG_FILE
}

check_container_status() {
  log "${CYAN}🔍 Checking container status...${NC}"
  docker ps --filter "name=$APP_NAME" --filter "status=running" --format "{{.Names}}" | grep -q "$APP_NAME"
  if [ $? -ne 0 ]; then
    log "${RED}❌ App container ($APP_NAME) is not running.${NC}"
    exit 1
  fi
  docker ps --filter "name=$MONGO_NAME" --filter "status=running" --format "{{.Names}}" | grep -q "$MONGO_NAME"
  if [ $? -ne 0 ]; then
    log "${RED}❌ MongoDB container ($MONGO_NAME) is not running.${NC}"
    exit 1
  fi
  log "${GREEN}✅ Containers are running correctly.${NC}"
}

wait_for_mongo() {
  log "${YELLOW}⏳ Waiting for MongoDB to respond to ping...${NC}"
  MAX_RETRIES=10
  RETRIES=0

  until docker exec "$MONGO_NAME" mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1
  do
    if [ $RETRIES -ge $MAX_RETRIES ]; then
      log "${RED}❌ MongoDB did not become ready in time.${NC}"
      exit 1
    fi
    log "⌛ Waiting for MongoDB... ($((RETRIES + 1))/$MAX_RETRIES)"
    sleep 2
    RETRIES=$((RETRIES + 1))
  done

  log "${GREEN}✅ MongoDB is ready.${NC}"
}

start() {
  log "${CYAN}🚀 Starting development environment...${NC}"
  echo "" > $LOG_FILE

  log "${GREEN}📦 Building Docker images...${NC}"
  docker compose -f $COMPOSE_FILE build >> $LOG_FILE 2>&1
  if [ $? -ne 0 ]; then
    log "${RED}❌ Build failed. Check logs/dev.log for details.${NC}"
    exit 1
  fi

  log "${GREEN}🐳 Starting containers...${NC}"
  docker compose -f $COMPOSE_FILE up -d >> $LOG_FILE 2>&1
  if [ $? -ne 0 ]; then
    log "${RED}❌ Failed to start containers.${NC}"
    exit 1
  fi

  wait_for_mongo
  check_container_status

  log "${GREEN}🌱 Running seed script: $SEED_SCRIPT_PATH...${NC}"
  docker exec -it $APP_NAME npx ts-node $SEED_SCRIPT_PATH >> $LOG_FILE 2>&1
  if [ $? -ne 0 ]; then
    log "${RED}❌ Seed script failed. Check logs/dev.log for errors.${NC}"
    exit 1
  fi

  log "${GREEN}✅ Development environment is ready and seeded.${NC}"
}

stop() {
  log "${CYAN}🛑 Stopping and cleaning up containers...${NC}"
  docker compose -f $COMPOSE_FILE down -v >> $LOG_FILE 2>&1
  if [ $? -ne 0 ]; then
    log "${RED}❌ Failed to stop containers.${NC}"
    exit 1
  fi
  log "${GREEN}🧼 Cleanup complete. Volumes and containers removed.${NC}"
}

restart() {
  log "${CYAN}🔁 Restarting development environment...${NC}"
  stop
  start
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    restart
    ;;
  *)
    log "${RED}❌ Invalid command. Use one of:${NC}"
    echo -e "  ${CYAN}./docker-dev.sh start${NC}     - Build, start, and seed"
    echo -e "  ${CYAN}./docker-dev.sh stop${NC}      - Stop and clean up"
    echo -e "  ${CYAN}./docker-dev.sh restart${NC}   - Restart everything"
    exit 1
    ;;
esac
