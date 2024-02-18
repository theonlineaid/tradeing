// websocket.worker.js

let bufferedData = []
let marketData = []
let datas = new Map()

self.addEventListener('message', (event) => {
  const {type, data} = event.data

  if (type === 'connect') {
    const ws = new WebSocket(data.itchSocketURL)

    ws.onopen = () => {
      console.log('Connection Established!')
    }
    ws.onmessage = (messageEvent) => {
      const response = JSON.parse(messageEvent.data)
      let newMap = new Map(datas)
      newMap.set(response.id, response)
      datas = newMap
      // self.postMessage({ type: 'data', data: Array.from(newMap.values()) });
      // bufferedData = [...Array.from(newMap.values())];
      // Send a message to the main thread to indicate new data is available
      self.postMessage({type: 'data-available', data: Array.from(newMap.values())})
    }

    ws.onclose = (e) => {
      console.log(e)
      console.log('Connection Closed!')
    }
    ws.onerror = () => {
      console.log('WS Error')
    }
  }

  if (type === 'getData') {
    self.postMessage({type: 'data', data: bufferedData})
  }
})
