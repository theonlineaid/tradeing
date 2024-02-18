import { BlotterDataStruct, BlotterDataType } from '#common/types/blotter-data'
import { RootState } from '#store/index'
import * as React from 'react'
import { useSelector } from 'react-redux'
// import { blotterDataStruct, MarketDataType } from "#common/types/market-data";

export const BlotterDataContext = React.createContext<BlotterDataType | null>(null)
interface Props {
  children?: React.ReactNode
}
const BlotterDataProvider: React.FC<Props> = ({ children }) => {
  const [blotterDatas, setBlotterDatas] = React.useState<BlotterDataStruct[]>([
    // {"orderId": '121', "client_ac":1273, name  :"test", side:"Buy", execQty: 20, sentQty:20, limit: 30, status: "Done", orderStatus: "Filled", execution: "100.00%", execPx: "Rejected", date: "14:20:04"}
  ])

  React.useEffect(() => {
    if (!localStorage.getItem('blotterData')) return
    const d: any = localStorage.getItem('blotterData')
    setBlotterDatas(JSON.parse(d))
  }, [])

  let data = new Map()

  const fetchItchSocketData = () => {
    const ws = new WebSocket('ws://10.238.41.67:8080/ws/v1/itch')

    ws.onopen = () => {
      console.log('Connection Established!')
    }
    ws.binaryType = 'blob'
    ws.addEventListener('message', (event) => { })

    ws.onmessage = (event) => {
      const response: BlotterDataStruct = JSON.parse(JSON.parse(event.data)?.data)
      setBlotterDatas((prevState) => {
        let newMap = new Map(data)
        newMap.set(response.client_ac, response)
        data = newMap
        return Array.from(newMap.values())
      })
    }

    ws.onclose = () => {
      console.log('Connection Closed!')
    }

    ws.onerror = () => {
      console.log('WS Error')
    }

    return () => {
      ws.close()
    }
  }

  React.useEffect(() => {
    // fetchItchSocketData()
  }, [])

  const { buySell } = useSelector((state: RootState) => state)

  // const replaceElementById = (array, idToReplace, newElement) => {
  //   const indexToReplace = array.findIndex((item) => item?.orderId === idToReplace);

  //   if(indexToReplace === -1) return false
  //   if (indexToReplace !== -1) {
  //     // If the element with the specified ID is found
  //     array[indexToReplace] = newElement;
  //   }
  // }

  function replaceElementById(array, idToReplace, newElement) {
    let flag = false
    for (let i = 0; i < array.length; i++) {
      // if data is available to be replaced
      if (array[i].clientOrderId === idToReplace) {
        flag = true
        array[i] = newElement
        localStorage.setItem('blotterData', JSON.stringify([...array]))
        setBlotterDatas([...array])
        return // Exit the loop once the element is replaced
      }
    }

    if (flag) return
    // if data is not available to be replaced
    localStorage.setItem('blotterData', JSON.stringify([newElement, ...array]))
    setBlotterDatas((array) => [newElement, ...array])
  }

  const saveBlotterData = (item: BlotterDataStruct) => {
    let clientCode = buySell.buySellApi.bo_id

    const dateTime = item?.date.split('-')
    const date = dateTime[0]
    const time = dateTime[1].split('.')[0]

    //  format local date
    const inputDateString = date
    const year = inputDateString.slice(0, 4)
    const month = inputDateString.slice(4, 6)
    const day = inputDateString.slice(6, 8)
    const parsedDate = new Date(`${year}-${month}-${day}`)
    const formattedDate = `${day}/${month}/${parsedDate.getFullYear()}`

    // format local time
    const timeString = time
    const parsedTime = new Date(`1970-01-01T${timeString}Z`)
    const formattedTime = parsedTime
      .toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'Asia/Dhaka',
      })
      .split(', ')[1]

    // TODO: if current time is needed then replace with the above code
    // const parsedTime = new Date();
    // const formattedTime = parsedTime.toLocaleTimeString();

    // console.log(item?.date.split(':')[1], item?.date.split(':')[2])
    // {'name': 'ABBANK', 'orderId': '2023091129', 'execPx': 'Filled', 'execution': '100.0%', 'Date': '20230911-09:54:10.572', 'clientOrderId': 'so_20230912155410896', 'side': 'Sell', 'status': 'Done', 'client_ac': '0000'}
    const newData: BlotterDataStruct = {
      clientOrderId: item?.clientOrderId,
      orderId: item?.orderId,
      client_ac: clientCode ? clientCode : item?.client_ac,
      name: item?.name,
      side: item?.side,
      execQty: item?.execQty,
      sentQty: item?.sentQty,
      limit: item?.limit,
      orderStatus: item?.orderStatus,
      status: item?.status,
      execution: item?.execution,
      execPx: item?.execPx,
      date: formattedDate,
      time: formattedTime,
    }

    replaceElementById(blotterDatas, newData?.clientOrderId, newData)

    // if(tr === false){
    // localStorage.setItem('blotterData', JSON.stringify([newData, ...blotterDatas]))
    // setBlotterDatas((blotterDatas) => [newData, ...blotterDatas])
    // }
    // else {
    //   const oldData:any = [...blotterDatas]
    //   localStorage.setItem('blotterData', JSON.stringify(oldData))
    //   setBlotterDatas([...blotterDatas])
    // }
  }

  return (
    <BlotterDataContext.Provider value={{ blotterDatas, saveBlotterData }}>
      {children}
    </BlotterDataContext.Provider>
  )
}

export default BlotterDataProvider
