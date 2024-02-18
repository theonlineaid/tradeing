import CustomModal from '#common/components/CustomModal'
import useTableHook from '#hooks/use-table-hook'
import {RootState} from '#store/index'
import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {BLOTTER_TABLE_INIT_VALUE} from '../../../constants'
import SectionHeader from '../../section-headers'
import BlotterBody from './BlotterBody'
import BlotterSettings from './BlotterSettings'

const Blotter = (props) => {
  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: BLOTTER_TABLE_INIT_VALUE,
  })
  // states
  const [searchFilter, setSearchFilter] = useState<string>()
  const [selectedTab, setSelectedTab] = useState<string>('trade')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedInstrument, setSelectedInstrument] = useState<string>('')
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
  const {linkedTable, settings} = useSelector((state: RootState) => state)

  const gridRef: any = useRef()

  const handleViewModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleSearchFilter = (e: any) => {
    setSearchFilter(e.target.value)
    gridRef.current.api.setQuickFilter(e.target.value)
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
        handleSearchFilter={handleSearchFilter}
        // isSearchAble
        isSingleSection
        csvData={data}
        // title={`Blotter ${selectedInstrument}`}
        title={props?.tableData?.name ?? 'Blotter'}
        tableData={props?.tableData}
        type={linkedTable?.instrumentName.split('-')[0]}
        modalBody={
          <BlotterSettings
            checkData={checkData}
            handleCheckData={handleCheckData}
            gridRef={gridRef}
            tableName={props?.layout?.i}
          />
        }
      />
      <BlotterBody
        gridRef={gridRef}
        checkData={checkData}
        layout={props?.layout}
        setSelectedInstrument={setSelectedInstrument}
        getCsvData={(s) => setData(s)}
        fontSize={fontSize}
      />
      {isModalOpen ? (
        <CustomModal
          style='modal-90w'
          handleClose={handleViewModal}
          show={isModalOpen}
          // title={`Blotter ${selectedInstrument}`}
          title={props?.tableData?.name ?? 'Blotter'}
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
                handleClick={handleOpenSetting}
                isSingleSection
                handleSearchFilter={handleSearchFilter}
                // isSearchAble
                csvData={data}
                isModal={true}
                // title={`Blotter ${selectedInstrument}`}
                title={props?.tableData?.name ?? 'Blotter'}
                tableData={props?.tableData}
                type={linkedTable?.instrumentName.split('-')[0]}
                modalBody={
                  <BlotterSettings
                    checkData={checkData}
                    handleCheckData={handleCheckData}
                    gridRef={gridRef}
                    tableName={props?.layout?.i}
                  />
                }
              />
              <BlotterBody
                gridRef={gridRef}
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
    </>
  )
}

export default React.memo(Blotter)
