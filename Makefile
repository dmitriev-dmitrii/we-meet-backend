include .env

all: up

install : clean up

clean-dist:
	rm -f -r dist

up:
	docker compose up -d
	@echo '${APP_NAME} : ${APP_PORT}'

down:
	docker compose down

clean: clean-dist
	docker-compose down -v --rmi local



