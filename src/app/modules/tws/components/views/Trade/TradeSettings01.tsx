import { MarketDataType } from '#common/types/market-data'
import { FilterMarketDataContext } from '#context/filterMarketDataContext'
import { MarketDataContext } from '#context/marketDataContext'
import useMarketDataFilter from '#hooks/useMarketDataFilter'
import { RootState } from '#store/index'
import { fontSizeDecrement, fontSizeIncrement } from '#store/slices/settings'
import { CategoryType, addWatchList, removeWatchList, updateWatchList } from '#store/slices/watchList'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { BsDashLg, BsPlusLg } from 'react-icons/bs'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import Switch from 'react-switch'
import CheckList from '../../../../../common/components/ui/CheckList'
import { getTestData } from '../../../../auth/core/_requests'

// market data types for filtering
const marketType = [
  { value: '', label: 'All', option: 'selected' },
  { value: 'Main Board', label: 'Main' },
  { value: 'Small Cap Board', label: 'SME' },
  { value: 'Alternative Trading Board', label: 'ATB' },
]
// Main board category types for filtering
const mainCategoryType = [
  { value: '', label: 'All', option: 'selected' },
  { value: 'BLOCK', label: 'Block' },
  { value: 'DEBT', label: 'Debt' },
  { value: 'BUYIN', label: 'Buy-In' },
  { value: 'PUBLIC', label: 'Public' },
]
// SME board category types for filtering
const smeCategoryType = [
  { value: '', label: 'All', option: 'selected' },
  { value: 'SPUBLIC', label: 'Public' },
  { value: 'SBLOCK', label: 'Block' },
  { value: 'SBUYIN', label: 'Buy-In' },
  { value: 'SDEBT', label: 'Debt' },
]

// ATB board category types for filtering
const atbCategoryType = [
  { value: '', label: 'All', option: 'selected' },
  { value: 'ATBBUYIN', label: 'Buy-In' },
  { value: 'ATBDEBT', label: 'Debt' },
  { value: 'ATBPUB', label: 'Public' },
]





const TradeSettings01 = ({ checkData, handleCheckData, tableName }) => {
  const { watchList, settings } = useSelector((state: RootState) => state)

  const [activeSettingTab, setActiveSettingTab] = useState<string>('column')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSectorSelected, setIsSectorSelected] = useState<boolean>(false)
  const [selectedSector, setSelectedSector] = useState<any>([])
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [editIem, setEditIem] = useState<CategoryType>()
  const [watchListName, setWatchListName] = useState<string>('')
  const [fontSize, setFontSize] = useState<number>()

  type DataItem = {
    id: number;
    headerName: string;
    field: string;
    hide: boolean;
    isDefault: boolean;
    canDelete: boolean;
    isChecked: boolean;
    height: number;
    width: number;
    cellStyle: any;
    cellRenderer: any;
    order: number;
    headerClass: any;
    type: any;
  };

  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        setLoading(true);
        const responseData = await getTestData(329, 'parent');
        setData(responseData.data.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromAPI();
  }, []);

  console.log({ data }, 'test data not serve')

  // redux dispatcher
  const dispatchRedux = useDispatch()

  // actions
  const handleCreate = (e) => {
    setWatchListName(e.target.value)
  }

  const onButtonExport = () => { }


  //  initial state for the filter market data
  const initialState = {
    market: '',
    category: '',
    sector: '',
    option: '',
  }

  // filter reducer for the market data
  const filterReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'MARKET':
        return {
          ...state,
          market: action.payload,
          category: '',
          // option:''
        }
      case 'CATEGORY':
        return {
          ...state,
          category: action.payload,
        }
      case 'SECTOR':
        if (action.payload === '') {
          return {
            ...state,
            sector: action.payload,
            option: '',
          }
        } else {
          return {
            ...state,
            sector: action.payload,
            option: '',
          }
        }
      case 'OPTION':
        return {
          ...state,
          option: action.payload,
        }
      case 'CLEAR_FILTER':
        return {
          ...state,
          market: '',
          category: '',
          sector: '',
          option: '',
        }
    }
  }

  // current state, all market data from API, setFiltered data function
  const [state, dispatch] = useReducer(filterReducer, initialState)
  const { marketDatas, flash, flashHandler } = useContext(MarketDataContext) as MarketDataType
  const { filterMarketData, setFilterMarketData } = useContext(FilterMarketDataContext)

  //  set filtered market data into the context
  const applyFilter = () => {
    setFilterMarketData(state)
  }

  const clearFilter = () => {
    setFilterMarketData({
      market: '',
      category: '',
      sector: '',
      option: '',
    })
    dispatch({ type: 'CLEAR_FILTER' })
  }

  //  filtering unique sector from market data
  const filteredSectors = marketDatas
    .map((obj) => obj.sector)
    .filter((sector) => sector !== undefined && sector !== '')
  const uniqueSectors = [...new Set(filteredSectors)]

  // filter sector's options
  const filteredData = useMarketDataFilter(marketDatas, state)
  const options = marketDatas?.filter((data) => data.sector === state.sector)

  /**
   * Create New Watch list Handler.
   *
   * This function is triggered to create a new watch list by dispatching the addWatchList action
   * with the provided watchList data.
   */
  const createNewWListHandler = () => {
    dispatchRedux(addWatchList({ id: `${Date.now()}`, name: watchListName }))

    // reset the input fields
    setWatchListName('')
  }

  /**
   * Watch list Name Edit Handler.
   *
   * This function is triggered when editing the name of a watchlist. It opens the edit mode, sets the
   * item to be edited, and initializes the watchlist name for editing based on the provided item data.
   *
   * @param {CategoryType} itm - The item (watchlist) data to be edited.
   */
  const watchListNameEditHandler = (itm: CategoryType) => {
    // Destructure the id and name from the provided item data
    const { id, name } = itm

    // Open the edit mode, set the item to be edited, and initialize the watchlist name for editing
    setIsEditOpen(true)
    setEditIem(itm)
    setWatchListName(name)
  }

  /**
   * Watch list Name Edit Cancel Handler.
   *
   * clearing the watchlist name for editing.
   */
  const watchListNameEditCancelHandler = () => {
    // Toggle the edit mode and clear the watchlist name for editing
    setIsEditOpen(!isEditOpen)
    setWatchListName('')
  }

  /**
   * Watchlist Name Update Handler.
   *
   * This function is triggered to update the name of a watchlist. It dispatches the updateWatchList
   * action with the updated name and watchlist ID, then closes the edit mode and clears the watchlist
   * name for editing.
   */
  const watchListNameUpdateHandler = () => {
    dispatchRedux(updateWatchList({ id: editIem?.id, name: watchListName }))

    setIsEditOpen(false)
    setWatchListName('')
  }

  /**
   * Watch list Name Remove Handler.
   *
   * This function is triggered to remove a watchlist. It dispatches the removeWatchList action
   * with the provided watchlist data for removal.
   *
   * @param {CategoryType} itm - The watchlist data to be removed.
   */
  const watchListNameRemoveHandler = (itm) => {
    dispatchRedux(removeWatchList(itm))
  }

  // set font size
  useEffect(() => {
    const fontSize = settings.tableSettings.find((t) => t.tableName === tableName)?.fontSize

    setFontSize(fontSize)
  }, [settings])




  return (
    <>
      <Tabs
        defaultActiveKey={activeSettingTab}
        activeKey={activeSettingTab}
        transition={false}
        id='noanim-tab-example'
        className='mb-3 tw-w-[500px] dark:tw-border-b-slate-700'
        onSelect={(k: string | null, e: React.SyntheticEvent<unknown>) =>
          setActiveSettingTab(k ?? '')
        }
      >
        <Tab eventKey='column' title='Columns' className='dark:tw-text-slate-400'>
          <ul className='tw-grid tw-grid-cols-3 tw-gap-2 p-0'>

            {data.map(d => (
              <li key={d.id}>{d.headerName}</li>
            ))}

          </ul>
        </Tab>
        <Tab eventKey='filter' title='Filter' className='dark:tw-text-slate-400'>
          <div className='tw-inline-block tw-mr-2 tw-w-48'>
            <label
              id='filter'
              className='tw-block tw-w-full mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'
            >
              Select an market
            </label>
            <select
              onChange={(e) => dispatch({ type: 'MARKET', payload: e.target.value })}
              value={state.market}
              id='filter'
              className='tw-inline tw-mr-4 tw-w-full tw-p-2 tw-mb-6 tw-text-sm tw-text-gray-900 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-50 focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-placeholder-gray-400 dark:tw-text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500'
            >
              {/* <option value=''>All</option> */}
              {marketType?.map((item) => (
                <option value={item?.value} selected={item?.option === 'selected'}>
                  {item?.label}
                </option>
              ))}
            </select>
          </div>

          {state.market.length > 0 && (
            <div className='tw-inline-block tw-mr-2 tw-w-48'>
              <label
                id='filter'
                className='tw-block tw-w-52 mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'
              >
                Select an Segment
              </label>
              <select
                onChange={(e) => dispatch({ type: 'CATEGORY', payload: e.target.value })}
                value={state.category}
                id='filter'
                className='tw--block tw-mr-4 tw-w-full tw-p-2 tw-mb-6 tw-text-sm tw-text-gray-900 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-50 focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-placeholder-gray-400 dark:tw-text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500'
              >
                {/* <option value=''>All</option> */}
                {state.market == 'Main Board'
                  ? mainCategoryType?.map((item) => (
                    <option value={item?.value} selected={item?.option === 'selected'}>
                      {item?.label}{' '}
                    </option>
                  ))
                  : state.market == 'Small Cap Board'
                    ? smeCategoryType?.map((item) => (
                      <option value={item?.value} selected={item?.option === 'selected'}>
                        {item?.label}{' '}
                      </option>
                    ))
                    : atbCategoryType?.map((item) => (
                      <option value={item?.value} selected={item?.option === 'selected'}>
                        {item?.label}{' '}
                      </option>
                    ))}
              </select>
            </div>
          )}

          {/* state.market == 'Alternative Trading Board'? */}

          <div className='tw-inline-block tw-mr-2 tw-w-48'>
            <label
              id='filter'
              className='tw-block tw-w-52 mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'
            >
              Select an Sector
            </label>
            <select
              onChange={(e) => {
                dispatch({ type: 'SECTOR', payload: e.target.value })
              }}
              value={state.sector}
              id='filter'
              className='tw-inline tw-mr-4 tw-w-full tw-p-2 tw-mb-6 tw-text-sm tw-text-gray-900 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-50 focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-placeholder-gray-400 dark:tw-text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500'
            >
              <option value='' selected>
                All
              </option>
              {uniqueSectors?.map((sector) => (
                <option value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div className='tw-block'>
            {state.sector.length > 0 ? (
              <div className='tw-inline-block  tw-w-48 tw-mr-2'>
                <label
                  id='filter'
                  className='tw-block tw-w-52 mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'
                >
                  Select an Option
                </label>
                <select
                  onChange={(e) => dispatch({ type: 'OPTION', payload: e.target.value })}
                  value={state.option}
                  id='filter'
                  className='tw-inline tw-w-full tw-p-2 tw-mb-6 tw-text-sm tw-text-gray-900 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-50 focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-placeholder-gray-400 dark:tw-text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500'
                >
                  <option value='' selected>
                    All
                  </option>
                  {options?.map((item) => (
                    <option value={item?.short_name}>{item?.short_name}</option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* apply filter */}
            <div className='tw-inline-block '>
              <button
                onClick={applyFilter}
                className='tw-blocks btn custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500 text-white text-sm tw-p-2'
              >
                Apply Filter
              </button>

              {/* clear filter */}
              <button
                onClick={clearFilter}
                className=' btn custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-red-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-red-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500 tw-ml-2 text-white text-sm tw-p-2'
              >
                Clear Filter
              </button>
            </div>
          </div>
        </Tab>
        <Tab eventKey='tabs' title='Tabs' className='dark:tw-text-slate-400'>
          <input
            className='form-control  tw-inline dark:tw-bg-dark-200 !important dark:tw-border-dark-400 tw-h-9 !important tw-w-96'
            type='text'
            id='filter-text-box'
            placeholder='Name'
            value={watchListName}
            onChange={handleCreate}
          />
          <button
            className='btn custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500 tw-ml-3 text-white text-sm tw-p-1'
            onClick={isEditOpen ? watchListNameUpdateHandler : createNewWListHandler}
          >
            {isEditOpen ? 'Update' : 'Create'}
          </button>
          {isEditOpen && (
            <button
              className='btn custom-btn dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-red-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500 tw-ml-3 text-white text-sm tw-p-1'
              onClick={watchListNameEditCancelHandler}
            >
              Cancel
            </button>
          )}
          <div className='tw-w-full mt-4'>
            <table className='border-collapse border border-slate-500 tw-w-full tw-table-auto tw-text-center'>
              <thead>
                <tr>
                  <th className='border border-slate-600 tw-ml ...'>Name</th>
                  <th className='border border-slate-600 tw-ml ...'>Action</th>
                </tr>
              </thead>
              <tbody>
                {watchList.categories.map((category) => {
                  const { id, name } = category

                  return (
                    <tr key={id}>
                      <td className='border border-slate-700 tw-w-10/12'>{name}</td>
                      <td className='border border-slate-700 tw-text-center'>
                        {watchListName === name ? (
                          <p className='tw-px-1 tw-text-green-500 dark:tw-font-bold'>Editing</p>
                        ) : (
                          <>
                            <FiEdit
                              className='tw-inline hover:tw-text-red-700'
                              // onClick={() => setIsEditOpen(!isEditOpen)}
                              onClick={() => watchListNameEditHandler(category)}
                            />
                            <FiTrash2
                              className='tw-inline hover:tw-text-red-700'
                              // onClick={() => setIsOpen(!isOpen)}
                              onClick={() => watchListNameRemoveHandler(category)}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Tab>

        <Tab eventKey='settings' title='Settings' className='dark:tw-text-slate-400'>
          <div className=''>
            <h2 className='tw-block tw-w-52 mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'>
              Flash Off / On
            </h2>
            <div className='tw-flex tw-justify-between tw-items-center p-2 tw-bg-slate-200  dark:tw-bg-slate-700 tw-rounded-full'>
              <span className='m-0 pe-4 ps-2 dark:tw-text-slate-200 tw-text-[14px] tw-font-bold'>
                {flash ? 'Flash On' : 'Flash off'}
              </span>
              <Switch
                onChange={flashHandler}
                checked={flash}
                height={25}
                width={48}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor='#47be7d'
                className='react-switch'
              />
            </div>
          </div>
          <hr className='tw-my-5' />
          <div className=''>
            <h2 className='tw-block tw-w-52 mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white'>
              Font Size Controll
            </h2>
            <div className='tw-flex tw-items-center tw-gap-5'>
              <button
                type='button'
                className='custom-btn 
                   dropdown-toggle btn btn-primary tw-text-white'
                onClick={() =>
                  dispatchRedux(fontSizeDecrement({ fontSize: 1, tableName: tableName }))
                }
              >
                <BsDashLg />
              </button>
              <span>Font Size ({fontSize}px)</span>
              <button
                type='button'
                className='custom-btn 
                   dropdown-toggle btn btn-primary tw-text-white'
                onClick={() =>
                  dispatchRedux(fontSizeIncrement({ fontSize: 1, tableName: tableName }))
                }
              >
                <BsPlusLg />
              </button>
            </div>
          </div>
        </Tab>
      </Tabs>
    </>
  )
}

export default TradeSettings01
