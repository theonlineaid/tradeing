import { MarketDataStruct } from '#common/types/market-data'
import * as React from 'react'
import demoData from './marketData.json'

// export const MarketDataContext = React.createContext<MarketDataType | null>(null)
export const MarketDataContext = React.createContext<any | null>(null)

interface Props {
  children?: React.ReactNode
}
const MarketDataProvider: React.FC<Props> = ({ children }) => {
  const [marketDatas, setMarketDatas] = React.useState<MarketDataStruct[]>(
    [...demoData]
    //   [
    //   {"id": 1002, "short_name": "ACIFORMULA", "group": "A", "bq": 0, "aq": 0, "bid": 0.0, "ask": 0.0, "open": 0.0, "last": 0.0, "volume": 0, "high": 0.0, "low": 0.0, "d": 0.0, "settle_1": 0.0, "settle": 0.0, "ct_tvol": 0.0, "orders":
    //   [
    //       {"side": "B", "qty": 1, "price": 100, "order_number": 20230000001}
    //   ]},
    //   {"id": 1003, "short_name": "ALIF", "group": "A", "bq": 0, "aq": 0, "bid": 0.0, "ask": 0.0, "open": 0.0, "last": 0.0, "volume": 0, "high": 0.0, "low": 0.0, "d": +10.0, "settle_1": 0.0, "settle": 0.0, "ct_tvol": 0.0, "orders": [

    //     {"side": "S", "qty": 1, "price": 200}
    //   ]},
    //   {"id": 1004, "short_name": "ACIFORMULA ggggg", "group": "A", "bq": 364584, "aq": 12502, "bid": 120.0, "ask": 1110.00, "open": 1220.00, "last": 120.00, "volume": 45874520, "high": 45.0, "low": 40.0, "d": -40.50, "settle_1": 10.0, "settle": 220.0, "ct_tvol": 40000, "orders": []},
    //   {"id": 1005, "short_name": "ACIFORMULA", "group": "A", "bq": 0, "aq": 0, "bid": 0.0, "ask": 0.0, "open": 0.0, "last": 0.0, "volume": 0, "high": 0.0, "low": 0.0, "d": 0.0, "settle_1": 0.0, "settle": 0.0, "ct_tvol": 0.0, "orders": []},
    //   {"id": 1006, "short_name": "ACIFORMULA", "group": "A", "bq": 0, "aq": 0, "bid": 0.0, "ask": 0.0, "open": 0.0, "last": 0.0, "volume": 0, "high": 0.0, "low": 0.0, "d": 0.0, "settle_1": 0.0, "settle": 0.0, "ct_tvol": 0.0, "orders": []},
    // ]
  )
  const wss: any = React.useRef(null)

  let data = new Map()

  const fetchItchSocketData = () => {
    const itchSocketURL = import.meta.env.REACT_APP_ITCH_SOCKET
    const ws = new WebSocket(itchSocketURL)

    ws.onopen = () => {
      // setMarketDatas(demoData)
      console.log('Connection Established!')
    }
    ws.addEventListener('message', (event) => {
      const response: MarketDataStruct = JSON.parse(event.data)
      saveData(response)
    })

    // const saveData = (response) => {
    //   setMarketDatas(prevState => {
    //     let newMap = new Map(data)
    //     newMap.set(response.id, response)
    //     data = newMap
    //     return Array.from(newMap.values())
    //   });
    // }
    ws.onmessage = (event) => {
      const response: MarketDataStruct = JSON.parse(event.data)
      setMarketDatas((prevState) => {
        let newMap = new Map(data)
        newMap.set(response.id, response)
        data = newMap
        return Array.from(newMap.values())
      })
    }

    ws.onclose = () => {
      setMarketDatas(demoData)
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

  React.useEffect(() => {
    fetchItchSocketData()
  }, [])

  const saveData = (item: MarketDataStruct) => {
    const newData: MarketDataStruct = {
      id: item?.id,
      short_name: item?.short_name,
      group: item?.group,
      bq: item?.bq,
      bid: item?.bid,
      ask: item?.ask,
      aq: item?.aq,
      last: item?.last,
      open: item?.open,
      high: item?.high,
      low: item?.low,
      volume: item?.volume,
      d: item?.d,
      settle_1: item?.settle_1,
      settle: item?.settle,
      ct_tvol: item?.ct_tvol,
      orders: item?.orders,
      board: item?.board,
      status: item?.status,
      chg: item?.chg,
      buy_pending: item?.buy_pending,
      sell_pending: item?.sell_pending,
      reference: item?.reference,
      orderbook: item?.orderbook,
      isin_code: item?.isin_code,
      instrument_type: item?.instrument_type,
      firm_id: item?.firm_id,
      market_type: item?.market_type,
      session: item?.session,
      share_type: item?.share_type,
      ticker: item?.ticker,
    }
    setMarketDatas((marketDatas) => [newData, ...marketDatas])
    // setMarketDatas([...marketDatas, newData])
  }
  const updateData = (id: number) => {
    marketDatas.filter((item: MarketDataStruct) => {
      if (item.id === id) {
        setMarketDatas([...marketDatas])
      }
    })
  }

  return (
    <MarketDataContext.Provider value={{ marketDatas, saveData, updateData }}>
      {children}
    </MarketDataContext.Provider>
  )
}

export default MarketDataProvider
