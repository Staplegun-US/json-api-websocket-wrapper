start:
	nohup bash ./monitor.sh &
	echo "Started json-api-websocket-wrapper daemon"
stop:
	pkill -f "bash ./monitor.sh";
	pkill -f "node ./app.js";
	echo "Killed json-api-websocket-wrapper daemon";

