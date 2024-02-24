import { MarketDataType } from '#common/types/market-data'
import { MarketDataContext } from '#context/marketDataContext'
import { RootState } from '#store/index'
import { changeIsMin, changeRowNumber } from '#store/slices/buysell'
import {
  changeBlotterColor,
  changeExecutionColor,
  changeMarketDataColor,
  changeMarketDeptColor,
  changeMoversGainersColor,
  changeOrderSummaryColor,
  changePositionColor,
} from '#store/slices/linkedTable'
import { useMenuState } from '@szhsin/react-menu'
import React, { useContext, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { CSVLink } from 'react-csv'
import { BsSave } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'
import { FiColumns, FiMaximize } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import SvgIcon from './../../../../common/components/svg-icons/index'
import MinMaxSection from './MinMaxSection'
import ClientSelect from './clientSelect'
import InstrumentSelect from './instrumentSelect'

interface Props {
  layout: any
  data: any
  selectedTab?: any
  setSelectedTab?: any
  setIsWatchList?: any
  openModal: any
  handleClick?: any
  closeModal?: any
  modalBody?: any
  handleMinMax?: any
  handleLock?: any
  handleViewModal?: any
  csvData?: any
  handleSearchFilter?: any
  isSearchAble?: boolean
  remove?: any
  isSingleSection: boolean
  title: any
  isModal?: boolean
  icon?: any
  type?: string
  tableData?: any
}

const SectionHeader: React.FC<React.PropsWithChildren<Props>> = ({
  layout,
  data,
  selectedTab,
  setSelectedTab,
  setIsWatchList,
  modalBody,
  handleMinMax,
  handleLock,
  handleViewModal,
  handleSearchFilter,
  csvData,
  isSearchAble = false,
  remove,
  isSingleSection,
  title,
  isModal,
  icon,
  type,
  tableData,
}) => {
  // States
  const [isClearable, setIsClearable] = useState(true)
  const [isSearchable, setIsSearchable] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRtl, setIsRtl] = useState(false)
  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
  const { marketDatas } = useContext(MarketDataContext) as MarketDataType

  const dispatch = useDispatch()
  const { linkedTable, buySell } = useSelector((state: RootState) => state)
  const targetHeight = 25


  const getCurrentDate = (separator = '') => {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
  }



// ------------------------------------
// Update table color by id 
  const patchTableColorById = async (tableId, tableColor) => {
    try {
      const response = await fetch(`http://203.202.247.206:8007/api/app_settings/theme-table/update/color-font/${tableId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table_color: tableColor }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update table color for table with ID ${tableId}`);
      }

      const updatedTable = await response.json();
      return updatedTable;
    } catch (error) {
      // Handle error
      console.error('Error updating table color:', error);
      throw error;
    }
  };
// ------------------------------------



  return (
    <div
      className='tw-flex tw-items-center tw-justify-between p-0 tw-bg-gradient-to-r tw-from-purple-200 tw-to-white dark:tw-from-transparent dark:tw-to-transparent dark:tw-bg-dark-400 dark:tw-border-dark-400 tw-h-9'
      onContextMenu={(e) => {
        e.preventDefault()
        setAnchorPoint({ x: e.clientX, y: e.clientY })
        toggleMenu(true)
      }}
    >
      {isSingleSection && (
        <h3 className='tw-font-bold tw-text-lg dark:tw-text-gray-300 tw-px-3' onClick={handleLock}>
          {title}
          &nbsp;{icon}
        </h3>
      )}
      {!isSingleSection ? (
        <div className='trade-tabs d-flex overflow-auto'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-6 fw-bold flex-nowrap'>
            {data &&
              data.map((tab) => {
                return (
                  <li className='nav-item' key={tab.id}>
                    <a
                      className={`nav-link px-4 tw-text-blue-900 ${selectedTab === tab.id
                          ? 'active tw-text-white dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700'
                          : 'dark:tw-text-slate-50 hover:tw-bg-gradient-to-r hover:tw-from-blue-400 hover:tw-to-emerald-400 dark:hover:tw-bg-gradient-to-r dark:hover:tw-from-purple-900 dark:hover:tw-to-purple-700'
                        }`}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        setSelectedTab(tab.id)
                        setIsWatchList(tab.id !== 70 ? true : false)
                      }}
                    >
                      {tab.name}
                    </a>
                  </li>
                )
              })}
            {data &&
              data.map((tab) => {
                return tab.sub_table.map((st, i) => {
                  return (
                    <li className='nav-item' key={i}>
                      <a
                        className={`nav-link px-4 tw-text-blue-900 ${false
                            ? 'active tw-text-white dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700'
                            : 'dark:tw-text-slate-50 hover:tw-bg-gradient-to-r hover:tw-from-blue-400 hover:tw-to-emerald-400 dark:hover:tw-bg-gradient-to-r dark:hover:tw-from-purple-900 dark:hover:tw-to-purple-700'
                          }`}
                        style={{ cursor: 'pointer' }}
                      >
                        {st.name}
                      </a>
                    </li>
                  )
                })
              })}
          </ul>
        </div>
      ) : null}

      <div className='text-end' title=''>
        <div className='actions cursor-pointer d-flex'>
          <div className='d-flex justify-content-center align-items-center gap-2 tradingListHeaderRight'>
            {isSearchAble && (
              <input
                className='form-control dark:tw-bg-dark-200 !important dark:tw-border-dark-400 tw-h-8 !important'
                type='text'
                id='filter-text-box'
                placeholder='Instruments'
                onChange={handleSearchFilter}
              />
            )}

            {!layout?.i.endsWith('GROUP') &&
              layout.i !== 'performance_INDIVIDUAL' &&
              layout?.component_type !== 'report' &&
              layout?.i !== 'purchase_power_INDIVIDUAL' &&
              layout?.i !== 'order_GROUP' ? (
              <>
                {layout.i !== 'news_INDIVIDUAL' && <ClientSelect layout={layout} />}
                {/* <ClientSelect layout={layout} /> */}
                <InstrumentSelect layout={layout} />
              </>
            ) : null}

            {layout?.i !== 'purchase_power_INDIVIDUAL' &&
              layout?.i !== 'order_GROUP' &&
              layout.i !== 'news_INDIVIDUAL' ? (
              <div className='orderListDropdown'>
                <Dropdown>
                  <Dropdown.Toggle
                    id='dropdown-basic'
                    className={`custom-btn ${layout?.i === 'trading_GROUP'
                        ? linkedTable?.marketData
                        : layout?.i === 'buy_sell'
                          ? linkedTable?.marketDept
                          : layout?.i === 'blotter_INDIVIDUAL'
                            ? linkedTable?.blotter
                            : layout?.i === 'performance_INDIVIDUAL'
                              ? linkedTable?.moversGainers
                              : layout?.i === 'position_INDIVIDUAL'
                                ? linkedTable?.position
                                : layout?.i === 'execution_INDIVIDUAL'
                                  ? linkedTable?.execution
                                  : layout?.i === 'orderSummery_INDIVIDUAL'
                                    ? linkedTable?.orderSummary
                                    : null
                      }
                  `}
                  >
                    <p
                      className={`tw-w-5 ${layout?.i === 'trading_GROUP'
                          ? linkedTable?.marketData
                          : layout?.i === 'buy_sell'
                            ? linkedTable?.marketDept
                            : layout?.i === 'blotter_INDIVIDUAL'
                              ? linkedTable?.blotter
                              : layout?.i === 'performance_INDIVIDUAL'
                                ? linkedTable?.moversGainers
                                : layout?.i === 'execution_INDIVIDUAL'
                                  ? linkedTable?.execution
                                  : layout?.i === 'position_INDIVIDUAL'
                                    ? linkedTable?.position
                                    : layout?.i === 'orderSummery_INDIVIDUAL'
                                      ? linkedTable?.orderSummary
                                      : null
                        }
                  `}
                    >
                      &nbsp;
                    </p>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className='dark:tw-bg-dark-500 dark:tw- dark:tw-border-[#3b6d61] dark:tw-overflow-y-hidden'>
                    <Dropdown.Item
                      href='#/action-1'
                      title='Export Report'
                      // dark:tw-text-stone-200 dark:hover:tw-text-black
                      className='m-2 '
                      onClick={() =>
                        layout?.i === 'trading_GROUP'
                          ? dispatch(changeMarketDataColor(''))
                          : layout?.i === 'buy_sell'
                            ? dispatch(changeMarketDeptColor(''))
                            : layout?.i === 'blotter_INDIVIDUAL'
                              ? dispatch(changeBlotterColor(''))
                              : layout?.i === 'performance_INDIVIDUAL'
                                ? dispatch(changeMoversGainersColor(''))
                                : layout?.i === 'execution_INDIVIDUAL'
                                  ? dispatch(changeExecutionColor(''))
                                  : layout?.i === 'position_INDIVIDUAL'
                                    ? dispatch(changePositionColor(''))
                                    : layout?.i === 'orderSummery_INDIVIDUAL'
                                      ? dispatch(changeOrderSummaryColor(''))
                                      : null
                      }
                    >
                      No Color
                    </Dropdown.Item>
                    <Dropdown.Item
                      href='#/action-1'
                      title='Export Report'
                      className='m-2 tw-bg-lime-400'
                      onClick={() =>
                        layout?.i === 'trading_GROUP'
                          ? dispatch(changeMarketDataColor('tw-bg-lime-400'))
                          : layout?.i === 'blotter_INDIVIDUAL'
                            ? dispatch(changeBlotterColor('tw-bg-lime-400'))
                            : layout?.i === 'buy_sell'
                              ? dispatch(changeMarketDeptColor('tw-bg-lime-400'))
                              : layout?.i === 'performance_INDIVIDUAL'
                                ? dispatch(changeMoversGainersColor('tw-bg-lime-400'))
                                : layout?.i === 'execution_INDIVIDUAL'
                                  ? dispatch(changeExecutionColor('tw-bg-lime-400'))
                                  : layout?.i === 'position_INDIVIDUAL'
                                    ? dispatch(changePositionColor('tw-bg-lime-400'))
                                    : layout?.i === 'orderSummery_INDIVIDUAL'
                                      ? dispatch(changeOrderSummaryColor('tw-bg-lime-400'))
                                      : null
                      }
                    >
                      &nbsp;
                    </Dropdown.Item>
                    <Dropdown.Item
                      href='#/action-1'
                      title='Export Report'
                      className='m-2 tw-bg-red-400'
                      onClick={() =>
                        layout?.i === 'trading_GROUP'
                          ? dispatch(changeMarketDataColor('tw-bg-red-400'))
                          : layout?.i === 'buy_sell'
                            ? dispatch(changeMarketDeptColor('tw-bg-red-400'))
                            : layout?.i === 'blotter_INDIVIDUAL'
                              ? dispatch(changeBlotterColor('tw-bg-red-400'))
                              : layout?.i === 'performance_INDIVIDUAL'
                                ? dispatch(changeMoversGainersColor('tw-bg-red-400'))
                                : layout?.i === 'execution_INDIVIDUAL'
                                  ? dispatch(changeExecutionColor('tw-bg-red-400'))
                                  : layout?.i === 'position_INDIVIDUAL'
                                    ? dispatch(changePositionColor('tw-bg-red-400'))
                                    : layout?.i === 'orderSummery_INDIVIDUAL'
                                      ? dispatch(changeOrderSummaryColor('tw-bg-red-400'))
                                      : null
                      }
                    >
                      &nbsp;
                    </Dropdown.Item>
                    <Dropdown.Item
                      href='#/action-1'
                      title='Export Report'
                      className='m-2 tw-bg-green-400'
                      onClick={() =>
                        layout?.i === 'trading_GROUP'
                          ? dispatch(changeMarketDataColor('tw-bg-green-400'))
                          : layout?.i === 'buy_sell'
                            ? dispatch(changeMarketDeptColor('tw-bg-green-400'))
                            : layout?.i === 'blotter_INDIVIDUAL'
                              ? dispatch(changeBlotterColor('tw-bg-green-400'))
                              : layout?.i === 'performance_INDIVIDUAL'
                                ? dispatch(changeMoversGainersColor('tw-bg-green-400'))
                                : layout?.i === 'execution_INDIVIDUAL'
                                  ? dispatch(changeExecutionColor('tw-bg-green-400'))
                                  : layout?.i === 'position_INDIVIDUAL'
                                    ? dispatch(changePositionColor('tw-bg-green-400'))
                                    : layout?.i === 'orderSummery_INDIVIDUAL'
                                      ? dispatch(changeOrderSummaryColor('tw-bg-green-400'))
                                      : null
                      }
                    >
                      &nbsp;
                    </Dropdown.Item>
                    <Dropdown.Item
                      href='#/action-1'
                      title='Export Report'
                      className='m-2 tw-bg-gray-400'
                      onClick={() =>
                        layout?.i === 'trading_GROUP'
                          ? dispatch(changeMarketDataColor('tw-bg-gray-400'))
                          : layout?.i === 'buy_sell'
                            ? dispatch(changeMarketDeptColor('tw-bg-gray-400'))
                            : layout?.i === 'blotter_INDIVIDUAL'
                              ? dispatch(changeBlotterColor('tw-bg-gray-400'))
                              : layout?.i === 'performance_INDIVIDUAL'
                                ? dispatch(changeMoversGainersColor('tw-bg-gray-400'))
                                : layout?.i === 'execution_INDIVIDUAL'
                                  ? dispatch(changeExecutionColor('tw-bg-gray-400'))
                                  : layout?.i === 'position_INDIVIDUAL'
                                    ? dispatch(changePositionColor('tw-bg-gray-400'))
                                    : layout?.i === 'orderSummery_INDIVIDUAL'
                                      ? dispatch(changeOrderSummaryColor('tw-bg-gray-400'))
                                      : null
                      }
                    >
                      &nbsp;
                    </Dropdown.Item>
                    <Dropdown.Item
                      href='#/action-1'
                      title='Export Report'
                      className='m-2 tw-bg-orange'
                      onClick={() =>
                        layout?.i === 'trading_GROUP'
                          ? dispatch(changeMarketDataColor('tw-bg-orange'))
                          : layout?.i === 'buy_sell'
                            ? dispatch(changeMarketDeptColor('tw-bg-orange'))
                            : layout?.i === 'blotter_INDIVIDUAL'
                              ? dispatch(changeBlotterColor('tw-bg-orange'))
                              : layout?.i === 'performance_INDIVIDUAL'
                                ? dispatch(changeMoversGainersColor('tw-bg-orange'))
                                : layout?.i === 'execution_INDIVIDUAL'
                                  ? dispatch(changeExecutionColor('tw-bg-orange'))
                                  : layout?.i === 'position_INDIVIDUAL'
                                    ? dispatch(changePositionColor('tw-bg-orange'))
                                    : layout?.i === 'orderSummery_INDIVIDUAL'
                                      ? dispatch(changeOrderSummaryColor('tw-bg-orange'))
                                      : null
                      }
                    >
                      &nbsp;
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : null}

            <div className='orderListDropdown'>
              <Dropdown>
                <Dropdown.Toggle
                  id='dropdown-basic'
                  className='custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700'
                >
                  <BsSave />
                </Dropdown.Toggle>

                <Dropdown.Menu className='dark:tw-bg-dark-500 dark:tw- dark:tw-border-[#3b6d61] dark:tw-overflow-y-hidden'>
                  {csvData ? (
                    <Dropdown.Item
                      href='#/action-1'
                      title='Export Report'
                      className='dark:tw-text-slate-200 dark:tw-border-b-slate-500 dark:hover:tw-bg-dark-400'
                    >
                      {/* {console.log(layout?.i)} */}
                      <CSVLink
                        data={csvData}
                        filename={layout?.i?.split('_')[0] + '-' + getCurrentDate()}
                      >
                        CSV
                      </CSVLink>
                    </Dropdown.Item>
                  ) : null}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* === Min buySell */}
            {layout?.i === 'buy_sell' ? (
              <div
                onClick={() => {
                  dispatch(changeIsMin(!buySell.isMin))
                  dispatch(changeRowNumber(!buySell.isMin ? 3 : 10))
                }}
                title='Mini'
                className='btn custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500'
              >
                <FiColumns />
              </div>
            ) : null}

            <Dropdown>
              <Dropdown.Toggle
                title='settings'
                className='btn custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500'
              >
                <SvgIcon.Setting />
              </Dropdown.Toggle>

              <Dropdown.Menu className='dark:tw-bg-dark-400 dark:tw-overflow-y-hidden'>
                <Dropdown.Header className='tw-min-w-[350px] dark:tw-bg-dark-400 tw-h-[420px]'>
                  {modalBody}
                </Dropdown.Header>
                <Dropdown.Item></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {!isModal ? (
              <>
                <MinMaxSection handleClick={handleMinMax} layout={layout} />
                <div
                  onClick={handleViewModal}
                  title='Full screen'
                  className='btn custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500'
                >
                  <FiMaximize />
                </div>
                <div
                  title='Remove'
                  className='btn custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500'
                >
                  <FaTimes />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionHeader
