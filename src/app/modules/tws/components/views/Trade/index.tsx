import {useContext, useEffect, useState} from 'react'
// import TradingList from './TradingList'
import {MarketDataType} from '#common/types/market-data'
import {MarketDataContext} from '#context/marketDataContext'
import {RootState} from '#store/index'
import {useSelector} from 'react-redux'
import MARKET_DATA_TABLE_INIT_VALUE from '../../../constants/market-data-table-init-value'
import MarketData from './MarketData'

const Trade = (props: any) => {
  // const {fields, handleCheckData} = useInitTables({tableId: 70})

  const MarketDataField = MARKET_DATA_TABLE_INIT_VALUE

  // redux selector
  const {settings} = useSelector((state: RootState) => state)

  // const gridRef: any = useRef()
  const {flash} = useContext(MarketDataContext) as MarketDataType

  // states
  const [selectedTab, setSelectedTab] = useState<string>('trade')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<number>()

  // const [searchFilter, setSearchFilter] = useState<string>()
  // actions
  const handleCloseSetting = () => setIsSettingOpen(false)
  const handleOpenSetting = () => setIsSettingOpen(true)
  const handleMinMax = () => {
    props?.handleMinimizeSection({
      name: props?.layout?.i,
      height: 3.75,
    })
  }

  // const handleSearchFilter = (e: any) => {
  //   setSearchFilter(e.target.value)
  //   props.gridRef.current.api.setQuickFilter(e.target.value)
  // }

  // set font size
  useEffect(() => {
    const fontSize = settings.tableSettings.find((t) => t.tableName === props.layout.i)?.fontSize

    setFontSize(fontSize)
  }, [settings])

  return (
    <>
      {/* <SectionHeader
        layout={props?.layout}
        data={props?.data}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        openModal={isSettingOpen}
        closeModal={handleCloseSetting}
        handleClick={handleOpenSetting}
        handleMinMax={handleMinMax}
        handleSearchFilter={handleSearchFilter}
        isSearchAble
        title='Trading'
        isSingleSection={false}
        // modalBody={<TradeSettings checkData={MarketDataField} handleCheckData={handleCheckData} />}
      /> */}

      {selectedTab === 'trade' && (
        <MarketData
          checkData={MarketDataField('dark', fontSize)}
          searchFilter={props?.searchFilter}
          isWatchList={props?.isWatchList}
          gridRef={props.gridRef}
          flashSettings={flash}
          fontSize={fontSize}
          tableName={props?.layout?.i}
        />
      )}
      {selectedTab === 'watch' && (
        <MarketData
          checkData={MarketDataField('dark')}
          isWatchList={props?.isWatchList}
          flashSettings={flash}
          fontSize={fontSize}
        />
      )}
    </>
  )
}

export default Trade
