list:
	@ echo "$$(tput setaf 6)Monitor script processes:$$(tput sgr 0)"
	-@ pgrep -fl "./bin/monitor"
	@ echo "$$(tput setaf 6)Node app processes:$$(tput sgr 0)"
	-@ pgrep -fl "node ./app/app.js"
start:
	nohup ./bin/monitor &
	@ echo "$$(tput setaf 6)Started json-api-websocket-wrapper daemon"$$(tput sgr 0)
stop:
	- pkill -f "./bin/monitor"
	- pkill -f "node ./app/app.js"
	@ echo "$$(tput setaf 6)Killed json-api-websocket-wrapper daemon$$(tput sgr 0)"
