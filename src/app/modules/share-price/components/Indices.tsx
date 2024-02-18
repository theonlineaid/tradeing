import {TypeChooser} from 'react-stockcharts/lib/helper'
import {useLayoutEffect, useState} from 'react'
import {Line, Bar} from 'react-chartjs-2'
import Marquee from 'react-fast-marquee'
import ChartTicker from '../ChartTicker'
import {getData} from '../utils'

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

const dataChart = {
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40'],
  datasets: [
    {
      label: '',
      data: [648, 649, 789, 425, 650],
      fill: false,
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
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40'],
  datasets: [
    {
      label: '',
      data: [648, 649, 789, 425, 650],
      fill: false,
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

const dataChart_2 = {
  labels: ['10:00', '10:10', '10:20', '10:30', '10:40'],
  datasets: [
    {
      label: '',
      data: [6480, 6490, 7892, 4254, 6500],
      fill: false,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: '',
      data: [648, 649, 3892, 1254, 1500],
      fill: false,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
  options: {
    legend: {
      display: '10:00',
    },
  },
}

export function Indices() {
  const [dataTickerList, setDataTickerList] = useState<any>([])

  useLayoutEffect(() => {
    getData().then((data) => {
      setDataTickerList(data)
    })
  }, [])

  return (
    <div className='row'>
      <Marquee speed={50} style={{width: '100%', background: '#fffff4'}}>
        <table cellPadding={0} cellSpacing={0} width='100%'>
          <tbody>
            <tr>
              <td valign='top' height={30}>
                <table width={135} cellSpacing={0} cellPadding={0}>
                  <tbody>
                    <tr>
                      <td height={30} width='100%'>
                        <a
                          href='displayCompany.php?name=ZEALBANGLA'
                          className='abhead'
                          target='_top'
                        >
                          ZEALBANGLA&nbsp;172.80&nbsp;
                          <img src='https://www.dsebd.org/assets/imgs/tkdown.gif' alt='' /> <br />
                          1.70&nbsp;&nbsp;&nbsp;&nbsp;0.99%{' '}
                        </a>
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td valign='top' height={30}>
                <table width={135} cellSpacing={0} cellPadding={0}>
                  <tbody>
                    <tr>
                      <td height={30} width='100%'>
                        <a
                          href='displayCompany.php?name=ZEALBANGLA'
                          className='abhead'
                          target='_top'
                        >
                          ZEALBANGLA&nbsp;172.80&nbsp;
                          <img src='https://www.dsebd.org/assets/imgs/tkup.gif' alt='' /> <br />
                          1.70&nbsp;&nbsp;&nbsp;&nbsp;0.99%{' '}
                        </a>
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td valign='top' height={30}>
                <table width={135} cellSpacing={0} cellPadding={0}>
                  <tbody>
                    <tr>
                      <td height={30} width='100%'>
                        <a
                          href='displayCompany.php?name=ZEALBANGLA'
                          className='abhead'
                          target='_top'
                        >
                          ZEALBANGLA&nbsp;172.80&nbsp;
                          <img src='https://www.dsebd.org/assets/imgs/tkup.gif' alt='' /> <br />
                          1.70&nbsp;&nbsp;&nbsp;&nbsp;0.99%{' '}
                        </a>
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td valign='top' height={30}>
                <table width={135} cellSpacing={0} cellPadding={0}>
                  <tbody>
                    <tr>
                      <td height={30} width='100%'>
                        <a
                          href='displayCompany.php?name=ZEALBANGLA'
                          className='abhead'
                          target='_top'
                        >
                          ZEALBANGLA&nbsp;172.80&nbsp;
                          <img src='https://www.dsebd.org/assets/imgs/tkdown.gif' alt='' /> <br />
                          1.70&nbsp;&nbsp;&nbsp;&nbsp;0.99%{' '}
                        </a>
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td valign='top' height={30}>
                <table width={135} cellSpacing={0} cellPadding={0}>
                  <tbody>
                    <tr>
                      <td height={30} width='100%'>
                        <a
                          href='displayCompany.php?name=ZEALBANGLA'
                          className='abhead'
                          target='_top'
                        >
                          ZEALBANGLA&nbsp;172.80&nbsp;
                          <img src='https://www.dsebd.org/assets/imgs/tkup.gif' alt='' /> <br />
                          1.70&nbsp;&nbsp;&nbsp;&nbsp;0.99%{' '}
                        </a>
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td valign='top' height={30}>
                <table width={135} cellSpacing={0} cellPadding={0}>
                  <tbody>
                    <tr>
                      <td height={30} width='100%'>
                        <a
                          href='displayCompany.php?name=ZEALBANGLA'
                          className='abhead'
                          target='_top'
                        >
                          ZEALBANGLA&nbsp;172.80&nbsp;
                          <img src='https://www.dsebd.org/assets/imgs/tkup.gif' alt='' /> <br />
                          1.70&nbsp;&nbsp;&nbsp;&nbsp;0.99%{' '}
                        </a>
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </Marquee>

      <p>Ticker Chart </p>

      {dataTickerList.length && (
        <TypeChooser>
          {(type) => <ChartTicker type='hybrid' data={dataTickerList} width={1200} ratio={1} />}
        </TypeChooser>
      )}

      <Line data={dataChart} />

      <Line data={dataChart_4} />

      <Bar options={options} data={dataChart_3} />

      <Bar options={options_2} data={dataChart_2} />

      <Bar options={options} data={dataChart_2} />
    </div>
  )
}
