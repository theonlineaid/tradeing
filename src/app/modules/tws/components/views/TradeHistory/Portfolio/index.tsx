import {useCallback, useRef, useState} from 'react'
import useTableHook from '../../../../../../hooks/use-table-hook'
import {PORTFOLIO_INIT_VALUE} from '../../../../constants'
import SectionHeader from '../../../section-headers'
import PortfolioList from './../Portfolio/Portfolio'

const Portfolio = (props: any) => {
  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: PORTFOLIO_INIT_VALUE,
  })

  // states
  const [selectedTab, setSelectedTab] = useState<string>('portfolio')
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
        isSingleSection={false}
        title='Portfolio'
        layout={props?.layout}
        data={props?.data}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        openModal={isSettingOpen}
        closeModal={handleCloseSetting}
        handleClick={handleOpenSetting}
        handleMinMax={handleMinMax}
        // modalBody={<TradeHistorySettings checkData={checkData} handleCheckData={handleCheckData}/>}
        modalBody={<></>}
      />

      <PortfolioList
        checkData={checkData}
        layout={props?.layout}
        handleMinimizeSection={props?.handleMinimizeSection}
      />
    </>
  )
}

export default Portfolio
