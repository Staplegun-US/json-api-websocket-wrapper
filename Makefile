list:
	@ echo "$$(tput setaf 6)Monitor script processes:$$(tput sgr 0)"
	@ pgrep -fl "bash ./monitor.s"
	@ echo "$$(tput setaf 6)Node app processes:$$(tput sgr 0)"
	@ pgrep -fl "node ./app.js"
start:
	nohup bash ./monitor.sh &
	@ echo "$$(tput setaf 6)Started json-api-websocket-wrapper daemon"$$(tput sgr 0)
stop:
	- pkill -f "bash ./monitor.sh"
	- pkill -f "node ./app.js"
	@ echo "$$(tput setaf 6)Killed json-api-websocket-wrapper daemon$$(tput sgr 0)"
