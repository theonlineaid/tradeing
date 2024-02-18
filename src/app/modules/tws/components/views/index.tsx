import {InitLayoutPartInterface} from '#common/types/layout'
import * as _ from 'lodash'
import {map} from 'lodash'
import React, {useCallback, useEffect, useState} from 'react'
import ModalDialog from 'react-bootstrap/ModalDialog'
import Draggable from 'react-draggable'
import type {ReactChildren} from 'react-grid-layout/lib/utils'
import {useDispatch, useSelector} from 'react-redux'
import {TypeChooser} from 'react-stockcharts/lib/helper'
import 'reactjs-popup/dist/index.css'
import {useLayout} from '../../../../../_metronic/layout/core'
import useGridLayout from '../../../../hooks/use-grid-layout'
import {Dashboard} from '../../../../layouts'
import type {RootState} from '../../../../redux'
import {userTableLayout, userTableList} from '../../../auth/core/_requests'
import Chart from '../../Chart'
import Blotter from './Blotter'
import BuySell from './BuySell'
import Execution from './Execution'
import Group from './Group'
import Individual from './Individual'
import MoversGainers from './MoversGainers'
import OrderSummery from './OrderSummery'
import Position from './Position'
// import TradeList from './Trade/TradingList'
import MyAlert from '#common/components/ui/MyAlert'
import {
  changeBuySellApi,
  changeIsBuy,
  changeIsConfirmShow,
  changeIsShow,
  changeIsUpdateShow,
} from '#store/slices/buysell'
import {addInitialLayout} from '#store/slices/layouts'
import News from './Notice'
import Report from './Report'
import MarketData from './Trade'
// import TradeBarChart from './TradeBarChart'

const tableData = [
  {
    id: 70,
    code: '001',
    name: 'Trading List',
    table_type: 'trading',
    view_type: 'GROUP',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
    // sub_table: [{name: 'Watch List 1'}, {name: 'Watch List 2'}],
  },
  {
    id: 72,
    code: '001',
    name: 'Buy Sell',
    table_type: 'buySell',
    view_type: 'MARKET',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
  {
    id: 73,
    code: '001',
    name: 'Movers Gainers',
    table_type: 'moversGainers',
    view_type: 'INDIVIDUAL',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
  {
    id: 74,
    code: '001',
    name: 'Order Summery',
    table_type: 'orderSummery',
    view_type: 'INDIVIDUAL',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
  {
    id: 75,
    code: '001',
    name: 'Blotter',
    table_type: 'blotter',
    view_type: 'INDIVIDUAL',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
  {
    id: 76,
    code: '001',
    name: 'Position',
    table_type: 'position',
    view_type: 'INDIVIDUAL',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
  {
    id: 77,
    code: '001',
    name: 'Execution',
    table_type: 'execution',
    view_type: 'INDIVIDUAL',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
  {
    id: 78,
    code: '001',
    name: 'News',
    table_type: 'news',
    view_type: 'INDIVIDUAL',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
  {
    id: 780,
    code: '001',
    name: 'trading2 two',
    table_type: 'trading2',
    view_type: 'GROUP',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
  {
    id: 79,
    code: '001',
    name: 'Report',
    table_type: 'report',
    view_type: 'INDIVIDUAL',
    table_user_order: 1,
    is_hide: false,
    is_minimize: false,
    page: 4,
    sub_table: [],
  },
]

export class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle='.modal-title'>
        <ModalDialog {...this.props} />
      </Draggable>
    )
  }
}

const TradingMapWrapComponent = ({tradingData}) => {
  return (
    <div className='card-body w-100 h-100'>
      {tradingData?.length ? (
        <TypeChooser>{(type) => <Chart type='hybrid' data={tradingData} ratio={1} />}</TypeChooser>
      ) : (
        <div className='skeleton'>
          <div className='square d-flex justify-content-center align-items-center'>
            <strong>Loading...</strong>
          </div>
        </div>
      )}
    </div>
  )
}

export function List() {
  // console.log('List component rerender #############################')

  // Hooks
  // const SOCKET_UTL = import.meta.env.REACT_APP_TRADE_LIST_SOCKET + '/' ?? ''
  const {config} = useLayout()

  const {aside} = config
  const dispatch = useDispatch()
  const {settings, userData, layouts, error, watchList} = useSelector((state: RootState) => state)
  const [tables, setTables] = useState<any>()
  // const {saveData} = useContext(MarketDataContext) as MarketDataType;

  const buySell = useSelector((state: RootState) => state.buySell)

  useEffect(() => {
    ;(async () => {
      const tableLayout = await userTableLayout()
      dispatch(addInitialLayout(tableLayout?.data?.data))

      console.log('=====🤷‍♀️===', tableLayout?.data?.data)
    })()
  }, [])

  useEffect(() => {
    // demoData?.map(item => {
    //   saveData(item)
    // })
    ;(async function () {
      const response = await userTableList()

      // add the statics data to the watch list
      // const watchLists = watchList.categories.map((c, i) => {
      //   return {
      //     id: 70 + i + 20,
      //     tablesetting: 2,
      //     table_name: c.name,
      //     table_type: 'trading',
      //     view_type: 'GROUP',
      //     table_user_order: i + 3,
      //     hide: true,
      //     user: 69,
      //   }
      // })

      // concat the all watch list
      // const allWatchLists = _.concat(response.data?.table_user_data, watchLists)

      const modified = _.chain(response?.data?.data)
        // Group the elements of Array based on `color` property
        .groupBy((item) => `${item.table_type}_${item.view_type}`)
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({view: key, tables: value}))
        .value()
      setTables(modified)
    })()
  }, [watchList.categories])

  const {onBreakpointChange, onLayoutChange, handleMinimize, handleDefault, onDrop} = useGridLayout(
    {
      pageName: 'dashboard',
      selectedLayout: userData.settings.selectedLayout,
    }
  )

  // States
  const [tradingData, setTradingData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)

  // TODO: dummy data loading for ticker start
  // useLayoutEffect(() => {
  //   indicesList().then((d) => {
  //     sessionStorage.setItem('trading_data', JSON.stringify(d?.data))
  //     setTradingData(d.data)
  //   })
  // }, [])
  // TODO: dummy data loading for ticker ends

  // useEffect(() => {
  //   if (tradeListData.data.length === 0 && !tradeListData.isError && !tradeListData.isLoading) {
  //     window.location.reload()
  //   }
  //   if (tradeListData.isError) {
  //     setSocketAlert(true)
  //   } else {
  //     setSocketAlert(false)
  //   }
  // }, [tradeListData])

  // //loader
  // useEffect(() => {
  //   if (!tradeListData.isLoading) {
  //     setIsLoading(false)
  //   }
  // }, [tradeListData, userData])

  useEffect(() => {
    // if (!layouts.selected) {
    //   dispatch(
    //     updateLayoutState({
    //       breakPoint: layouts.layoutState.currentBreakpoint,
    //       pageName: 'dashboard',
    //       layout: initLayout?.[layouts.layoutState.currentBreakpoint]?.map((item) => {
    //         return {
    //           ...item,
    //           static: true,
    //         }
    //       }),
    //     })
    //   )
    // }
    // if(localStorage.getItem('marketData')) return
    // console.log('failed ')
    // localStorage.setItem('marketData', JSON.stringify(demoData))
  }, [])
  // const dashboardComponents = {
  //   // '1': MarketData,
  //   trading_GROUP: MarketData,
  //   '2': MarketData,
  //   buy_sell: BuySell,
  //   market_map: MarketMap,
  //   order_GROUP: OrderList,
  //   trading_bar: LineChart,
  //   trading_map: BarChart2,
  //   performance_INDIVIDUAL: MoversGainers,
  //   position_INDIVIDUAL: Position,
  //   execution_INDIVIDUAL: Execution,
  //   orderSummery_INDIVIDUAL: OrderSummery,
  //   blotter_INDIVIDUAL: Blotter,
  //   news_INDIVIDUAL: News,
  //   purchase_power_INDIVIDUAL: PurchasePower,

  //   // trading_map: TradeBarChart,
  // }

  const com = {
    marketData: MarketData,
    buySell: BuySell,
    moversGainers: MoversGainers,
    orderSummery: OrderSummery,
    blotter: Blotter,
    position: Position,
    execution: Execution,
    news: News,
    report: Report,
  }
  // const com = {marketData: MarketData, buySell: BuySell, blotter: Blotter}

  let dashboardComponents = {}
  layouts?.selected?.[layouts.layoutState.currentBreakpoint]?.forEach((itm) => {
    dashboardComponents = {
      ...dashboardComponents,
      [itm.i]: com[itm.component_type],
      // [itm.i]: itm.type,
    }
  })

  //  const tableSetting  = await userTableList()
  // const layoutComponents: LayoutComponentInterface[] = [
  //   {
  //     id: 'trading_list',
  //     title: null,
  //     tabs: [
  //       {
  //         id: 'trade',
  //         title: 'Trading List',
  //       },
  //       {
  //         id: 'watch',
  //         title: 'Watch List',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'trading_map',
  //     title: 'Trading Map',
  //     tabs: [],
  //   },
  //   {
  //     id: 'trading_bar',
  //     title: 'Bar Chart 2',
  //     tabs: [],
  //   },
  //   {
  //     id: 'market_map',
  //     title: 'Market Map',
  //     tabs: [],
  //   },
  //   {
  //     id: 'order_list',
  //     title: null,
  //     tabs: [
  //       {
  //         id: 'orderList',
  //         title: 'Order List',
  //       },
  //       {
  //         id: 'transHistory',
  //         title: 'Transaction History',
  //       },
  //       {
  //         id: 'portfolio',
  //         title: 'Portfolio',
  //       },
  //       {
  //         id: 'profit',
  //         title: 'Profit',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'buy_sell',
  //     title: 'Buy - Sell',
  //     tabs: [],
  //   },
  //   {
  //     id: 'movers_gainers',
  //     title: 'Movers - Gainers',
  //     tabs: [],
  //   },
  //   {
  //     id: 'position',
  //     title: 'Position',
  //     tabs: [],
  //   },
  //   {
  //     id: 'execution',
  //     title: 'Execution',
  //     tabs: [],
  //   },
  //   {
  //     id: 'orderSummery',
  //     title: 'Order Summery',
  //     tabs: [],
  //   },
  //   {
  //     id: 'blotter',
  //     title: 'Blotter',
  //     tabs: [],
  //   },
  // ]
  const generateDOM: ReactChildren = useCallback(() => {
    return map(
      layouts.selected?.[layouts.layoutState.currentBreakpoint],
      function (l: InitLayoutPartInterface, i) {
        const data = _.find(tables, function (t) {
          return t.view === l.i
        })

        const singleTableData = _.find(
          tableData,
          (td) => `${td.table_type}_${td.view_type}` === l.i
        )

        const DashboardComponent: React.ElementType = dashboardComponents?.[
          l.i
        ] as React.ElementType

        return (
          <div
            // data-grid={{x: l.x, y: l.y, w: l.w, h: l.h}}
            key={l.i}
            className={`static shadow-sm overflow-hidden tw-bg-white dark:tw-bg-dark-200`}
          >
            {l.i.endsWith('GROUP') ? (
              <Group
                dashboardComponents={dashboardComponents}
                data={data?.tables}
                layout={l}
                handleMinimizeSection={handleMinimize}
                tableData={singleTableData}
              />
            ) : l.i.endsWith('INDIVIDUAL') ? (
              <Individual>
                <DashboardComponent
                  data={data?.tables}
                  layout={l}
                  handleMinimizeSection={handleMinimize}
                  tableData={singleTableData}
                />
              </Individual>
            ) : (
              <DashboardComponent
                data={dashboardComponents?.[l.i]}
                layout={l}
                handleMinimizeSection={handleMinimize}
                tableData={singleTableData}
              />
            )}
          </div>
        )
      }
    )
  }, [
    layouts.selected,
    handleMinimize,
    layouts.layoutState.currentBreakpoint,
    tradingData,
    settings.dashboard,
  ])

  useEffect(() => {
    generateDOM()
  }, [generateDOM, layouts.selected])

  //TODO: Lock the desired buy sell table

  const keyboardEvents = (event) => {
    switch (event.keyCode) {
      case 112:
        event.preventDefault()
        if (buySell.actionName !== 'buySell') return
        // if(buySell.actionName !== 'buy') return
        dispatch(
          changeBuySellApi({
            price: Number(buySell?.modalData?.bid),
            qty: Number(buySell?.modalData?.bq),
          })
        )
        dispatch(changeIsBuy(false))
        dispatch(changeIsShow(true))
        // dispatch(changeBuySellApi({
        //   price: Number(!buySell?.isBuy ? buySell?.modalData?.ask : buySell?.modalData?.bid),
        // }))
        break

      case 113:
        event.preventDefault()
        if (buySell.actionName !== 'buySell') return
        // if(buySell.actionName !== 'sell') return
        dispatch(
          changeBuySellApi({
            price: Number(buySell?.modalData?.ask),
            qty: Number(buySell?.modalData?.aq),
          })
        )
        dispatch(changeIsBuy(true))
        dispatch(changeIsShow(true))
        break

      case 115:
        event.preventDefault()
        if (buySell.actionName !== 'confirmation') return
        dispatch(changeIsUpdateShow(true))
        break

      case 121:
        event.preventDefault()
        if (buySell.actionName !== 'confirmation') return
        dispatch(changeIsConfirmShow(true))
        break

      default:
        break
    }
  }

  return (
    <div className='border-card' onKeyDown={keyboardEvents}>
      <>
        {error?.trading?.message && (
          <MyAlert subject={error?.trading?.type} message={error?.trading?.message ?? ''} />
        )}
        <Dashboard
          generateDOM={generateDOM}
          layouts={layouts.selected}
          state={layouts.layoutState}
          onBreakpointChange={onBreakpointChange}
          onDrop={onDrop}
          onLayoutChange={onLayoutChange}
        />
      </>
    </div>
  )
}
