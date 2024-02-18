import {useCallback, useRef, useState} from 'react'
import useTableHook from '../../../../../../hooks/use-table-hook'
import {TRANSACTION_HISTORY_INIT_VALUE} from '../../../../constants'
import SectionHeader from '../../../section-headers'
import TransactionList from './TransactionList'
import TransHistorySettings from './Settings'

const Transaction = (props: any) => {
  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: TRANSACTION_HISTORY_INIT_VALUE,
  })

  // states
  const [selectedTab, setSelectedTab] = useState<string>('transHistory')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)

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
        layout={props?.layout}
        data={props?.data}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        openModal={isSettingOpen}
        closeModal={handleCloseSetting}
        handleClick={handleOpenSetting}
        handleMinMax={handleMinMax}
        modalBody={<TransHistorySettings checkData={checkData} handleCheckData={handleCheckData} />}
        title='Transaction'
        isSearchAble
        isSingleSection={false}
      />

      <TransactionList
        checkData={checkData}
        layout={props?.layout}
        handleMinimizeSection={props?.handleMinimizeSection}
      />

      <TransactionList
        checkData={checkData}
        layout={props?.layout}
        handleMinimizeSection={props?.handleMinimizeSection}
      />
    </>
  )
}

export default Transaction
