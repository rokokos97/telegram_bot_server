build:
	 docker build --platform linux/amd64 -t rokokos97/telegram-bot-server:latest .
run:
	docker run -d -p 8080:8080 --name telegram-bot-server --rm rokokos97/telegram-bot-server
