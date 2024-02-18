import FontSizeControl from '#common/components/FontSizeControl'
import {changeSource, changeStatus, changeType} from '#store/slices/blotter'
import SelectBox from '#tws/components/common/SelectBox'
import {useCallback} from 'react'
import {useDispatch} from 'react-redux'

const sourceOption = [
  {value: 'All', label: 'All'},
  {value: 'Main', label: 'Main'},
  {value: 'SM', label: 'SM'},
  {value: 'ATB', label: 'ATB'},
]
const sideOption = [
  {value: 'All', label: 'All'},
  {value: 'Buy', label: 'Buy'},
  {value: 'Sell', label: 'Sell'},
]
const statusOption = [
  {value: 'All', label: 'All'},
  {value: 'Working', label: 'Working'},
  {value: 'Filled', label: 'Filled'},
  {value: 'Terminated', label: 'Terminated'},
]
const BlotterSettings = ({checkData, handleCheckData, gridRef, tableName}) => {
  const dispatch = useDispatch()
  const externalFilterChanged = useCallback((e) => {
    switch (e.target?.name) {
      case 'type':
        dispatch(changeType(e.target?.value))
        break
      case 'status':
        dispatch(changeStatus(e.target?.value))
        break
      case 'source':
        dispatch(changeSource(e.target?.value))
        break

      default:
        break
    }
    gridRef.current.api.onFilterChanged()
  }, [])
  return (
    <>
      <div>
        <SelectBox
          externalFilterChanged={externalFilterChanged}
          name='type'
          label='Select a Side'
          option={sideOption}
        />
        <SelectBox
          externalFilterChanged={externalFilterChanged}
          name='status'
          label='Select a status'
          option={statusOption}
        />
        <SelectBox
          externalFilterChanged={externalFilterChanged}
          name='source'
          label='Select a source'
          option={sourceOption}
        />

        {/* font size */}
        <FontSizeControl tableName={tableName} />
      </div>
    </>
  )
}

export default BlotterSettings
