import FontSizeControl from '#common/components/FontSizeControl'
import SelectBox from '#tws/components/common/SelectBox'

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

const externalFilterChanged = (e) => {
  console.log(e.target.value)
}

const OrderSummerySettings = ({checkData, handleCheckData, gridRef, tableName}) => {
  return (
    <>
      <div>
        <SelectBox
          // externalFilterChanged={externalFilterChanged}
          name='type'
          label='Select a Side'
          option={sideOption}
        />
        <SelectBox
          // externalFilterChanged={externalFilterChanged}
          name='status'
          label='Select a Status'
          option={statusOption}
        />
      </div>

      {/* font size */}
      <FontSizeControl tableName={tableName} />
    </>
  )
}

export default OrderSummerySettings
