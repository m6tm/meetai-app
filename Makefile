build-dev:
	docker compose --file docker-compose-dev.yml build

up-dev:
	docker compose --file docker-compose-dev.yml up -d
