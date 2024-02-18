import CustomModal from '#common/components/CustomModal'
import useTableHook from '#hooks/use-table-hook'
import {RootState} from '#store/index'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {PURCHASE_POWER_TABLE_INIT_VALUE} from '../../../constants'
import SectionHeader from '../../section-headers'
import ExecutionBody from './PurchasePowerBody'
import ExecutionSettings from './PurchasePowerSettings'

const Execution = (props) => {
  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: PURCHASE_POWER_TABLE_INIT_VALUE,
  })

  // states
  const [selectedTab, setSelectedTab] = useState<string>('trade')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<number>()

  const {settings} = useSelector((state: RootState) => state)

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
        title='Purchase Power'
        modalBody={
          <ExecutionSettings
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
          title='Purchase Power'
          bgColor='bg-light'
          size='xl'
          children={
            <ExecutionBody checkData={checkData} layout={props?.layout} fontSize={fontSize} />
          }
        />
      ) : null}
      <ExecutionBody checkData={checkData} layout={props?.layout} fontSize={fontSize} />
    </>
  )
}

export default React.memo(Execution)
