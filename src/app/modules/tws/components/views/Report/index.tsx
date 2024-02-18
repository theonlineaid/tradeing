import CustomModal from '#common/components/CustomModal'
import SectionHeader from '#tws/components/section-headers'
import {useState} from 'react'
import ReportSettings from './ReportSettings'

const Report = (props) => {
  // states
  const [selectedTab, setSelectedTab] = useState<string>('')
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [selectedInstrument, setSelectedInstrument] = useState<string | any>('')
  const [data, setData] = useState<any>(null)
  const [fontSize, setFontSize] = useState<number>()

  // actions
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
        title={props?.tableData?.name ?? 'Report'}
        tableData={props?.tableData}
        modalBody={<ReportSettings />}
      />
      {isModalOpen ? (
        <CustomModal
          style='modal-md'
          handleClose={handleViewModal}
          show={isModalOpen}
          fullscreen={false}
          title={props?.tableData?.name ?? 'Report'}
          bgColor='bg-light'
          size='xl'
          children={
            <>
              <p>Report modal</p>
            </>
          }
        />
      ) : null}

      <div className='tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center'>
        <p>Report: No data found</p>
      </div>
    </>
  )
}

export default Report
