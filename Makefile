build-dev:
	docker compose --file docker-compose-dev.yml build

up-dev:
	docker compose --file docker-compose-dev.yml up -d

down-dev:
	docker compose --file docker-compose-dev.yml down

down-dev-v:
	docker compose --file docker-compose-dev.yml down -v