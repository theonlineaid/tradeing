import * as React from "react";
import { MarketDataStruct, MarketDataType } from "#common/types/market-data";
import demoData from './marketData.json'
import {v1 as uuidv1} from 'uuid'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "#store/index";
import cogoToast from "cogo-toast";
import { useCookies } from "react-cookie";
import { changeBuySellApi, changeClientCode } from "#store/slices/buysell";
import { BlotterDataContext } from "./blotterDataContext";
import { BlotterDataType } from "#common/types/blotter-data";
import TradingInterface from "#common/types/trading-list";

export const FixSocketContext = React.createContext<any>(null);

interface Props {
  children?: React.ReactNode;
}
const FixSocketProvider: React.FC<Props> = ({ children }) => {
  const [cookies] = useCookies(['Authorization'])
  const dispatch = useDispatch()
  const [fixSocket, setFixSocket] = React.useState<null | WebSocket>(null)
  const [uuid, setUUID] = React.useState(null)
  const {saveBlotterData} = React.useContext(BlotterDataContext) as BlotterDataType;
  const {userData, loginState, watchList, error} = useSelector((state: RootState) => state)

  const INIT_BUY_SELL_API: TradingInterface= {
    order_type:'',
    qty: 0,
    price: 0, 
    bo_id: ''
  }

  const setupUUID = () => {
    setUUID(uuidv1())
    localStorage.setItem('socketID', JSON.stringify({useId: userData?.profile?.id, uuid}))
  }

  const setupBuySellSocket = (socketURL: string) => {
    if (!socketURL) {
      console.error('you forgot to add socket url')
    }
    // const authorizationToken = cookies?.Authorization;
    // const buySellSocketURLWithToken = `${socketURL}?token=${authorizationToken}`;
    // const buySellSockets = new WebSocket(buySellSocketURLWithToken);
    const buySellSockets = new WebSocket(socketURL)

    buySellSockets.addEventListener('open', (event) => {
  
      // console.log('*********** Socket connected, try to send ******************')

      // console.log({open: event, time: new Date().toLocaleTimeString()})

      const authMsg = {
        token: `Bearer ${cookies?.Authorization}`,
      }
      buySellSockets?.send(JSON.stringify(authMsg))
    })

    buySellSockets.addEventListener('message', (event) => {
      
      const data = JSON.parse(event?.data)
      // FIXME: Reject message

      console.log("=================Response================",data);
      if (data?.message_type) {
        switch (data?.message_type) {
          case 'connection':
              cogoToast.success(data?.message, {position: 'top-right'})
            break;
          case 'order_submitted':
              cogoToast.success(data?.message, {position: 'top-right'})
            break;
          case 'order_report':
              if(data?.rejectionReason) cogoToast.error(data?.rejectionReason, {position: 'top-right'})
              dispatch(changeBuySellApi(INIT_BUY_SELL_API))
              dispatch(changeClientCode(''))
              // cogoToast.success('Trading successful', {position: 'top-right'})
              saveBlotterData(data?.data)
            break;
        
          default:
            break;
        }
      } else {
        cogoToast.error('Something went wrong', {position: 'top-right'})
      }
      
    })

    buySellSockets.addEventListener('error', (event) => {
      localStorage.removeItem('socketID')
    })

    buySellSockets.addEventListener('close', (event) => {
      localStorage.removeItem('socketID')
    })
    setFixSocket(buySellSockets)
  }

  React.useEffect(() => {
    const _data = localStorage.getItem('socketID')
    if (_data) {
      const data = JSON.parse(_data)
      if (data.userId !== userData?.profile?.id) {
        setupUUID()
      } else {
        setUUID(data.uuid)
      }
    } else {
      setupUUID()
    }
  }, [])

  React.useEffect(() => {
    const b_path = import.meta.env.REACT_APP_BUY_SELL_SOCKET
    const localStorageUserData = localStorage.getItem('persist:user')
    const parsedData = JSON.parse(localStorageUserData as any  )
    const profile = JSON.parse(parsedData.profile);
    
    const userType = profile.users_status;    
    if(!uuid) return
    // let buySellSocketURL: string = `${b_path}/${uuid}/`
    let buySellSocketURL: string = `${b_path}/${userType === 'investor'? profile?.user_detail?.bo_id : profile?.user_detail?.trader_code}/`
    setupBuySellSocket(buySellSocketURL)
  }, [uuid])


  return (
    <FixSocketContext.Provider value={{ fixSocket }}>
      {children}
    </FixSocketContext.Provider>
  );
};

export default FixSocketProvider;
