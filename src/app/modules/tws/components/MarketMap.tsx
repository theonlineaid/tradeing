import {ResponsiveTreeMapHtml} from '@nivo/treemap'
import React, {useEffect, useState} from 'react'
import {Dropdown} from 'react-bootstrap'
import {SketchPicker} from 'react-color'
import {useSelector} from 'react-redux'
import {marketMapDataFormate} from '../../../../Util'
import type {RootState} from '../../../redux'

const initialColor = {
  m_30: '#f11110',
  m_20: '#ff5a5a',
  m_10: '#f37777',
  z_0: '#6d6a94',
  p_10: '#86df8f',
  p_20: '#50c059',
  p_30: '#1a8e3b',
}
function MarketMap() {
  return null
  const [data, setData] = useState<any>()
  const [dataActive, setDataActive] = useState<any>()
  const [colorValue, setColorValue] = useState(initialColor)

  const tradeListData = useSelector((state: RootState) => state.marketData)

  const handleValue = (params: any) => {
    let marketData = marketMapDataFormate(tradeListData, params, colorValue)
    setData(marketData)
    setDataActive(params)
  }

  useEffect(() => {
    handleValue('value')
  }, [colorValue])

  const handleColorChange = (params, type) => {
    if (type === 30) {
      const result_30 = `rgba(${params?.rgb?.r},${params?.rgb?.g},${params?.rgb?.b},${params?.rgb?.a})`
      const result_20 = `rgba(${params?.rgb?.r + 30},${params?.rgb?.g + 30},${
        params?.rgb?.b + 30
      },${params?.rgb?.a + 30})`
      const result_10 = `rgba(${params?.rgb?.r + 60},${params?.rgb?.g + 60},${
        params?.rgb?.b + 60
      },${params?.rgb?.a + 60})`

      setColorValue({...colorValue, p_30: result_30, p_20: result_20, p_10: result_10})
    } else if (type === -30) {
      const result_30 = `rgba(${params?.rgb?.r},${params?.rgb?.g},${params?.rgb?.b},${params?.rgb?.a})`
      const result_20 = `rgba(${params?.rgb?.r + 30},${params?.rgb?.g + 30},${
        params?.rgb?.b + 30
      },${params?.rgb?.a + 30})`
      const result_10 = `rgba(${params?.rgb?.r + 60},${params?.rgb?.g + 60},${
        params?.rgb?.b + 60
      },${params?.rgb?.a + 60})`

      setColorValue({...colorValue, m_30: result_30, m_20: result_20, m_10: result_10})
    } else {
      setColorValue({...colorValue})
    }
  }

  if (!data?.length) return <div>Loading...</div>

  return (
    <>
      <div className='d-flex justify-content-between align-items-center flex-wrap px-3'>
        <div className='market-map-btn'>
          <button
            className={
              dataActive === 'value' ? 'btn btn-outline-danger active' : 'btn btn-outline-danger'
            }
            onClick={(e) => handleValue('value')}
          >
            Value
          </button>
          <button
            className={
              dataActive === 'volume' ? 'btn btn-outline-danger active' : 'btn btn-outline-danger'
            }
            onClick={(e) => handleValue('volume')}
          >
            Volume
          </button>
          <button
            className={
              dataActive === 'market_cap'
                ? 'btn btn-outline-danger active'
                : 'btn btn-outline-danger'
            }
            onClick={(e) => handleValue('market_cap')}
          >
            Market Capital
          </button>
        </div>
        <div className='market-map-percentage'>
          <ul className='d-flex justify-content-end  align-items-center flex-wrap mb-0 ps-0 mt-0 mt-ms-3'>
            <li className='mt-1 mb-1'>
              <Dropdown>
                <Dropdown.Toggle
                  className='marketColorSettings'
                  title='settings'
                  style={{background: colorValue?.m_30}}
                >
                  -3%
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div>
                      <SketchPicker
                        color={colorValue?.m_30}
                        onChangeComplete={(color) => {
                          handleColorChange(color, -30)
                        }}
                      />
                    </div>
                  </Dropdown.Header>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className='mt-1 mb-1'>
              <button
                type='button'
                className='btn btn-primary'
                style={{background: colorValue?.m_20}}
              >
                -2%
              </button>
            </li>
            <li className='mt-1 mb-1'>
              <button
                type='button'
                className='btn btn-primary'
                style={{background: colorValue?.m_10}}
              >
                -1%
              </button>
            </li>
            <li className='mt-1 mb-1'>
              <Dropdown>
                <Dropdown.Toggle
                  className='marketColorSettings'
                  title='settings'
                  style={{background: colorValue?.z_0}}
                >
                  0%
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div>
                      <SketchPicker
                        color={colorValue?.z_0}
                        onChangeComplete={(color) => setColorValue({...colorValue, z_0: color.hex})}
                      />
                    </div>
                  </Dropdown.Header>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className='mt-1 mb-1'>
              <button
                type='button'
                className='btn btn-primary'
                style={{background: colorValue?.p_10}}
              >
                1%
              </button>
            </li>
            <li className='mt-1 mb-1'>
              <button
                type='button'
                className='btn btn-primary'
                style={{background: colorValue?.p_20}}
              >
                2%
              </button>
            </li>

            <li className='mt-1 mb-1'>
              <Dropdown>
                <Dropdown.Toggle
                  className='marketColorSettings'
                  title='settings'
                  style={{background: colorValue?.p_30}}
                >
                  3%
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div>
                      <SketchPicker
                        color={colorValue?.p_30}
                        onChangeComplete={(color) => {
                          handleColorChange(color, 30)
                        }}
                      />
                    </div>
                  </Dropdown.Header>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>

      {data?.name && (
        <div className='h-marketMap'>
          <ResponsiveTreeMapHtml
            data={data}
            tooltip={({node}) => (
              <>
                <ul
                  className='px-4 py-3'
                  style={{
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                    transition: '0.3s',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                  }}
                >
                  <li>
                    Category :{' '}
                    <span className='fw-bolder'>{node?.data?.allData?.business_segment}</span>
                  </li>
                  <li>
                    Name : <span className='fw-bolder'>{node.id}</span>
                  </li>
                  <li>
                    Company Name :{' '}
                    <span className='fw-bolder'>{node?.data?.allData?.full_name}</span>
                  </li>

                  <li>
                    Value : <span className='fw-bolder'>{node.formattedValue}</span>
                  </li>
                  <li>
                    Volume : <span className='fw-bolder'>{node?.data?.allData?.volume}</span>
                  </li>
                  <li>
                    Market Capital :{' '}
                    <span className='fw-bolder'>{node?.data?.allData?.market_cap}</span>
                  </li>
                  <li>
                    LPT : <span className='fw-bolder'>{node?.data?.allData?.lpt}</span>
                  </li>

                  <li className='d-flex'>
                    Change :
                    <div className='fw-bolder'>
                      {node?.data?.allData?.change}%
                      <span
                        className='ColorChangeMarketMap ms-2'
                        style={{background: node?.data?.color}}
                      >
                        &nbsp; &nbsp; &nbsp;
                      </span>
                    </div>
                  </li>
                </ul>
              </>
            )}
            theme={{
              tooltip: {
                container: {
                  background: '#fff',
                },
              },
            }}
            label='id'
            nodeOpacity={0.5}
            identity='name'
            value='loc'
            valueFormat='.02s'
            margin={{top: 5, right: 10, bottom: 10, left: 10}}
            labelSkipSize={12}
            borderWidth={1}
            labelTextColor='#f2f6f8'
            parentLabelSize={22}
            parentLabelTextColor='#000'
            colors={{scheme: 'pastel2'}}
            borderColor={{
              from: 'color',
              modifiers: [['brighter', 0.2]],
            }}
          />
        </div>
      )}
    </>
  )
}

export default React.memo(MarketMap)
