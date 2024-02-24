import CustomModal from '#common/components/CustomModal'
import useInitTables from '#hooks/use-init-tables'
import _ from 'lodash'
import {useEffect, useMemo, useRef, useState} from 'react'
import SectionHeader from '../section-headers'
import TradeSettings from './Trade/TradeSettings01'

const Group = (props: any) => {
  // states
  const [selectedTab, setSelectedTab] = useState<string>()
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [isWatchList, setIsWatchList] = useState<boolean>(false)
  const [searchFilter, setSearchFilter] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const {fields, handleCheckData} = useInitTables({
    tableId: selectedTab,
  })

  // actions
  const handleCloseSetting = () => setIsSettingOpen(false)
  const handleOpenSetting = () => setIsSettingOpen(true)
  const handleMinMax = () => {
    props?.handleMinimizeSection({
      name: props?.layout?.i,
      height: 3.75,
    })
  }

  const handleSearchFilter = (e: any) => {
    setSearchFilter(e.target.value)
    gridRef.current.api.setQuickFilter(e.target.value)
  }

  const gridRef: any = useRef()

  const TabComponent = useMemo(() => {

    return props.dashboardComponents?.[props.layout.i]
  }, [props, selectedTab])


  interface TableDataInterface {
    checkData: any[]
    isWatchList: boolean
  }

  const tabComponentProps = useMemo(() => {
    return {
      checkData: fields,
      isWatchList: isWatchList,
      searchFilter: searchFilter,
      gridRef: gridRef,
      layout: props.layout,
    }
  }, [fields, selectedTab])

  useEffect(() => {
    if (!props?.data) return
    const sortByTableUserOrder = _.sortBy(props?.data, (item) => item.table_user_order)
    setSelectedTab(sortByTableUserOrder[0]?.id)
  }, [props?.data])

  const handleViewModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  console.log('84', props.data)

  return (
    <>
      <SectionHeader
        layout={props?.layout}
        data={_.filter(props?.data, (itm) => itm.view_type === 'GROUP')}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setIsWatchList={setIsWatchList}
        openModal={isSettingOpen}
        closeModal={handleCloseSetting}
        handleClick={handleOpenSetting}
        handleMinMax={handleMinMax}
        handleViewModal={handleViewModal}
        handleSearchFilter={handleSearchFilter}
        isSearchAble
        title='Trading'
        tableData={props?.tableData}
        isSingleSection={false}
        modalBody={
          <TradeSettings
            checkData={fields}
            handleCheckData={handleCheckData}
            tableName={props?.layout?.i}
          />
        }
      />
      {isModalOpen ? (
        <CustomModal
          style='modal-xl'
          handleClose={handleViewModal}
          show={isModalOpen}
          fullscreen={false}
          title='Trading'
          bgColor='bg-light'
          size='xl'
          children={
            TabComponent ? (
              <>
                <SectionHeader
                  layout={props?.layout}
                  data={_.filter(props?.data, (itm) => itm.view_type === 'GROUP')}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  setIsWatchList={setIsWatchList}
                  openModal={isSettingOpen}
                  handleClick={handleOpenSetting}
                  handleSearchFilter={handleSearchFilter}
                  isSearchAble
                  title='Trading'
                  tableData={props?.tableData}
                  isModal={isModalOpen}
                  isSingleSection={false}
                  modalBody={
                    <TradeSettings
                      checkData={fields}
                      handleCheckData={handleCheckData}
                      tableName={props?.layout?.i}
                    />
                  }
                />
                <TabComponent {...tabComponentProps} />
              </>
            ) : null
          }
        />
      ) : null}

      {TabComponent ? <TabComponent {...tabComponentProps} /> : null}
    </>
  )
}

export default Group
