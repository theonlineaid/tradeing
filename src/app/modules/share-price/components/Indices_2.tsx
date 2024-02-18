import {indicesList, eventCalendarList} from '../../auth/core/_requests'
import {TypeChooser} from 'react-stockcharts/lib/helper'
import {ResponsiveTreeMapHtml} from '@nivo/treemap'
import {useLayoutEffect, useState} from 'react'
import Marquee from 'react-fast-marquee'
import Chart from '../Chart'

const data1 = {
  name: 'nivo',
  color: 'hsl(317, 70%, 50%)',
  children: [
    {
      name: 'viz',
      color: 'hsl(310, 70%, 50%)',
      children: [
        {
          name: 'stack',
          color: 'hsl(115, 70%, 50%)',
          children: [
            {
              name: 'chart',
              color: 'hsl(154, 70%, 50%)',
              loc: 191136,
            },
            {
              name: 'xAxis',
              color: 'hsl(43, 70%, 50%)',
              loc: 65575,
            },
            {
              name: 'yAxis',
              color: 'hsl(124, 70%, 50%)',
              loc: 52845,
            },
            {
              name: 'layers',
              color: 'hsl(182, 70%, 50%)',
              loc: 127674,
            },
          ],
        },
        {
          name: 'pie',
          color: 'hsl(99, 70%, 50%)',
          children: [
            {
              name: 'chart',
              color: 'hsl(206, 70%, 50%)',
              children: [
                {
                  name: 'pie',
                  color: 'hsl(23, 70%, 50%)',
                  children: [
                    {
                      name: 'outline',
                      color: 'hsl(118, 70%, 50%)',
                      loc: 37165,
                    },
                    {
                      name: 'slices',
                      color: 'hsl(77, 70%, 50%)',
                      loc: 195754,
                    },
                    {
                      name: 'bbox',
                      color: 'hsl(346, 70%, 50%)',
                      loc: 110908,
                    },
                  ],
                },
                {
                  name: 'donut',
                  color: 'hsl(66, 70%, 50%)',
                  loc: 26946,
                },
                {
                  name: 'gauge',
                  color: 'hsl(35, 70%, 50%)',
                  loc: 7201,
                },
              ],
            },
            {
              name: 'legends',
              color: 'hsl(229, 70%, 50%)',
              loc: 129,
            },
          ],
        },
      ],
    },
    {
      name: 'colors',
      color: 'hsl(347, 70%, 50%)',
      children: [
        {
          name: 'rgb',
          color: 'hsl(159, 70%, 50%)',
          loc: 57267,
        },
        {
          name: 'hsl',
          color: 'hsl(15, 70%, 50%)',
          loc: 73503,
        },
      ],
    },
    {
      name: 'utils',
      color: 'hsl(244, 70%, 50%)',
      children: [
        {
          name: 'randomize',
          color: 'hsl(310, 70%, 50%)',
          loc: 21268,
        },
        {
          name: 'resetClock',
          color: 'hsl(254, 70%, 50%)',
          loc: 22363,
        },
        {
          name: 'noop',
          color: 'hsl(177, 70%, 50%)',
          loc: 10811,
        },
        {
          name: 'tick',
          color: 'hsl(166, 70%, 50%)',
          loc: 28495,
        },
        {
          name: 'forceGC',
          color: 'hsl(298, 70%, 50%)',
          loc: 161388,
        },
        {
          name: 'stackTrace',
          color: 'hsl(153, 70%, 50%)',
          loc: 161981,
        },
        {
          name: 'dbg',
          color: 'hsl(277, 70%, 50%)',
          loc: 282,
        },
      ],
    },
    {
      name: 'generators',
      color: 'hsl(213, 70%, 50%)',
      children: [
        {
          name: 'address',
          color: 'hsl(169, 70%, 50%)',
          loc: 172353,
        },
        {
          name: 'city',
          color: 'hsl(25, 70%, 50%)',
          loc: 68540,
        },
        {
          name: 'animal',
          color: 'hsl(279, 70%, 50%)',
          loc: 174831,
        },
        {
          name: 'movie',
          color: 'hsl(218, 70%, 50%)',
          loc: 96744,
        },
        {
          name: 'user',
          color: 'hsl(130, 70%, 50%)',
          loc: 158751,
        },
      ],
    },
    {
      name: 'set',
      color: 'hsl(2, 70%, 50%)',
      children: [
        {
          name: 'clone',
          color: 'hsl(137, 70%, 50%)',
          loc: 95651,
        },
        {
          name: 'intersect',
          color: 'hsl(106, 70%, 50%)',
          loc: 45600,
        },
        {
          name: 'merge',
          color: 'hsl(212, 70%, 50%)',
          loc: 10123,
        },
        {
          name: 'reverse',
          color: 'hsl(310, 70%, 50%)',
          loc: 26393,
        },
        {
          name: 'toArray',
          color: 'hsl(355, 70%, 50%)',
          loc: 190808,
        },
        {
          name: 'toObject',
          color: 'hsl(76, 70%, 50%)',
          loc: 158397,
        },
        {
          name: 'fromCSV',
          color: 'hsl(18, 70%, 50%)',
          loc: 99237,
        },
        {
          name: 'slice',
          color: 'hsl(262, 70%, 50%)',
          loc: 60206,
        },
        {
          name: 'append',
          color: 'hsl(152, 70%, 50%)',
          loc: 179327,
        },
        {
          name: 'prepend',
          color: 'hsl(11, 70%, 50%)',
          loc: 102047,
        },
        {
          name: 'shuffle',
          color: 'hsl(95, 70%, 50%)',
          loc: 167805,
        },
        {
          name: 'pick',
          color: 'hsl(103, 70%, 50%)',
          loc: 172906,
        },
        {
          name: 'plouc',
          color: 'hsl(191, 70%, 50%)',
          loc: 32229,
        },
      ],
    },
    {
      name: 'text',
      color: 'hsl(280, 70%, 50%)',
      children: [
        {
          name: 'trim',
          color: 'hsl(56, 70%, 50%)',
          loc: 76521,
        },
        {
          name: 'slugify',
          color: 'hsl(252, 70%, 50%)',
          loc: 187659,
        },
        {
          name: 'snakeCase',
          color: 'hsl(199, 70%, 50%)',
          loc: 42604,
        },
        {
          name: 'camelCase',
          color: 'hsl(44, 70%, 50%)',
          loc: 47842,
        },
        {
          name: 'repeat',
          color: 'hsl(275, 70%, 50%)',
          loc: 193098,
        },
        {
          name: 'padLeft',
          color: 'hsl(11, 70%, 50%)',
          loc: 181801,
        },
        {
          name: 'padRight',
          color: 'hsl(258, 70%, 50%)',
          loc: 130014,
        },
        {
          name: 'sanitize',
          color: 'hsl(2, 70%, 50%)',
          loc: 125896,
        },
        {
          name: 'ploucify',
          color: 'hsl(10, 70%, 50%)',
          loc: 24858,
        },
      ],
    },
    {
      name: 'misc',
      color: 'hsl(10, 70%, 50%)',
      children: [
        {
          name: 'whatever',
          color: 'hsl(313, 70%, 50%)',
          children: [
            {
              name: 'hey',
              color: 'hsl(342, 70%, 50%)',
              loc: 85178,
            },
            {
              name: 'WTF',
              color: 'hsl(281, 70%, 50%)',
              loc: 72611,
            },
            {
              name: 'lol',
              color: 'hsl(159, 70%, 50%)',
              loc: 89975,
            },
            {
              name: 'IMHO',
              color: 'hsl(121, 70%, 50%)',
              loc: 38469,
            },
          ],
        },
        {
          name: 'other',
          color: 'hsl(33, 70%, 50%)',
          loc: 134333,
        },
        {
          name: 'crap',
          color: 'hsl(47, 70%, 50%)',
          children: [
            {
              name: 'crapA',
              color: 'hsl(41, 70%, 50%)',
              loc: 183314,
            },
            {
              name: 'crapB',
              color: 'hsl(152, 70%, 50%)',
              children: [
                {
                  name: 'crapB1',
                  color: 'hsl(338, 70%, 50%)',
                  loc: 51230,
                },
                {
                  name: 'crapB2',
                  color: 'hsl(314, 70%, 50%)',
                  loc: 157646,
                },
                {
                  name: 'crapB3',
                  color: 'hsl(180, 70%, 50%)',
                  loc: 109993,
                },
                {
                  name: 'crapB4',
                  color: 'hsl(105, 70%, 50%)',
                  loc: 180337,
                },
              ],
            },
            {
              name: 'crapC',
              color: 'hsl(62, 70%, 50%)',
              children: [
                {
                  name: 'crapC1',
                  color: 'hsl(224, 70%, 50%)',
                  loc: 159254,
                },
                {
                  name: 'crapC2',
                  color: 'hsl(328, 70%, 50%)',
                  loc: 37484,
                },
                {
                  name: 'crapC3',
                  color: 'hsl(106, 70%, 50%)',
                  loc: 93319,
                },
                {
                  name: 'crapC4',
                  color: 'hsl(291, 70%, 50%)',
                  loc: 154694,
                },
                {
                  name: 'crapC5',
                  color: 'hsl(29, 70%, 50%)',
                  loc: 136956,
                },
                {
                  name: 'crapC6',
                  color: 'hsl(90, 70%, 50%)',
                  loc: 69410,
                },
                {
                  name: 'crapC7',
                  color: 'hsl(206, 70%, 50%)',
                  loc: 194907,
                },
                {
                  name: 'crapC8',
                  color: 'hsl(335, 70%, 50%)',
                  loc: 59371,
                },
                {
                  name: 'crapC9',
                  color: 'hsl(4, 70%, 50%)',
                  loc: 150009,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export function Indices_2() {
  const [data, setData] = useState<any>([])
  const [calandeList, setcalandeList] = useState<any>([])
  const [calandeData, setcalandeData] = useState<any>([])
  const [showTree, setshowTree] = useState<any>(true)
  const [permitTree, setpermitTree] = useState<any>(true)

  useLayoutEffect(() => {
    indicesList().then((d) => {
      setData(d.data)
    })

    eventCalendarList().then((d) => {
      setcalandeList(d.data)
      setcalandeData(d.data[0])
    })
  }, [])

  const inputV = async (params: number) => {
    setcalandeData(calandeList[params])
  }

  setTimeout(() => {
    if (permitTree) {
      setshowTree(false)
      setpermitTree(false)
    }
  }, 100)

  return (
    <>
      {data?.length !== 0 && (
        <>
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
                              <img src='https://www.dsebd.org/assets/imgs/tkdown.gif' alt='' />{' '}
                              <br />
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
                              <img src='https://www.dsebd.org/assets/imgs/tkdown.gif' alt='' />{' '}
                              <br />
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
          Trading View :
          <div>
            <ul className='nav nav-tabs nav-line-tabs mb-5 fs-6'>
              <li className='nav-item'>
                <a className='nav-link active' data-bs-toggle='tab' href='#kt_tab_pane_1'>
                  Graph 1
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' data-bs-toggle='tab' href='#kt_tab_pane_2'>
                  Graph 2
                </a>
              </li>
            </ul>

            <div className='tab-content' id='myTabContent'>
              <div className='tab-pane fade active show' id='kt_tab_pane_1' role='tabpanel'>
                <TypeChooser>
                  {(type) => <Chart type='hybrid' data={data} width={600} ratio={1} />}
                </TypeChooser>

                <div style={{width: '41%', overflowY: 'scroll', height: '250px'}}>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th scope='col'>Date</th>
                        <th scope='col'>Close</th>
                        <th scope='col'>High</th>
                        <th scope='col'>Low</th>
                        <th scope='col'>Open</th>
                        <th scope='col'>Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((collection, key) => {
                        var date = new Date(collection.date)

                        let dateShow =
                          date.getDate() +
                          '/' +
                          (date.getMonth() + 1) +
                          '/' +
                          date.getFullYear() +
                          ' ' +
                          date.getHours() +
                          ':' +
                          date.getMinutes() +
                          ':' +
                          date.getSeconds()

                        return (
                          <tr>
                            <th scope='row'>{dateShow}</th>
                            <td>{collection.close}</td>
                            <td>{collection.high}</td>
                            <td>{collection.low}</td>
                            <td>{collection.open}</td>
                            <td>{collection.volume}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <br />
              </div>

              <div
                className={showTree ? 'tab-pane fade active show' : 'tab-pane fade'}
                id='kt_tab_pane_2'
                role='tabpanel'
              >
                <TypeChooser>
                  {(type) => <Chart type='hybrid' data={data} width={600} ratio={1} />}
                </TypeChooser>

                <div style={{width: '41%', overflowY: 'scroll', height: '250px'}}>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th scope='col'>Date</th>
                        <th scope='col'>Close</th>
                        <th scope='col'>High</th>
                        <th scope='col'>Low</th>
                        <th scope='col'>Open</th>
                        <th scope='col'>Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((collection, key) => {
                        var date = new Date(collection.date)

                        let dateShow =
                          date.getDate() +
                          '/' +
                          (date.getMonth() + 1) +
                          '/' +
                          date.getFullYear() +
                          ' ' +
                          date.getHours() +
                          ':' +
                          date.getMinutes() +
                          ':' +
                          date.getSeconds()

                        return (
                          <tr>
                            <th scope='row'>{dateShow}</th>
                            <td>{collection.close}</td>
                            <td>{collection.high}</td>
                            <td>{collection.low}</td>
                            <td>{collection.open}</td>
                            <td>{collection.volume}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <br />
              </div>
            </div>
          </div>
          Market Map :
          <div style={{height: 500}}>
            <ResponsiveTreeMapHtml
              data={data1}
              tooltip={({node}) => (
                <>
                  <br />
                  <strong style={{boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s'}}>
                    {node.pathComponents.join(' / ')}: {node.formattedValue}
                  </strong>
                </>
              )}
              theme={{
                tooltip: {
                  container: {
                    background: '#333',
                  },
                },
              }}
              identity='name'
              value='loc'
              valueFormat='.02s'
              margin={{top: 10, right: 10, bottom: 10, left: 10}}
              labelSkipSize={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 2]],
              }}
              parentLabelTextColor={{
                from: 'color',
                modifiers: [['darker', 3]],
              }}
              colors={{scheme: 'yellow_orange_red'}}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.1]],
              }}
            />
          </div>
          {/* <ChartTicker /> */}
          Events Calander :
          <ul className='nav nav-tabs nav-line-tabs mb-5 fs-6'>
            <li className='nav-item' onClick={(e) => inputV(0)}>
              <a className='nav-link active' data-bs-toggle='tab' href='#kt_tab_pane_1'>
                Today
              </a>
            </li>
            <li className='nav-item' onClick={(e) => inputV(1)}>
              <a className='nav-link' data-bs-toggle='tab' href='#kt_tab_pane_1'>
                This Week
              </a>
            </li>
            <li className='nav-item' onClick={(e) => inputV(2)}>
              <a className='nav-link' data-bs-toggle='tab' href='#kt_tab_pane_1'>
                Upcomming Week
              </a>
            </li>
            <li className='nav-item' onClick={(e) => inputV(3)}>
              <a className='nav-link' data-bs-toggle='tab' href='#kt_tab_pane_1'>
                This Month
              </a>
            </li>
          </ul>
          <div className='tab-content' id='myTabContent'>
            <div className='tab-pane fade active show' id='kt_tab_pane_1' role='tabpanel'>
              <div className='row'>
                <div className='col-md-2'>
                  <div className='card card-custom card-flush'>
                    <div className='card-header'>
                      <h5 className='text-center'>{calandeData.board_meeting} </h5>
                    </div>
                    <div className='card-body' style={{padding: '0 2.25rem'}}>
                      Board Meetings
                    </div>
                  </div>
                </div>

                <div className='col-md-1'>
                  <div className='card card-custom card-flush'>
                    <div className='card-header'>
                      <h5 className='text-center'>{calandeData.dividend} </h5>
                    </div>
                    <div className='card-body' style={{padding: '0 1.25rem'}}>
                      Divident
                    </div>
                  </div>
                </div>

                <div className='col-md-1'>
                  <div className='card card-custom card-flush'>
                    <div className='card-header'>
                      <h5 className='text-center'>{calandeData.spot} </h5>
                    </div>
                    <div className='card-body' style={{padding: '0 2.25rem'}}>
                      Spot
                    </div>
                  </div>
                </div>

                <div className='col-md-2'>
                  <div className='card card-custom card-flush'>
                    <div className='card-header'>
                      <h5 className='text-center'>{calandeData.record_date} </h5>
                    </div>
                    <div className='card-body' style={{padding: '0 2.25rem'}}>
                      Record Data
                    </div>
                  </div>
                </div>

                <div className='col-md-1'>
                  <div className='card card-custom card-flush'>
                    <div className='card-header'>
                      <h5 className='text-center'>{calandeData.agm} </h5>
                    </div>
                    <div className='card-body' style={{padding: '0 2.25rem'}}>
                      AGM
                    </div>
                  </div>
                </div>

                <div className='col-md-1'>
                  <div className='card card-custom card-flush'>
                    <div className='card-header'>
                      <h5 className='text-center'>{calandeData.agm} </h5>
                    </div>
                    <div className='card-body' style={{padding: '0 2.25rem'}}>
                      EGM
                    </div>
                  </div>
                </div>

                <div className='col-md-2'>
                  <div className='card card-custom card-flush'>
                    <div className='card-header'>
                      <h5 className='text-center'>{calandeData.right_subscription} </h5>
                    </div>
                    <div className='card-body' style={{padding: '0 2.25rem'}}>
                      Right Subscriptions
                    </div>
                  </div>
                </div>

                <div className='col-md-2'>
                  <div className='card card-custom card-flush'>
                    <div className='card-header'>
                      <h5 className='text-center'>{calandeData.quarterly_earnings} </h5>
                    </div>
                    <div className='card-body' style={{padding: '0 2.25rem'}}>
                      Quarterly Earnings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
