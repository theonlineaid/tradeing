import newsDataDemo from '#tws/components/views/Notice/newsData'
import {FC, createContext, useRef, useState} from 'react'

interface Props {
  children?: React.ReactNode
}

export const NewsDataContext = createContext<any | null>(null)

export const NewsDataProvider: FC<Props> = ({children}) => {
  // const [newsData, setNewsData] = useState<any>([])
  const [newsData, setNewsData] = useState<any>(newsDataDemo)
  const [filterDataByFarmId, setFilterDataByFarmId] = useState<any>([])

  const wss: any = useRef(null)

  const fetchItchSocketData = () => {
    const itchSocketURL = 'ws://192.168.1.213:8765/ws'
    const ws = new WebSocket(itchSocketURL)

    ws.onopen = () => {
      console.log('Connection Established!')
    }

    ws.addEventListener('message', (event) => {})

    ws.onmessage = (event) => {
      const response: any = JSON.parse(event.data)

      setNewsData((prev) => [...prev, response])
    }

    ws.onclose = () => {
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

  // const filterData = (firmId) => {
  //   const d = newsData.filter((n) => n.firmId === firmId)

  //   setFilterDataByFarmId(d)
  // }

  // useEffect(() => {
  //   fetchItchSocketData()
  // }, [])

  return <NewsDataContext.Provider value={{newsData}}>{children}</NewsDataContext.Provider>
}
