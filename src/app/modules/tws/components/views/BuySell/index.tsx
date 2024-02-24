import CustomModal from '#common/components/CustomModal'
import {RootState} from '#store/index'
import {changeIsLock} from '#store/slices/buysell'
import SectionHeader from '#tws/components/section-headers'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import BuySellBody from './BuySellBody'
import BuySellSetting from './buySellSettings'
import _ from 'lodash'

const BuySell = (props: any) => {
  // state
  const [isOpen, setIsOpen] = useState(false)
  const [selectedInstrument, setSelectedInstrument] = useState<string>('')
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const {buySell, linkedTable} = useSelector((state: RootState) => state)
  console.log(linkedTable, '18')
  // Action
  const gridRef: any = useRef()

  const dispatch = useDispatch()


  const handleOpenSetting = () => {
    setIsOpen(true)
  }
  const handleCloseSetting = () => {
    setIsOpen(false)
  }
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv()
  }, [])

  const handleMinMax = () => {
    setRefetchData((prevState) => !prevState)
    props?.handleMinimizeSection({
      name: props?.layout?.i,
      height: 3.75,
    })
  }
  const handleLock = () => {
    if (!buySell?.modalData) return
    dispatch(changeIsLock(!buySell?.isLock))
  }

  const handleViewModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  // instruments details table switch
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    const storedValue = localStorage.getItem('instrument-details-table')

    if (storedValue === 'true') {
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [])

  const handleInstrumentHideShow = (nextChecked) => {
    setChecked(nextChecked)
    localStorage.setItem('instrument-details-table', nextChecked)
  }


  return (
    <>
      <SectionHeader
        layout={props?.layout}
        data={props?.data}
        // data={_.filter(props?.data, (itm) => itm.view_type === "MARKET")}
        openModal={isOpen}
        closeModal={handleCloseSetting}
        handleClick={handleOpenSetting}
        handleMinMax={handleMinMax}
        handleLock={handleLock}
        handleViewModal={handleViewModal}
        isSingleSection
        title={props?.tableData?.name ?? 'Buy - Sell'}
        tableData={props?.tableData}
        type={linkedTable?.instrumentName.split('-')[0]}
        modalBody={
          <BuySellSetting handleInstrumentHideShow={handleInstrumentHideShow} checked={checked} />
        }
      />
      <BuySellBody setSelectedInstrument={setSelectedInstrument} checked={checked} />
      {isModalOpen ? (
        <CustomModal
          handleClose={handleViewModal}
          show={isModalOpen}
          title={props?.tableData?.name ?? 'Buy - Sell'}
          bgColor='bg-light'
          size='lg'
        >
          <BuySellBody setSelectedInstrument={setSelectedInstrument} checked={checked} />
        </CustomModal>
      ) : null}
    </>
  )
}

export default BuySell
