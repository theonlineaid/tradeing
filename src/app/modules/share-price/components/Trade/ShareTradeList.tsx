import {useLayoutEffect, useState} from 'react'
import Marquee from 'react-fast-marquee'
import {TypeChooser} from 'react-stockcharts/lib/helper'
import {indicesList} from '../../../auth/core/_requests'
import Chart from '../../Chart'
import {TradeTable} from './TradeTable'

export function ShareTradeList() {
  const [data, setData] = useState<any>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showTree, setShowTree] = useState<any>(true)

  useLayoutEffect(() => {
    indicesList().then((d) => {
      setData(d.data)
    })
  }, [])

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
                              className='abHead'
                              target='_top'
                            >
                              <div style={{display: 'flex'}}>
                                ZEALBANGLA&nbsp;172.80&nbsp;
                                <img src='https://www.dsebd.org/assets/imgs/tkdown.gif' alt='' />
                              </div>
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
                              className='abHead'
                              target='_top'
                            >
                              <div style={{display: 'flex'}}>
                                ZEALBANGLA&nbsp;172.80&nbsp;
                                <img src='https://www.dsebd.org/assets/imgs/tkup.gif' alt='' />
                              </div>
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
                              className='abHead'
                              target='_top'
                            >
                              <div style={{display: 'flex'}}>
                                ZEALBANGLA&nbsp;172.80&nbsp;
                                <img src='https://www.dsebd.org/assets/imgs/tkup.gif' alt='' />
                              </div>
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
                              className='abHead'
                              target='_top'
                            >
                              <div style={{display: 'flex'}}>
                                ZEALBANGLA&nbsp;172.80&nbsp;
                                <img src='https://www.dsebd.org/assets/imgs/tkdown.gif' alt='' />
                              </div>{' '}
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
                              className='abHead'
                              target='_top'
                            >
                              <div style={{display: 'flex'}}>
                                ZEALBANGLA&nbsp;172.80&nbsp;
                                <img src='https://www.dsebd.org/assets/imgs/tkdown.gif' alt='' />
                              </div>
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
                              className='abHead'
                              target='_top'
                            >
                              <div style={{display: 'flex'}}>
                                ZEALBANGLA&nbsp;172.80&nbsp;
                                <img src='https://www.dsebd.org/assets/imgs/tkup.gif' alt='' />
                              </div>
                              <br />
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
          <h5 className='my-3'>Trading View :</h5>
          <div>
            <ul className='nav nav-tabs nav-line-tabs mb-5 fs-6'>
              <li className='nav-item'>
                <a className='nav-link active' data-bs-toggle='tab' href='#share_trade_list_1'>
                  Share Trade List
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' data-bs-toggle='tab' href='#share_trade_list_2'>
                  Trade Chart
                </a>
              </li>
            </ul>

            <div className='tab-content' id='myTabContent'>
              <div className='tab-pane fade active show' id='share_trade_list_1' role='tabpanel'>
                <TradeTable />
              </div>

              <div
                className={showTree ? 'tab-pane fade active' : 'tab-pane fade'}
                id='share_trade_list_2'
                role='tabpanel'
              >
                <div className='row justify-content-between align-items-center'>
                  <div className='col-md-8'>
                    <TypeChooser>
                      {(type) => <Chart type='hybrid' data={data} ratio={1} />}
                    </TypeChooser>
                  </div>
                  <div className='col-md-4'>
                    <div style={{width: '100%', overflowY: 'scroll', height: '350px'}}>
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
                              <tr key={key}>
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
