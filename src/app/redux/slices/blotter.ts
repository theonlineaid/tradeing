import {BlotterDataStruct} from '#common/types/blotter-data'
import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import TradingInterface from '../../common/types/trading-list'

const INIT_BUY_SELL_API: TradingInterface = {
  order_type:'',
  qty: 0,
  price: 0, 
  bo_id:''
}

// export interface BuySell {
// }

function replaceElementById(array, idToReplace, newElement) {
  let data: any = []
  let flag = false
  for (let i = 0; i < array.length; i++) {
    if (array[i].clientOrderId === idToReplace) {
      flag = true
      array[i] = newElement
      data = [...array]
      return data // Exit the loop once the element is replaced
    }
  }
  if (flag) return
  data = [newElement, ...array]
  return data
}

const initialState = {
  data: [],
  type: 'All',
  status: 'All',
  source: 'All',
}

const saveBlotterData = (state: any, item: BlotterDataStruct, data: any) => {
  let clientCode = '121'
  // console.log(item?.date.split(':')[1], item?.date.split(':')[2])
  // {'name': 'ABBANK', 'orderId': '2023091129', 'execPx': 'Filled', 'execution': '100.0%', 'Date': '20230911-09:54:10.572', 'clientOrderId': 'so_20230912155410896', 'side': 'Sell', 'status': 'Done', 'client_ac': '0000'}
  const newData: BlotterDataStruct = {
    clientOrderId: item[0]?.clientOrderId,
    orderId: item[0]?.orderId,
    client_ac: clientCode ? clientCode : item[0]?.client_ac,
    name: item[0]?.name,
    side: item[0]?.side,
    execQty: item[0]?.execQty,
    sentQty: item[0]?.sentQty,
    limit: item[0]?.limit,
    orderStatus: item[0]?.orderStatus,
    status: item[0]?.status,
    execution: item[0]?.execution,
    execPx: item[0]?.execPx,
    date: item[0]?.date,
    time: item[0]?.time
  }
  const createdData = replaceElementById(item[1].data, newData?.clientOrderId, newData)
  return createdData
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

export const blotterSlice = createSlice({
  name: 'blotter',
  initialState,
  reducers: {
    changeBlotterData: (state, action: PayloadAction<any>) => {
      state.data = action.payload
        ? saveBlotterData(state, action.payload, state.data)
        : action.payload
    },
    changeType: (state, action: PayloadAction<any>) => {
      state.type = action.payload
    },
    changeStatus: (state, action: PayloadAction<any>) => {
      state.status = action.payload
    },
    changeSource: (state, action: PayloadAction<any>) => {
      state.source = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {changeBlotterData, changeType, changeStatus, changeSource} = blotterSlice.actions

export default blotterSlice.reducer
