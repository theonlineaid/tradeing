import React, {useCallback, useRef, useState} from 'react'
import {Bar} from 'react-chartjs-2'
import SectionHeader from '../section-headers'

export const options_2 = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Horizontal Bar Chart',
    },
  },
}

const dataChart_2 = {
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40'],
  datasets: [
    {
      label: 'Today',
      data: [6480, 5590, 7892, 4254, 6500],
      fill: false,
      backgroundColor: '#adaff5',
      borderColor: '#adaff5',
    },
    {
      label: 'PreviousDay',
      data: [4400, 1420, 3892, 1254, 1500],
      fill: false,
      backgroundColor: '#D35400',
      borderColor: '#D35400',
    },
  ],
  options: {
    legend: {
      display: '10:00',
    },
  },
}

const TradeBarChart: React.FC = (props: any) => {
  // state
  const [isOpen, setIsOpen] = useState(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)

  // Action
  const gridRef: any = useRef()
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

  return (
    <>
    <h1>Trade chart</h1>
      {/* <SectionHeader
        layout={props?.layout}
        data={props?.data}
        openModal={isOpen}
        onBtnExport={onBtnExport}
        closeModal={handleCloseSetting}
        handleClick={handleOpenSetting}
        handleMinMax={handleMinMax}
        modalBody={<> Buysell</>}
      />
      <div style={{width: '100%'}}>
        <Bar options={options_2} data={dataChart_2} />
      </div> */}
    </>
  )
}
export default TradeBarChart
