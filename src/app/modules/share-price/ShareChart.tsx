import {useLayoutEffect, useState} from 'react'
import {TypeChooser} from 'react-stockcharts/lib/helper'
import {shareChartGraph} from '../auth/core/_requests'
import Chart from './Chart'

export function ShareChart() {
  const [data, setData] = useState<any>([])

  useLayoutEffect(() => {
    shareChartGraph().then((d) => {
      setData(d.data)
    })
  }, [])

  return (
    <>
      {data?.length !== 0 && (
        <>
          <div className='row justify-content-between align-items-center'>
            <div className='col-md-6'>
              <TypeChooser>
                {(type) => <Chart type='hybrid' data={data} width={600} ratio={1} />}
              </TypeChooser>
            </div>
            <div className='col-md-5'>
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
        </>
      )}
    </>
  )
}
