import {RootState} from '#store/index'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import useTableHook from '../../../../../hooks/use-table-hook'
import {
  ORDER_LIST_INIT_VALUE,
  PORTFOLIO_INIT_VALUE,
  PROFIT_LIST_INIT_VALUE,
  TRANSACTION_HISTORY_INIT_VALUE,
} from '../../../constants'
import SectionHeader from '../../section-headers'
import OrderList from './Order/OrderList'
import TradeHistorySettings from './Order/Settings'
import Portfolio from './Portfolio/Portfolio'
import Profit from './Profit/Profit'
import TransactionHistory from './Transaction/TransactionList'

const TradeHistory = (props: any) => {
  const globalSetting = useSelector((state: RootState) => state.global)
  // states
  const [selectedTab, setSelectedTab] = useState<string>('orderList')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)

  const INIT_VALUES = useMemo(() => {
    return {
      orderList: () => ORDER_LIST_INIT_VALUE(globalSetting.mode),
      transHistory: TRANSACTION_HISTORY_INIT_VALUE,
      portfolio: PORTFOLIO_INIT_VALUE,
      profit: PROFIT_LIST_INIT_VALUE,
    }
  }, [globalSetting.mode])

  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: INIT_VALUES[selectedTab],
  })

  // Refs
  const gridRef: any = useRef()

  // actions
  const onButtonExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv()
  }, [])
  const handleCloseSetting = () => setIsSettingOpen(false)
  const handleOpenSetting = () => setIsSettingOpen(true)
  const handleMinMax = () => {
    setRefetchData((prevState) => !prevState)
    props?.handleMinimizeSection({
      name: props?.layout?.i,
      height: 3.75,
    })
  }

  return (
    <>
      <SectionHeader
        isSingleSection={false}
        title='Trade History'
        layout={props?.layout}
        data={props?.data}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        openModal={isSettingOpen}
        closeModal={handleCloseSetting}
        handleClick={handleOpenSetting}
        handleMinMax={handleMinMax}
        modalBody={<TradeHistorySettings checkData={checkData} handleCheckData={handleCheckData} />}
      />
      {selectedTab === 'orderList' && (
        <OrderList
          checkData={checkData}
          layout={props?.layout}
          handleMinimizeSection={props?.handleMinimizeSection}
        />
      )}
      {selectedTab === 'transHistory' && (
        <TransactionHistory
          checkData={checkData}
          layout={props?.layout}
          handleMinimizeSection={props?.handleMinimizeSection}
        />
      )}
      {selectedTab === 'portfolio' && (
        <Portfolio
          checkData={checkData}
          layout={props?.layout}
          handleMinimizeSection={props?.handleMinimizeSection}
        />
      )}
      {selectedTab === 'profit' && (
        <Profit
          checkData={checkData}
          layout={props?.layout}
          handleMinimizeSection={props?.handleMinimizeSection}
        />
      )}
    </>
  )
}

export default React.memo(TradeHistory)
