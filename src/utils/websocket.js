export function sendWebsocket(url, sendData, successCallback, errCallback) {
    // let wsUrl = "ws://" + "10.250.2.132/prod-api" + url;
    // 本地开发测试配置
    // let wsUrl = "ws://" + "192.168.9.210:18080" + url;
    // let wsUrl = "ws://" + "127.0.0.1:18080" + url;
    //外网
    // let wsUrl = "ws://" + "192.168.0.31:8080" + url;
    let wsUrl = "ws://" + "117.78.31.124:8080" + url;
    let ws = new WebSocket(wsUrl);

    //连接
    ws.onopen = function (event) {
        if (event.currentTarget.readyState === 1) {
            if(sendData){
                ws.send(JSON.stringify(sendData));
            }else{
                ws.send(JSON.stringify("start"));
            }
        }
    }
    ws.onmessage = function (event) {
        successCallback(JSON.parse(event.data))
    }
    return ws
}