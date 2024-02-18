import {MarketDataType} from '#common/types/market-data'
import {MarketDataContext} from '#context/marketDataContext'
import {RootState} from '#store/index'
import {changeBlotter, changeBuySell, changeExecution} from '#store/slices/headerData'
import {changeInstrumentName} from '#store/slices/linkedTable'
import _ from 'lodash'
import {useContext, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Select from 'react-select'
interface Props {
  layout?: any
}

const ClientSelect: React.FC<React.PropsWithChildren<Props>> = ({layout}) => {
  // States
  const [value, setValue] = useState('')
  const {marketDatas} = useContext(MarketDataContext) as MarketDataType
  // const options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ]
  let options: any = [
    {label: 'All Client', value: ''},
    {label: 'ABC', value: '123'},
    {label: 'DEF', value: '456'},
    {label: 'GHI', value: '789'},
  ]
  // options= marketDatas?.map(item => {return {
  //   'label': item?.short_name, 'value': item?.short_name
  // }})
  const dispatch = useDispatch()
  const {linkedTable, global, headerData} = useSelector((state: RootState) => state)
  const targetHeight = 25

  const styles = {
    control: (base: any) => ({
      ...base,
      minHeight: 'initial',
      minWidth: '150px',
      textAlign: 'left',
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: `${targetHeight - 1 - 1}px`,
      padding: '0 8px',
      borderRadius: '5px',
      color: global?.mode === 'dark' ? '#FFF !important;' : '',
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    input: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    menu: (base: any) => ({
      ...base,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    clearIndicator: (base: any) => ({
      ...base,
      fontSize: '10px',
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
  }

  const reduxFunctions = (e) => {
    const filteredData = _.find(marketDatas, (item) => item?.short_name === e.value)
    // dispatch(changeActionName('main'))
    // dispatch(changeModalData(filteredData))
    switch (layout?.i) {
      case 'buy_sell':
        dispatch(changeBuySell(e))
        dispatch(changeInstrumentName('md-' + e.value))
        break
      case 'blotter_INDIVIDUAL':
        dispatch(changeBlotter(e))
        dispatch(changeInstrumentName('bt-' + e.value))
        break
      case 'execution_INDIVIDUAL':
        dispatch(changeExecution(e))
        dispatch(changeInstrumentName('exe-' + e.value))
        break

      default:
        break
    }
    // dispatch(changeInstrumentName(layout?.i === 'buy_sell' ? 'md-'+ e.value : layout?.i === 'blotter_INDIVIDUAL' ? 'bt-'+ e.value : ''  ))
  }

  const returnValue = () => {
    switch (layout?.i) {
      case 'buy_sell':
        return headerData?.buySell
        break
      case 'blotter_INDIVIDUAL':
        return headerData?.blotter
        break
      case 'execution_INDIVIDUAL':
        return headerData?.execution
        break

      default:
        return null
        break
    }
  }

  const handleChange = (e: any) => {
    if (!e) return
    //   switch (layout?.i) {
    //     case 'buy_sell':
    //       dispatch(changeBuySell(e))
    //       break;
    //     case 'blotter_INDIVIDUAL':
    //       dispatch(changeBlotter(e))
    //       break;
    //     case 'execution_INDIVIDUAL':
    //       dispatch(changeExecution(e))
    //       break;

    //     default:
    //       break;
    //   }
    //   dispatch(changeInstrumentName(''))
    //  }
    //   reduxFunctions(e)
    console.log(e.value)
  }
  //   const onChange = (_, { action }) => {
  //     action === "clear" && setTimeout(() => selectRef.current.select.blur(), 1);
  //   };
  return (
    <Select
      className='basic-single'
      classNamePrefix='select'
      isClearable={true}
      styles={styles}
      isSearchable={true}
      name='client'
      placeholder='Client'
      // value={returnValue()}
      // value={linkedTable?.instrumentName !== '' ? linkedTable?.instrumentName.split('-')[1] : ''}
      onChange={(e) => handleChange(e)}
      options={options}
    />
  )
}

export default ClientSelect
