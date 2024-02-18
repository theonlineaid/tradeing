import CustomModal from '#common/components/CustomModal'
import {BlotterDataType} from '#common/types/blotter-data'
import {MarketDataType} from '#common/types/market-data'
import {BlotterDataContext} from '#context/blotterDataContext'
import {MarketDataContext} from '#context/marketDataContext'
import {NewsDataContext} from '#context/newsContext'
import useTableHook from '#hooks/use-table-hook'
import {RootState} from '#store/index'
import {NEWS_INSTRUMENT_TABLE_INIT_VALUE} from '#tws/constants/news-table-init-value'
import _ from 'lodash'
import React, {useContext, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import Select from 'react-select'
import NewsBody from '../Notice/NewsBody'

const NewsModal = (props) => {
  const {marketDatas} = useContext(MarketDataContext) as MarketDataType
  const {newsData} = useContext(NewsDataContext)
  const {global} = useSelector((state: RootState) => state)
  const targetHeight = 30

  const styles = {
    control: (base: any) => ({
      ...base,
      minHeight: 'initial',
      // minWidth: '150px',
      width: '250px',
      textAlign: 'left',
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: `${targetHeight - 1 - 1}px`,
      padding: '0 8px',
      borderRadius: '5px',
      color: global?.mode === 'dark' ? '#FFF !important;' : '',
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    input: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    menu: (base: any) => ({
      ...base,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    clearIndicator: (base: any) => ({
      ...base,
      fontSize: '10px',
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
  }

  let options: any = []
  options = marketDatas?.map((item) => {
    return {
      label: item?.short_name,
      value: item?.short_name,
    }
  })

  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: NEWS_INSTRUMENT_TABLE_INIT_VALUE,
  })

  const {blotterDatas} = useContext(BlotterDataContext) as BlotterDataType

  // states
  const [data, setData] = useState<[]>([])
  const [selectedTab, setSelectedTab] = useState<string>('trade')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [selectedInstrument, setSelectedInstrument] = useState<string | any>('')
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState(null)

  // actions
  // const onButtonExport = () => {}
  // const handleCloseSetting = () => setIsSettingOpen(false)
  // const handleOpenSetting = () => setIsSettingOpen(true)
  // const handleMinMax = () => {
  //   // setRefetchData((prevState) => !prevState)
  //   props?.handleMinimizeSection({
  //     name: props?.layout?.i,
  //     height: 3.75,
  //   })
  // }

  // const gridRef: any = useRef()

  const handleViewModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  /**
   *TODO: Filter Data by Farm ID.
   *
   * This function filters the newsData array based on the provided farmId. It extracts the farmId
   * from the props, then filters the newsData array to include only items that match the specified farmId.
   * The filtered data is then set in the component's state using the setData function.
   */
  const filterSingleData = () => {
    // Extract the farmId from the props
    const {farmId} = props

    // Filter the newsData array to include only items that match the specified farmId
    // const filteredData = newsData.filter((n) => n.firm_id === farmId)
    const filteredData = newsData.filter((n) => n.firmId === farmId)

    // Set the filtered data in the component's state using the setData function
    setData(filteredData)
  }

  /**
   *TODO: Filter Data by Instrument Name.
   *
   * This function is triggered when filtering data by instrument name. If a valid label (e.label) is provided,
   * filterSingleData function to handle the default filtering logic.
   *
   * @param {object} e - The event object containing information about the selected label.
   */
  const filterByInstrumentName = (e) => {
    // Check if a valid label is provided
    if (e?.label) {
      // Filter the newsData array to include only items with a firmId of 'TSX'
      const filteredDataByName = newsData.filter((n) => n.firmId === 'TSX')

      // Set the filtered data in the component's state using the setData function
      setData(filteredDataByName)
    } else {
      // If no valid label is provided, fall back to the default filtering logic
      filterSingleData()
    }
  }

  useEffect(() => {
    if (props.type === 'workingOrders') {
      const oldData = [...blotterDatas]
      const newData: any = _.filter(
        oldData,
        (item) => item.name === props?.instrumentName && item?.status === 'Working'
      )
      setData(newData)
    }
    if (props.type === 'terminatedOrders') {
      const oldData = [...blotterDatas]
      const newData: any = _.filter(
        oldData,
        (item) => item.name === props?.instrumentName && item?.status === 'Terminated'
      )
      setData(newData)
    }
  }, [])

  // useEffect(() => {
  //   filterData()
  // }, [])

  useEffect(() => {
    filterByInstrumentName(selectedOption)
  }, [selectedOption])

  return (
    <>
      <CustomModal
        style='modal-90w'
        handleClose={props?.handleClose}
        show={props?.show}
        title='News'
        bgColor='bg-light'
        size='lg'
        children={
          <>
            <Select
              className='basic-single mb-1'
              classNamePrefix='select'
              styles={styles}
              isClearable={true}
              isSearchable={true}
              name='Index'
              placeholder='instrument'
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
            />
            <NewsBody
              checkData={checkData}
              layout={props?.layout}
              setSelectedInstrument={setSelectedInstrument}
              selectedInstrument={selectedInstrument}
              show={isModalOpen}
              getCsvData={() => console.log('')}
              newsData={data}
              modalHandler={handleViewModal}
            />
          </>
        }
      />
    </>
  )
}

export default React.memo(NewsModal)
