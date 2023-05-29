RELEASE ?= dev

.PHONY: build

build:
	@sudo docker build -t localhost:32000/notiboy:$(RELEASE) -f build/Dockerfile .
	@echo "Built image localhost:32000/notiboy:$(RELEASE)"
	@sudo docker push localhost:32000/notiboy:$(RELEASE)
	@echo "Pushed image localhost:32000/notiboy:$(RELEASE)"


tr:
	@kubectl delete -f build/manifest.yaml --ignore-not-found
	@kubectl create -f build/manifest.yaml

tbr: build tr
