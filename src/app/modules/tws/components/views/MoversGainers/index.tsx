import CustomModal from '#common/components/CustomModal'
import useTableHook from '#hooks/use-table-hook'
import {RootState} from '#store/index'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {MOVERS_GAINERS_TABLE_INIT_VALUE} from '../../../constants'
import SectionHeader from '../../section-headers'
import MoversGainersBody from './MoversGainersBody'
import MoversGainersSettings from './MoversGainersSettings'

const MoversGainers = (props) => {
  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: MOVERS_GAINERS_TABLE_INIT_VALUE,
  })

  // redux selector
  const {settings} = useSelector((state: RootState) => state)

  // states
  const [selectedTab, setSelectedTab] = useState<string>('trade')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const [fontSize, setFontSize] = useState<number>()

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
        isSingleSection
        handleViewModal={handleViewModal}
        csvData={data}
        title={props?.tableData?.name ?? 'Movers - Gainers'}
        tableData={props?.tableData}
        modalBody={
          <MoversGainersSettings
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
          title={props?.tableData?.name ?? 'Movers - Gainers'}
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <SectionHeader
                layout={props?.layout}
                data={props?.data}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                openModal={isSettingOpen}
                closeModal={handleCloseSetting}
                isSingleSection
                isModal={true}
                csvData={data}
                title={props?.tableData?.name ?? 'Movers - Gainers'}
                tableData={props?.tableData}
                modalBody={
                  <MoversGainersSettings
                    checkData={checkData}
                    handleCheckData={handleCheckData}
                    tableName={props?.layout?.i}
                  />
                }
              />
              <MoversGainersBody
                checkData={checkData}
                layout={props?.layout}
                getCsvData={(s) => setData(s)}
                fontSize={fontSize}
              />
            </>
          }
        />
      ) : null}
      <MoversGainersBody
        checkData={checkData}
        layout={props?.layout}
        getCsvData={(s) => setData(s)}
        fontSize={fontSize}
      />
    </>
  )
}

export default React.memo(MoversGainers)
