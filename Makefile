RELEASE ?= dev

.PHONY: build

live-build:
	@sudo docker build -t localhost:32000/notiboy:live -f build/Dockerfile.live .
	@echo "Built image localhost:32000/notiboy:live"
	@sudo docker push localhost:32000/notiboy:live
	@echo "Pushed image localhost:32000/notiboy:live"


live-tr:
	@kubectl delete -f build/live-manifest.yaml --ignore-not-found
	@kubectl create -f build/live-manifest.yaml

live-tbr: live-build live-tr

stage-build:
	@sudo docker build -t localhost:32000/notiboy:stage -f build/Dockerfile.stage .
	@echo "Built image localhost:32000/notiboy:stage"
	@sudo docker push localhost:32000/notiboy:stage
	@echo "Pushed image localhost:32000/notiboy:stage"


stage-tr:
	@kubectl delete -f build/stage-manifest.yaml --ignore-not-found
	@kubectl create -f build/stage-manifest.yaml

stage-tbr: stage-build stage-tr
