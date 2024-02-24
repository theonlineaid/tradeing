export const getNewsDataFromSocket = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const data = await res.json()

  // return data

  const itchSocketURL = 'ws://10.238.41.69:8766/ws'
  const ws = new WebSocket(itchSocketURL)

  let newsData: any = []

  ws.onopen = () => {
    console.log('Connection Established!')
  }

  ws.addEventListener('message', (event) => {})

  ws.onmessage = (event) => {
    const response: any = JSON.parse(event.data)
    newsData.push(response)
    console.log('==========***New Data***=========', response)
    return newsData
  }

  ws.onclose = () => {
    console.log('Connection Closed!')
  }

  ws.onerror = () => {
    console.log('WS Error')
  }

  // ws.close()
}
