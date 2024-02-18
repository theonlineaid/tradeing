import CustomModal from '#common/components/CustomModal'
import useTableHook from '#hooks/use-table-hook'
import {RootState} from '#store/index'
import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {ORDER_SUMMERY_TABLE_INIT_VALUE} from '../../../constants'
import SectionHeader from '../../section-headers'
import OrderSummeryBody from './OrderSummeryBody'
import OrderSummerySettings from './OrderSummerySettings'

const OrderSummery = (props) => {
  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: ORDER_SUMMERY_TABLE_INIT_VALUE,
  })

  // states
  const [selectedTab, setSelectedTab] = useState<string>('trade')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [selectedInstrument, setSelectedInstrument] = useState<string>('')
  const [data, setData] = useState<any>(null)
  const [fontSize, setFontSize] = useState<number>()

  const {linkedTable, settings} = useSelector((state: RootState) => state)

  const gridRef: any = useRef()
  // actions
  const onButtonExport = () => {}
  const handleCloseSetting = () => setIsSettingOpen(false)
  const handleOpenSetting = () => setIsSettingOpen(true)
  const handleMinMax = () => {
    console.log(props)
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
        title={props?.tableData?.name ?? 'Order Summery'}
        tableData={props?.tableData}
        modalBody={
          <OrderSummerySettings
            checkData={checkData}
            handleCheckData={handleCheckData}
            gridRef={gridRef}
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
          title={props?.tableData?.name ?? 'Order Summery'}
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
                handleClick={handleOpenSetting}
                isSingleSection
                csvData={data}
                isModal={true}
                title={props?.tableData?.name ?? 'Order Summery'}
                tableData={props?.tableData}
                type={linkedTable?.instrumentName.split('-')[0]}
                modalBody={
                  <OrderSummerySettings
                    checkData={checkData}
                    handleCheckData={handleCheckData}
                    gridRef={gridRef}
                    tableName={props?.layout?.i}
                  />
                }
              />
              <OrderSummeryBody
                checkData={checkData}
                layout={props?.layout}
                setSelectedInstrument={setSelectedInstrument}
                getCsvData={(s) => setData(s)}
                fontSize={fontSize}
              />
            </>
          }
        />
      ) : null}
      <OrderSummeryBody
        checkData={checkData}
        layout={props?.layout}
        setSelectedInstrument={setSelectedInstrument}
        getCsvData={(s) => setData(s)}
        fontSize={fontSize}
      />
    </>
  )
}

export default React.memo(OrderSummery)
