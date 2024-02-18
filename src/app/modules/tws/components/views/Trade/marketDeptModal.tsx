import MyTable from '#common/components/MyTable'
import { MarketDataStruct, MarketDataType } from '#common/types/market-data'
import { MarketDataContext } from '#context/marketDataContext'
import { RootState } from '#store/index'
import {
  changeBuySellApi,
  changeClientCode,
  changeIsBuy,
  changeIsShow,
  changeUserProfit,
} from '#store/slices/buysell'
import { ControlledMenu, MenuItem, useMenuState } from '@szhsin/react-menu'
import _, { filter, find, map } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import type { RowEventHandler } from 'react-bootstrap-table-next'
import { AiOutlineLineChart } from 'react-icons/ai'
import { FaRegWindowClose } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { singleUserInfo, userAccProfit } from '../../../../auth/core/_requests'

interface Props {
  isHidden?: boolean
  name?: any
}

interface Props {
  isHidden?: boolean
  marketData?: any[]
}

const MarketDeptModal: React.FC<React.PropsWithChildren<Props>> = ({
  isHidden = false,
  name = '',
}) => {
  const dispatch = useDispatch()
  const { buySell, linkedTable } = useSelector((state: RootState) => state)

  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
  const [sellData, setSellData] = useState<[]>([])

  const { marketDatas } = useContext(MarketDataContext) as MarketDataType

  let totalQty: any = 0

  const cumulativeCalculation = (data, k) => {
    if (data[k]?.executed_qty === data[k]?.executed_qty) totalQty = totalQty + data[k]?.executed_qty
    return totalQty
  }

  const handleFilter = (orderType, name) => {
    const data: any = _.sortBy(
      map(
        filter(
          find((marketDatas as MarketDataStruct[]) ?? [], (i) => i.short_name === name)
            ?.executed_orders,
          (item) => item.side == orderType && item.executed_qty !== 0
        )
      ),
      'price'
    )
    const res: any = map(data, (item, k) => ({
      ...item,
      qty: item?.executed_qty,
      price: (item?.price).toPrecision(3),
      order_numbers: item?.order_numbers?.length,
      cumQ: cumulativeCalculation(data, k),
    }))
    totalQty = 0
    return res
  }

  const handleSellTable = (orderType) => {
    return handleFilter(orderType, name)
    // const marketMatched = (linkedTable?.marketData === linkedTable?.marketDept && linkedTable.marketDept !== '')
    // const blotterMatched = (linkedTable?.blotter === linkedTable?.marketDept && linkedTable.marketDept !== '')
    // const moverGainerMatched = (linkedTable?.moversGainers === linkedTable?.marketDept && linkedTable.marketDept !== '')
    // if(moverGainerMatched && type === 'mg') return handleFilter(orderType, name)
    // if(marketMatched && type === 'mk') return handleFilter(orderType, name)
    // if(blotterMatched && type === 'bt') return handleFilter(orderType, name)
    // if(buySell.modalData?.short_name && buySell.actionName === 'main' || buySell.actionName === 'buySell') return handleFilter(orderType, buySell.modalData?.short_name)
    // if(linkedTable.marketDept === '') {setSelectedInstrument(''); return[]}
    // if(!marketMatched && !blotterMatched && !moverGainerMatched) return []
    return []
  }
  useEffect(() => {
    // handleSellTable()
    // dispatch(changeBuySellApi({
    //   price: Number(buySell?.isBuy ? params?.data?.ask : params?.data?.bid),
    // }))
  }, [])

  const tradeBuyColumns = [
    {
      id: 'c0',
      accessor: 'order_numbers',
      Header: 'Orders #',
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
      Header: 'Orders #',
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

  const clickOnRow = (row: { [key: string]: number }, type: 'buy' | 'sell') => {
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
      setAnchorPoint({ x: (e as any).clientX, y: (e as any).clientY })
      toggleMenu(true)
    },
    onClick: (e, row) => { },
    onDoubleClick: (e, row) => { },
  }
  const tradeSellRowEvents: Partial<{
    onClick: RowEventHandler<any>
    onDoubleClick: RowEventHandler<any>
    onContextMenu: RowEventHandler<any>
  }> = {
    onContextMenu: (e, row) => {
      e.preventDefault()
      clickOnRow(row?.original, 'sell')
      setAnchorPoint({ x: (e as any).clientX, y: (e as any).clientY })
      toggleMenu(true)
    },
    onClick: (e, row) => {
      // console.log({e, row})
    },
    onDoubleClick: (e, row) => { },
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
      // dispatch(changeIsShow(true))
      clickOnRow(row?.original, 'buy')
    }
    tradeSellRowEvents.onDoubleClick = (e, row) => {
      // dispatch(changeIsShow(true))
      clickOnRow(row?.original, 'sell')
    }
  }

  const [availableBalance, setAvailableBalance] = useState<number | null>(null)

  const fetchData = async () => {
    const bo_number = buySell?.clientCode.split('-')[1]

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
    dispatch(changeClientCode(e.target.value))
    let data = e.target.value.split('-')
    const list: any = await userAccProfit(data[3])

    dispatch(changeUserProfit(list.data?.data))

    dispatch(
      changeBuySellApi({
        order_type: '',
        qty: 0,
        price: 0,
        bo_id: ''
      })
    )
  }

  // Effects
  useEffect(() => {
    fetchData()
  }, [buySell.modalData, buySell.boAccountData, buySell.clientCode])

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
      <div className='row m-0 tw-h-full'>
        <div className={isHidden ? 'col-12 tw-h-full custom-scroll' : 'col-lg-6'}>
          <div className='row tw-h-full'>
            <div className='col-6 tw-h-full pb-[5px]'>
              <div
                className={`${isHidden ? 'tw-h-[320px]' : 'tw-h-[170px]'
                  } tw-bg-green-100 dark:tw-bg-dark-green h-100 tw-overflow-scroll`}
              >
                <MyTable
                  data={handleSellTable('B')}
                  columns={tradeBuyColumns}
                  rowClasses='even:tw-bg-green-300 dark:even:tw-bg-darker-green dark:odd:tw-bg-dark-green'
                  handleRowClick={tradeBuyRowEvents}
                />
              </div>
            </div>

            <div className='col-6 tw-h-full pb-[5px]'>
              <div
                className={`${isHidden ? 'tw-h-[320px]' : 'tw-h-[170px]'
                  } tw-bg-red-100 dark:tw-bg-dark-red h-100 tw-overflow-scroll`}
              >
                <MyTable
                  data={handleSellTable('S')}
                  columns={tradeSellColumns}
                  rowClasses='even:tw-bg-red-300 dark:even:tw-bg-darker-red dark:odd:tw-bg-dark-red'
                  handleRowClick={tradeSellRowEvents}
                />
              </div>
            </div>
          </div>
          <ControlledMenu
            {...menuProps}
            anchorPoint={anchorPoint}
            direction='right'
            onClose={() => toggleMenu(false)}
            menuStyle={{ minWidth: '200px', fontSize: '1.1rem' }}
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

export default MarketDeptModal
