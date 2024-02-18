import CustomModal from '#common/components/CustomModal'
import {NewsDataContext} from '#context/newsContext'
import useTableHook from '#hooks/use-table-hook'
import {RootState} from '#store/index'
import {NEWS_TABLE_INIT_VALUE} from '#tws/constants/news-table-init-value'
import React, {useContext, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import SectionHeader from '../../section-headers'
import NewsBody from './NewsBody'
import NewsSettings from './NewsSettings'
import SingleNews from './SingleNews'

const News = (props) => {
  const {newsData, filterData} = useContext(NewsDataContext)

  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: NEWS_TABLE_INIT_VALUE,
  })

  // states
  const [selectedTab, setSelectedTab] = useState<string>('trade')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [selectedInstrument, setSelectedInstrument] = useState<string | any>('')
  const [data, setData] = useState<any>(null)
  const [fontSize, setFontSize] = useState<number>()

  const {linkedTable, settings} = useSelector((state: RootState) => state)

  // actions
  const onButtonExport = () => {}
  const handleCloseSetting = () => setIsSettingOpen(false)
  const handleOpenSetting = () => setIsSettingOpen(true)
  const handleMinMax = () => {
    // setRefetchData((prevState) => !prevState)
    props?.handleMinimizeSection({
      name: props?.layout?.i,
      height: 3.75,
    })
  }

  const handleViewModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  // set font size
  useEffect(() => {
    const fontSize = settings.tableSettings.find((t) => t.tableName === props?.layout?.i)?.fontSize

    setFontSize(fontSize)
  }, [settings])

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
        handleViewModal={handleViewModal}
        isSingleSection
        csvData={data}
        tableData={props?.tableData}
        title={props?.tableData?.name ?? 'News'}
        modalBody={
          <NewsSettings
            checkData={checkData}
            handleCheckData={handleCheckData}
            tableName={props?.layout?.i}
          />
        }
      />
      {isModalOpen ? (
        <CustomModal
          style='modal-md'
          handleClose={handleViewModal}
          show={isModalOpen}
          fullscreen={false}
          title={props?.tableData?.name ?? 'News'}
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <SingleNews selectedInstrument={selectedInstrument} />

              {/* <SectionHeader
                layout={props?.layout}
                data={props?.data}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                openModal={isSettingOpen}
                closeModal={handleCloseSetting}
                handleClick={handleOpenSetting}
                handleMinMax={handleMinMax}
                handleViewModal={handleViewModal}
                isSingleSection
                csvData={data}
                isModal={true}
                title={props?.tableData?.name ?? 'News'}
                modalBody={<NewsSettings checkData={checkData} handleCheckData={handleCheckData} />}
              />
              <NewsBody
                checkData={checkData}
                layout={props?.layout}
                setSelectedInstrument={setSelectedInstrument}
                getCsvData={(s) => setData(s)}
              /> */}
            </>
          }
        />
      ) : null}
      <NewsBody
        checkData={checkData}
        layout={props?.layout}
        setSelectedInstrument={setSelectedInstrument}
        getCsvData={(s) => setData(s)}
        newsData={newsData}
        modalHandler={handleViewModal}
        fontSize={fontSize}
      />
    </>
  )
}

export default React.memo(News)
