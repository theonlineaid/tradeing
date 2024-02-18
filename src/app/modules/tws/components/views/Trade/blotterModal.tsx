import CustomModal from '#common/components/CustomModal'
import {BlotterDataType} from '#common/types/blotter-data'
import {BlotterDataContext} from '#context/blotterDataContext'
import useTableHook from '#hooks/use-table-hook'
import _ from 'lodash'
import React, {useContext, useEffect, useRef, useState} from 'react'
import {BLOTTER_TABLE_INIT_VALUE} from '../../../constants'
import BlotterBody from '../Blotter/BlotterBody'

const Blotter = (props) => {
  // hooks
  const {checkData, handleCheckData} = useTableHook({
    initData: BLOTTER_TABLE_INIT_VALUE,
  })

  const {blotterDatas} = useContext(BlotterDataContext) as BlotterDataType

  // states
  const [data, setData] = useState<[]>([])
  const [selectedTab, setSelectedTab] = useState<string>('trade')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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

  const gridRef: any = useRef()

  const handleViewModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <>
      <CustomModal
        style='modal-90w'
        handleClose={props?.handleClose}
        show={props?.show}
        title='Blotter'
        bgColor='bg-light'
        size='xl'
        children={
          <>
            <BlotterBody
              view='working'
              modalData={data}
              gridRef={gridRef}
              checkData={checkData}
              layout={props?.layout}
              setSelectedInstrument={() => console.log('')}
              getCsvData={() => console.log('')}
            />
          </>
        }
      />
    </>
  )
}

export default React.memo(Blotter)
