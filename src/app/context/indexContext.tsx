import {createContext, useEffect, useRef, useState} from 'react'

export const IndexDataContext = createContext<any | null>(null)

interface Props {
  children?: React.ReactNode
}

const IndexDataProvider: React.FC<Props> = ({children}) => {
  const [indexData, setIndexData] = useState<any[]>()

  //   const worker = new Worker('websocket.worker.js')
  // const itchSocketURL = import.meta.env.REACT_APP_INDEX_SOCKET
  // const itchSocketURL = 'ws://203.202.247.206:8768/ws'

  const wss: any = useRef(null)
  let data = new Map()

  const fetchItchSocketData = () => {
    const itchSocketURL = import.meta.env.REACT_APP_INDEX_SOCKET
    const ws = new WebSocket(itchSocketURL)

    ws.onopen = () => {
      console.log('Connection Established!')
    }

    ws.addEventListener('message', (event) => {})

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data)

      setIndexData((prevState) => {
        let newMap = new Map(data)
        newMap.set(response.security_name, response)
        data = newMap

        return Array.from(newMap.values())
      })
    }

    ws.onclose = () => {
      //   setIndexData(demoData)
      console.log('Connection Closed!')
    }

    ws.onerror = () => {
      console.log('WS Error')
    }
    wss.current = ws

    return () => {
      ws.close()
    }
  }

  useEffect(() => {
    fetchItchSocketData()
  }, [])

  return <IndexDataContext.Provider value={{indexData}}>{children}</IndexDataContext.Provider>
}

export default IndexDataProvider
