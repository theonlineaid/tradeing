import MyTable from '#common/components/MyTable'
import {MarketDataStruct, MarketDataType} from '#common/types/market-data'
import {RootState} from '#store/index'
import {changeBuySell} from '#store/slices/headerData'
import {ControlledMenu, MenuItem, useMenuState} from '@szhsin/react-menu'
import _, {filter, find, map} from 'lodash'
import React, {useContext, useEffect, useState} from 'react'
import {Col, Row} from 'react-bootstrap'
import type {RowEventHandler} from 'react-bootstrap-table-next'
import {AiOutlineLineChart} from 'react-icons/ai'
import {FaRegWindowClose} from 'react-icons/fa'
import {useDispatch, useSelector} from 'react-redux'
import Switch from 'react-switch'
import {MarketDataContext} from '../../../../context/marketDataContext'
import {
  changeBuySellApi,
  changeClientCode,
  changeIsBuy,
  changeIsShow,
  changeUserProfit,
} from '../../../../redux/slices/buysell'
import {singleUserInfo, userAccProfit} from '../../../auth/core/_requests'

interface Props {
  isHidden?: boolean
  setSelectedInstrument?: any
  checked?: boolean
}

interface Props {
  isHidden?: boolean
  marketData?: any[]
  checked?: boolean
}

const BuySellModalBody: React.FC<React.PropsWithChildren<Props>> = ({
  isHidden = false,
  checked,
  setSelectedInstrument = () => console.log(''),
}) => {
  const dispatch = useDispatch()
  const {buySell, linkedTable, headerData, userData} = useSelector((state: RootState) => state)
  const {modalData} = buySell
  const [matchedModalData, setMatchedModalData] = useState({
    open: 0,
    high: 0,
    low: 0,
    last: 0,
    d: 0,
    chg: 0,
    status: '',
    dh: 0,
    val: 0,
    dl: 0,
    volume: 0,
    vwap: 0,
  })
  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [buyData, setBuyData] = useState<any>(null)
  const [sellData, setSellData] = useState<[]>([])

  const {marketDatas} = useContext(MarketDataContext) as MarketDataType
  const makeOption = (label: string, value: string) => {
    return {label, value}
  }
  const handleFilter = (orderType: string, name: string) => {
    if (name === undefined) {
      dispatch(changeBuySell(null))
      setSelectedInstrument('')
      setBuyData([])
      setSellData([])
    }
    // set selected instrument to show instrument detail table
    setMatchedModalData(modalData as any)

    setSelectedInstrument('(' + name + ')')

    // market dept buy sell calculations
    const data: any = _.sortBy(
      map(
        filter(
          find((marketDatas as MarketDataStruct[]) ?? [], (i) => i.short_name === name)?.orders,
          (item) => item.side == orderType
        )
      ),
      'price'
    )
    const separatedData = data.reduce((acc, item) => {
      if (item.side === "B" && item.status !== "Filled") {
        acc.B.push(item);
      } else if (item.side === "S" && item.status !== "Filled") {
        acc.S.push(item);
      }
      return acc;
    }, { B: [], S: [] });


    // Sort the arrays based on the specified conditions
    const sortedDataB = separatedData.B.sort((a: any, b: any) => b.price - a.price); // Descending order for side "B"
    const sortedDataS = separatedData.S.sort((a: any, b: any) => a.price - b.price); // Ascending order for side "S"

    // Calculate order_numbers, quantity, and cumQ properties for side "B"
    const resultB = sortedDataB.reduce((acc: any, item: any) => {
      const roundedPrice = Number(item.price.toFixed(2));
      const prevItem = acc[acc.length - 1];
      if (prevItem && prevItem.price === roundedPrice) {
        prevItem.order_numbers++
        prevItem.qty += item?.qty
        prevItem.cumQ += item?.qty
      } else {
        const newItem = {
          ...item,
          price: roundedPrice,
          order_numbers: 1,
          qty: item?.qty - item?.executed_qty, // TODO: calculate
          cumQ: (prevItem ? prevItem?.cumQ : 0) + item.qty - item.executed_qty,
        }
        acc.push(newItem)
      }
      return acc;
    }, []);

    // Calculate order_numbers, quantity, and cumQ properties for side "S"
    const resultS = sortedDataS.reduce((acc, item) => {
      const roundedPrice = Number(item.price.toFixed(2));
      const prevItem = acc[acc.length - 1];

      if (prevItem && prevItem.price === roundedPrice) {
        prevItem.order_numbers++
        prevItem.qty += item.qty
        prevItem.cumQ += item.qty
      } else {
        const newItem = {
          ...item,
          price: roundedPrice,
          order_numbers: 1,
          qty: item.qty - item?.executed_qty, // TODO: calculate,
          cumQ: (prevItem ? prevItem.cumQ : 0) + item.qty - item.executed_qty
        };
        acc.push(newItem);
      }


      return acc;
    }, []);

    if (orderType === 'B') setBuyData(resultB)
    if (orderType === 'S') setSellData(resultS)

    dispatch(changeBuySell(makeOption(name, name)))
  }

  const handleSellTable = (orderType) => {
    const type = linkedTable?.instrumentName?.split('-')[0]
    const name = linkedTable?.instrumentName?.split('-')[1]
    const marketMatched =
      linkedTable?.marketData === linkedTable?.marketDept && linkedTable.marketDept !== ''
    const blotterMatched =
      linkedTable?.blotter === linkedTable?.marketDept && linkedTable.marketDept !== ''
    const positionSumMatched =
      linkedTable?.position === linkedTable?.marketDept && linkedTable.marketDept !== ''
    const orderSumMatched =
      linkedTable?.orderSummary === linkedTable?.marketDept && linkedTable.marketDept !== ''
    // const executionMatched = (linkedTable?.execution === linkedTable?.marketDept && linkedTable.marketDept !== '')
    const moverGainerMatched =
      linkedTable?.moversGainers === linkedTable?.marketDept && linkedTable.marketDept !== ''

    if (moverGainerMatched && type === 'mg') return handleFilter(orderType, name)
    else if (marketMatched && type === 'mk') return handleFilter(orderType, name)
    else if (blotterMatched && type === 'bt') return handleFilter(orderType, name)
    else if (orderSumMatched && type === 'os') return handleFilter(orderType, name)
    else if (positionSumMatched && type === 'ps') return handleFilter(orderType, name)
    // else if (executionMatched && type === 'exe') return;
    else if (headerData?.buySell && type === 'md') return handleFilter(orderType, name)
    else if (!headerData?.buySell) {
      setBuyData([])
      setSellData([])
    }
    // else {
    // if(linkedTable?.execution && (!headerData?.execution || type === 'exe')) return
    // if(!linkedTable?.execution && (!headerData?.execution || type === 'exe')) return
    //   dispatch(changeBuySell(null));
    //   setSelectedInstrument('')
    //   setBuyData([]);
    // }
  }

  const tradeBuyColumns = [
    {
      id: 'c0',
      accessor: 'order_numbers',
      Header: 'Orders # by lolo' ,
      headerClasses: 'table-header-style',
    },
    {
      id: 'cq',
      accessor: 'cumQ',
      Header: 'CumQ',
      headerClasses: 'table-header-style',
    },
    {
      id: 'c1',
      accessor: 'qty',
      Header: 'Quantity',
      sort: true,
      headerClasses: 'table-header-style',
    },
    {
      id: 'c2',
      accessor: 'price',
      Header: 'Bid',
      sort: true,
      headerClasses: 'table-header-style',
      formatter: (id, row, key) => {
        if (row) {
          return <>{row.bid_price}</>
        }
      },
    },
  ]
  const tradeSellColumns = [
    {
      id: 'c0',
      accessor: 'order_numbers',
      Header: 'Orders # lolo',
      headerClasses: 'table-header-style',
    },
    {
      id: 'cq',
      accessor: 'cumQ',
      Header: 'CumQ',
      headerClasses: 'table-header-style',
    },
    {
      id: '1',
      accessor: 'price',
      Header: 'Ask',
      sort: true,
      headerClasses: 'table-header-style',
      formatter: (id, row, key) => {
        if (row) {
          return <>{row.ask_price}</>
        }
      },
    },
    {
      id: '2',
      accessor: 'qty',
      Header: 'Quantity',
      sort: true,
      headerClasses: 'table-header-style',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          dispatch(
            changeBuySellApi({
              // ...row,
              qty: Number(row.remain_qty),
              price: row.ask_price,
            })
          )
          dispatch(changeIsBuy(true))
        },
      },
    },
  ]
  const tradeBuyMinColumns = [
    {
      id: 'c1',
      accessor: 'qty',
      Header: 'Quantity',
      sort: true,
      headerClasses: 'table-header-style',
    },
    {
      id: 'c2',
      accessor: 'price',
      Header: 'Bid',
      sort: true,
      headerClasses: 'table-header-style',
      formatter: (id, row, key) => {
        if (row) {
          return <>{row.bid_price}</>
        }
      },
    },
  ]
  const tradeSellMinColumns = [
    {
      id: '1',
      accessor: 'price',
      Header: 'Ask',
      sort: true,
      headerClasses: 'table-header-style',
      formatter: (id, row, key) => {
        if (row) {
          return <>{row.ask_price}</>
        }
      },
    },
    {
      id: '2',
      accessor: 'qty',
      Header: 'Quantity',
      sort: true,
      headerClasses: 'table-header-style',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          dispatch(
            changeBuySellApi({
              // ...row,
              qty: Number(row.remain_qty),
              price: row.ask_price,
            })
          )
          dispatch(changeIsBuy(true))
        },
      },
    },
  ]
  useEffect(() => {
    // console.log(handleSellTable('S'))
    // dispatch(changeData({'sell': handleSellTable('S')}))
    // dispatch(changeData({'buy': handleSellTable('B')}))
    // handleSellTable()
    // dispatch(changeBuySellApi({
    //   price: Number(buySell?.isBuy ? params?.data?.ask : params?.data?.bid),
    // }))
  }, [])

  const clickOnRow = (row: {[key: string]: number}, type: 'buy' | 'sell') => {
    // console.log({row})
    dispatch(
      changeBuySellApi({
        // ...row,
        price: Number(row.price),
        qty: row.qty,
      })
    )
    dispatch(changeIsBuy(type === 'buy' ? false : true))
  }

  const tradeBuyRowEvents: Partial<{
    onClick: RowEventHandler<any>
    onDoubleClick: RowEventHandler<any>
    onContextMenu: RowEventHandler<any>
  }> = {
    onContextMenu: (e, row) => {
      e.preventDefault()
      clickOnRow(row?.original, 'buy')
      setAnchorPoint({x: (e as any).clientX, y: (e as any).clientY})
      toggleMenu(true)
    },
    onClick: (e, row) => {},
    onDoubleClick: (e, row) => {},
  }

  const tradeSellRowEvents: Partial<{
    onClick: RowEventHandler<any>
    onDoubleClick: RowEventHandler<any>
    onContextMenu: RowEventHandler<any>
  }> = {
    onContextMenu: (e, row) => {
      e.preventDefault()
      clickOnRow(row?.original, 'sell')
      setAnchorPoint({x: (e as any).clientX, y: (e as any).clientY})
      toggleMenu(true)
    },
    onClick: (e, row) => {
      // console.log({e, row})
    },
    onDoubleClick: (e, row) => {},
  }

  if (!isHidden) {
    tradeBuyRowEvents.onClick = (_, row) => {
      clickOnRow(row?.original, 'buy')
    }
    tradeSellRowEvents.onClick = (_, row) => {
      clickOnRow(row?.original, 'sell')
    }
  } else {
    tradeBuyRowEvents.onDoubleClick = (e, row) => {
      dispatch(changeIsShow(true))
      clickOnRow(row?.original, 'buy')
    }
    tradeSellRowEvents.onDoubleClick = (e, row) => {
      dispatch(changeIsShow(true))
      clickOnRow(row?.original, 'sell')
    }
  }

  const [availableBalance, setAvailableBalance] = useState<number | null>(null)

  const fetchData = async () => {
    const bo_number = buySell?.clientCode?.split('-')[1]

    if (!bo_number || !buySell.modalData?.short_name) return

    try {
      let single_user_portfolio_info = await singleUserInfo(
        Number(bo_number),
        buySell.modalData?.short_name
      )
      setAvailableBalance(single_user_portfolio_info?.data?.data?.bo_balance ?? 0)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClientCodeChange = async (e) => {
    let data = e.target.value?.split('_')
    dispatch(changeClientCode(data[0]))
    // const list: any = await userAccProfit(data[3])
    // dispatch(changeUserProfit(list.data?.data))
    dispatch(
      changeBuySellApi({
        bo_id: data[1],
      })
    )
  }

  const fetchBuySellData = () => {
    let sell = handleSellTable('S')
    let buy = handleSellTable('B')
    let newData = Object.assign({}, {sell: sell}, {buy: buy})
    // dispatch(changeData(newData))
  }

  // Effects
  useEffect(() => {
    fetchBuySellData()
    fetchData()
  }, [
    buySell.modalData,
    buySell.boAccountData,
    buySell.clientCode,
    buySell.isMin,
    buySell?.type,
    linkedTable?.instrumentName,
    linkedTable?.marketDept,
    marketDatas
  ])

  const handleChange = () => {
    dispatch(
      changeBuySellApi({
        price: Number(!buySell?.isBuy ? buySell?.modalData?.ask : buySell?.modalData?.bid),
      })
    )
    dispatch(changeIsBuy(buySell.isBuy ? false : true))
  }

  return (
    <div className='trade-window tw-h-full'>
      {!isHidden && (
        <div className={`row trade-window-gap tw-border-b-slate-100 dark:tw-border-b-dark-border tw-h-full ${buySell.isBuy ? 'trade-buy-bg dark:tw-bg-dark-green' : 'trade-sell-bg dark:tw-bg-dark-red '}`}>
          <div className='col-lg-2 col-4 mb-2 mb-lg-0'>
            <span className='tw-flex tw-items-center pt-2 ps-2'>
              <h6 className='m-0 pe-4 dark:tw-text-slate-200'>{buySell.isBuy ? 'Buy' : 'Sell'}</h6>
              <Switch
                onChange={handleChange}
                checked={buySell.isBuy}
                height={25}
                width={48}
                uncheckedIcon={false}
                checkedIcon={false}
                offColor='#992525'
                onColor='#47be7d'
                boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
                className='react-switch'
              />
            </span>
          </div>
          <div className='col-lg-4 col-8 mb-2 mb-lg-0'>
            <div className='tw-flex tw-items-center'>
              <p className='mb-0 me-3 dark:tw-text-slate-200'>Current Balance</p>
              <p className={`bg-success-medium  dark:tw-text-slate-100 mb-0 ${buySell.isBuy ? 'tw-bg-green-200 dark:tw-bg-darker-green' : 'tw-bg-red-200  dark:tw-bg-darker-red'}`}>
                {buySell.userProfit?.user_balance?.current_balance} <span>BDT</span>
              </p>
            </div>
          </div>
          <div className='col-lg-3 col-6'>
            <div className='tw-flex tw-items-center'>
              <p className='mb-0 me-3 dark:tw-text-slate-200'>Available Qty</p>
              <p className={`bg-success-medium  dark:tw-text-slate-100 mb-0 ${buySell.isBuy ? 'tw-bg-green-200 dark:tw-bg-darker-green' : 'tw-bg-red-200  dark:tw-bg-darker-red'}`}>
                {availableBalance ? Math.floor(availableBalance) : 'N/A'}
              </p>
            </div>
          </div>
          <div className='col-lg-3 col-6'>
            <div className='tw-flex tw-items-center tw-data[k]ustify-end'>
              <p className='mb-0 me-3 dark:tw-text-slate-200'>Gain / Loss</p>
              <p className={`bg-success-medium  dark:tw-text-slate-100 mb-0 ${buySell.isBuy ? 'tw-bg-green-200 dark:tw-bg-darker-green' : 'tw-bg-red-200  dark:tw-bg-darker-red'}`}>
                {!isNaN(buySell.userProfit?.total_profit) &&
                !isNaN(buySell.userProfit?.total_loss) ? (
                  <span>
                    <span className='text-success-dark'>{buySell.userProfit.total_profit}</span>
                    <span> / </span>
                    <span className='text-danger'>{buySell.userProfit.total_loss}</span>
                  </span>
                ) : (
                  'N/A'
                )}
              </p>
            </div>
          </div>
        </div>
      )}
      {isHidden && checked && (
        <Row className='tw-m-2'>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>Open:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>
              {matchedModalData?.open?.toFixed(2)}
            </span>
          </Col>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>High:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.high}</span>
          </Col>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>Low:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.low}</span>
          </Col>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>LTP:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.last}</span>
          </Col>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>Chg:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.chg}</span>
          </Col>
          <Col xs={2} className=''>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>Status:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>
              {matchedModalData?.status}
            </span>
          </Col>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>DH:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.dh}</span>
          </Col>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>DL:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.dl}</span>
          </Col>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>Chg%:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.d}%</span>
          </Col>
          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>Val:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.val}</span>
          </Col>

          <Col xs={2} className='tw-pr-12'>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>Vol:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>
              {matchedModalData?.volume}
            </span>
          </Col>
          <Col xs={2} className=''>
            <span className='dark:tw-text-slate-200 tw-float-left tw-text-gray-600'>VWAP:</span>
            <span className='dark:tw-text-slate-200 tw-float-right'>{matchedModalData?.vwap}</span>
          </Col>
        </Row>
      )}
      {!isHidden && (
        <div className='row m-0 pt-2 tw-border-b dark:tw-border-b-dark-border'>
          <div className='col-lg-2 col-6 mt-1'>
            <input
              name='tw-name'
              className='form-control form-control-solid dark:tw-bg-dark-100 dark:tw-border-dark-border dark:tw-text-slate-300'
              placeholder='Trade Name'
              readOnly
              value={buySell.modalData?.short_name}
            />
          </div>
          <div className='col-lg-3 col-6 mt-1'>
            <select
              className='form-select form-select-solid dark:tw-bg-dark-100 dark:tw-border-dark-border dark:tw-text-slate-300'
              name='client_code'
              // value={buySell.clientCode.split('_')[0]}
              onChange={handleClientCodeChange}
              // disabled={userData.profile?.users_status === 'investor' ? true : false}
            >
              <option value=''>-- Select Any Client--</option>

              {buySell.boAccountData && buySell.boAccountData.length ? (
                buySell.boAccountData.map((d, k) => (
                  <option
                    value={
                      `${d.investor_code}_${d.bo_id}`
                      // d.bo_account.bo_id +
                      // '-' +
                      // d.bo_account.bo_no +
                      // '-' +
                      // d.bo_account.dp +
                      // '-' +
                      // d.client_code
                    }
                    key={k}
                  >
                    {d.investor_code}
                  </option>
                ))
              ) : userData.profile?.users_status === 'investor' ? (
                <option value={buySell.investorCode}>{buySell.investorCode}</option>
              ) : (
                <option value=''>Loading</option>
              )}
            </select>
          </div>
          <div className='col-lg-2 col-3 mt-3 mt-lg-0'>
            <div className='trade-modal-field ms-3'>
              <p className='text-primary dark:tw-text-slate-300 tw-font-bolder mb-0'>{modalData?.last?modalData?.last:0}</p>
              <h6 className='text-danger m-0'>
                <span className='tw-font-bolder'>{modalData?.chg? modalData?.chg : 0}</span>
                <span className='fw-normal ms-5'>{modalData?.d? modalData?.d:0}</span>
              </h6>
            </div>
          </div>
          <div className='col-lg-3 col-5 mt-3 mt-lg-0'>
            <div className='trade-modal-field trade-buy-sell'>
              <p className='mb-1 dark:tw-text-slate-300'>Buy / Sell Pending</p>
              <h6>
                <span className='dark:tw-text-green-600 dark:tw-font-bold'>{modalData?.buy_pending? modalData?.buy_pending:0}</span>
                <span className='fw-lighter dark:tw-text-slate-500'> / </span>
                <span className='dark:tw-text-red-600 dark:tw-font-bold'>{modalData?.sell_pending?modalData?.sell_pending:0}</span>
              </h6>
            </div>
          </div>
          <div className='col-lg-2 col-4 mt-3 mt-lg-0'>
            <div className='trade-modal-field'>
              <p className='mb-1 dark:tw-text-slate-300'>Min / Max</p>
              <h6 className='dark:tw-text-slate-300'>{matchedModalData?.dl ? matchedModalData?.dl : 0} / {matchedModalData?.dh ? matchedModalData?.dh : 0}</h6>
            </div>
          </div>
        </div>
      )}
      {/* {isHidden && (
        <div className='col-12  pb-[5px] mt-1'>
          <p className="tw-bg-green-100 dark:tw-bg-slate-600 tw-text-slate-600 dark:tw-text-white" >Aggregate by Limit |</p>
          <div className={` tw-bg-green-100 dark:tw-bg-dark-green tw-overflow-scroll`}>
          </div>
        </div>
      )} */}
      <div className='row m-0 tw-h-full'>
        {!isHidden && (
          <div className='col-lg-6'>
            <div className='trade-list-gen pt-2'>
              {/* <button className='btn btn-outline-primary mb-1'>General</button> */}

              <div
                className={
                  buySell.isBuy
                    ? 'trade-buy-bg dark:tw-bg-dark-green px-3 py-4'
                    : 'trade-sell-bg dark:tw-bg-dark-red px-3 py-4'
                }
              >
                <div className='row mb-7'>
                  <div className='col-lg-4'>
                    <label className='form-label mb-1 dark:tw-text-slate-300'>Order Type</label>
                    <select
                      className='form-select form-control dark:tw-bg-dark-100 dark:tw-border-dark-border dark:tw-text-slate-300'
                      aria-label='Select example'
                      name='statement_cycle'
                      required
                    >
                      <option value=''>Limit</option>
                      <option value=''>Market</option>
                      <option value=''>Market Ad Based</option>
                    </select>
                  </div>
                  <div className='col-lg-4'>
                    <label className='form-label mb-1 dark:tw-text-slate-300'>Quantity</label>
                    <input
                      autoFocus
                      type='number'
                      name='qty'
                      placeholder='Quantity'
                      className='form-control dark:tw-bg-dark-100 dark:tw-border-dark-border dark:tw-text-slate-300'
                      // value={buySell.buySellApi?.qty ? buySell.buySellApi?.qty : ''}
                      value={buySell.buySellApi?.qty !== 0 ? buySell.buySellApi?.qty : ''}
                      onChange={(e) => {
                        dispatch(changeBuySellApi({qty: parseInt(e.target.value)}))
                      }}
                    />
                    <p id='remain_qty' style={{color: 'red'}}></p>
                  </div>
                  <div className='col-lg-4'>
                    <label className='form-label mb-1 dark:tw-text-slate-300'>Price</label>
                    <input
                      type='number'
                      name='price'
                      className='form-control dark:tw-bg-dark-100 dark:tw-border-dark-border dark:tw-text-slate-300'
                      placeholder='Price'
                      // value={buySell.buySellApi?.price ? buySell.buySellApi?.price : ''}
                      value={buySell.buySellApi?.price !== 0 ? buySell.buySellApi?.price : ''}
                      onChange={(e) =>
                        dispatch(changeBuySellApi({price: parseFloat(e.target.value)}))
                      }
                    />
                    <p id='bid_price' style={{color: 'red'}}></p>
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-lg-4'>
                    <label className='form-label mb-1 dark:tw-text-slate-300'>Good Till</label>
                    <select
                      className='form-select form-control dark:tw-bg-dark-100 dark:tw-border-dark-border dark:tw-text-slate-300'
                      aria-label='Select example'
                      name='statement_cycle'
                      required
                    >
                      <option value=''>Day</option>
                      <option value=''>Month</option>
                      <option value=''>Year</option>
                    </select>
                  </div>
                  <div className='col-lg-4'>
                    <label className='form-label mb-1 dark:tw-text-slate-300'>Disclosed QTY</label>
                    <input
                      type='number'
                      name='disclosedQty'
                      className='form-control dark:tw-bg-dark-100 dark:tw-border-dark-border dark:tw-text-slate-300'
                    />
                  </div>
                  <div className='col-lg-4'>
                    <label className='form-label mb-1 dark:tw-text-slate-300'>Type</label>
                    <select
                      className='form-select form-control dark:tw-bg-dark-100 dark:tw-border-dark-border dark:tw-text-slate-300'
                      aria-label='Select example'
                      name='type'
                      required
                    >
                      {/* <option value=''>Select One</option> */}
                      <option value='placed'>Placed</option>
                      <option value='park'>Park</option>
                      {/* <option value='unpark'>Unpark</option> */}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={isHidden ? 'col-12 tw-h-full custom-scroll' : 'col-lg-6'}>
          {buySell?.type === 'mirrorMarketDept' ? (
            <div className='row tw-h-full'>
              <div className='col-6 tw-h-full pb-[5px]'>
                <div
                  className={`${
                    isHidden ? 'tw-h-[320px]' : 'tw-h-[170px]'
                  } tw-bg-red-100 dark:tw-bg-dark-red h-100 tw-overflow-scroll`}
                >
                  <MyTable
                    data={sellData ? sellData : []}
                    rowNumber={buySell.rowNumber}
                    columns={buySell.isMin ? tradeSellMinColumns : tradeSellColumns}
                    rowClasses='even:tw-bg-red-300 dark:even:tw-bg-darker-red dark:odd:tw-bg-dark-red'
                    handleRowClick={tradeSellRowEvents}
                  />
                </div>
              </div>
              <div className='col-6 tw-h-full pb-[5px]'>
                <div
                  className={`${
                    isHidden ? 'tw-h-[320px]' : 'tw-h-[170px]'
                  } tw-bg-green-100 dark:tw-bg-dark-green h-100 tw-overflow-scroll`}
                >
                  <MyTable
                    data={buyData ? buyData : []}
                    rowNumber={buySell.rowNumber}
                    columns={buySell.isMin ? tradeBuyMinColumns : tradeBuyColumns}
                    rowClasses='even:tw-bg-green-300 dark:even:tw-bg-darker-green dark:odd:tw-bg-dark-green'
                    handleRowClick={tradeBuyRowEvents}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className='row tw-h-full'>
              <div className='col-6 tw-h-full pb-[5px]'>
                <div
                  className={`${
                    isHidden ? 'tw-h-[320px]' : 'tw-h-[170px]'
                  } tw-bg-green-100 dark:tw-bg-dark-green h-100 tw-overflow-scroll`}
                >
                  <MyTable
                    data={buyData ? buyData : []}
                    rowNumber={buySell.rowNumber}
                    columns={buySell.isMin ? tradeBuyMinColumns : tradeBuyColumns}
                    rowClasses='even:tw-bg-green-300 dark:even:tw-bg-darker-green dark:odd:tw-bg-dark-green'
                    handleRowClick={tradeBuyRowEvents}
                  />
                </div>
              </div>

              <div className='col-6 tw-h-full pb-[5px]'>
                <div
                  className={`${
                    isHidden ? 'tw-h-[320px]' : 'tw-h-[170px]'
                  } tw-bg-red-100 dark:tw-bg-dark-red h-100 tw-overflow-scroll`}
                >
                  <MyTable
                    data={sellData ? sellData : []}
                    rowNumber={buySell.rowNumber}
                    columns={buySell.isMin ? tradeSellMinColumns : tradeSellColumns}
                    rowClasses='even:tw-bg-red-300 dark:even:tw-bg-darker-red dark:odd:tw-bg-dark-red'
                    handleRowClick={tradeSellRowEvents}
                  />
                </div>
              </div>
            </div>
          )}
          <ControlledMenu
            {...menuProps}
            anchorPoint={anchorPoint}
            direction='right'
            onClose={() => toggleMenu(false)}
            menuStyle={{minWidth: '200px', fontSize: '1.1rem'}}
          >
            <div className='tw-text-center px-3'>
              <h3 className='fs-18'>{(buySell.modalData as any)?.scrip}</h3>
              <small>{(buySell.modalData as any)?.full_name}</small>
            </div>
            <hr />
            <MenuItem onClick={() => dispatch(changeIsShow(true))}>
              <AiOutlineLineChart className='fs-16 tw-font-bold me-3' />
              Trade
            </MenuItem>
            <MenuItem className='text-danger' onClick={() => toggleMenu(false)}>
              <FaRegWindowClose className='fs-16 tw-font-bold me-3' />
              Close
            </MenuItem>
          </ControlledMenu>
        </div>
      </div>
    </div>
  )
}

export default BuySellModalBody
