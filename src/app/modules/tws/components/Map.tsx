/* eslint-disable jsx-a11y/anchor-is-valid */
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { Bar, Line } from 'react-chartjs-2'
import Marquee from 'react-fast-marquee'
import type { RootState } from '../../../redux'
import React, { useContext, useEffect, useState } from 'react'
import { MarketDataContext } from '../../../context/marketDataContext'
import { MarketDataType } from '../../../common/types/market-data'
const dataChart_2 = {
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40'],
  datasets: [
    {
      label: 'Today',
      data: [6480, 5590, 7892, 4254, 6500],
      fill: false,
      backgroundColor: '#204a5a  ',
      borderColor: '#015764',
    },
    {
      label: 'PreviousDay',
      data: [4400, 1420, 3892, 1254, 1500],
      fill: false,
      backgroundColor: '#261F51',
      borderColor: '#2b0a77',
    },
  ],
  options: {
    legend: {
      display: '10:00',
    },
  },
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
}

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

const dataChart_4 = {
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40'],
  datasets: [
    {
      label: '',
      data: [648, 649, 789, 425, 650],
      fill: true,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
  options: {
    legend: {
      display: '10:00',
    },
  },
}

const dataChart_3 = {
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '10:60'],
  datasets: [
    {
      label: '',
      data: [397, 320, 789, 425, 650, 555, 380],
      fill: false,
      backgroundColor: 'rgba(59, 147, 165)',
      borderColor: 'rgba(59, 147, 165)',
    },
  ],
  options: {
    legend: {
      display: '10:00',
    },
  },
}

export function LineChart() {
  return <Line data={dataChart_4} height={230} />
}

export function BarChart() {
  return <Bar options={options} data={dataChart_3} height={180} />
}

export function BarChart2() {
  return (
    <div style={{ width: '100%' }}>
      <Bar options={options_2} data={dataChart_2} />
    </div>
  )
}

export default React.memo(BarChart2)

export function Marquess() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const s: any = sessionStorage.getItem('trading_data')
    let a = JSON.parse(s)
    if (s) {
      const session = JSON.parse(s)
      setData(session)
    }
  }, [])
  const { marketDatas } = useContext(MarketDataContext) as MarketDataType


  //  marque show and control speed
  const calculateSpeed = () => {
    const baseSpeed = 50;
    const speedMultiplier = 20;
    return Math.max(baseSpeed - marketDatas.length * speedMultiplier, 50);
  };
  const speed = calculateSpeed()  //FIXME: use this function to marque speed calculateSpeed() 
  return (
    <>
      {/* real ticker data */}
      {marketDatas.length > 0 && <Marquee className='marquee-overlay dark:tw-bg-dark-300' play={true} pauseOnHover={true} speed={speed} style={{ width: '100%' }} >
        {<table cellPadding={0} cellSpacing={0} width='100%'>
          <tbody>
            <tr>
              {marketDatas.map((slideData) => (
                <td valign='top' style={{ padding: '0 10px' }} key={slideData?.id}>
                  <table cellSpacing={0} cellPadding={0} >
                    <tbody className=''>
                      <tr>
                        <td rowSpan={2}>
                          {slideData.status == 'Up' ? <img className='company-ticker-icon tw-mx-2'
                            src='./media/icons/tkup.gif'
                            alt='img'
                          /> :
                          slideData.status == 'Down' ? <img className='company-ticker-icon tw-mx-2'
                            src='./media/icons/tkdown.gif'
                            alt='img'
                          />:
                          slideData.status == 'Unchange' && <img className='company-ticker-icon tw-mx-2'
                            src='./media/icons/tkupdown.gif'
                            alt='img'
                          />}
                        </td>
                        <td >
                          <a href='#' >
                            <h6 className='company-ticker-code my-0 dark:tw-text-slate-200'>
                              {slideData?.short_name}
                            </h6>
                          </a>
                        </td>
                        <td >
                          <a href='#' target='_top'>
                            <h6 className='company-ticker-code tw-my-0 dark:tw-text-slate-300 tw-ml-3'>
                              {slideData?.last}
                            </h6>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td >
                          <a href='#' target='_top'>
                            <h6 className='company-ticker-code text-shorter my-0 dark:tw-text-slate-200'>
                              {slideData?.settle_1}
                            </h6>
                          </a>
                        </td>
                        <td >
                          <a href='#' target='_top'>
                            <h6 className='company-ticker-code tw-my-0 dark:tw-text-slate-300 tw-ml-3'>
                              {slideData?.d}%
                            </h6>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              ))}
            </tr>
          </tbody>
        </table>}
      </Marquee>}
    </>
  )
}
