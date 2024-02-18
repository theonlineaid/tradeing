import FontSizeControl from '#common/components/FontSizeControl'

const PurchasePowerSettings = ({checkData, handleCheckData, tableName}) => {
  return (
    <>
      {/* font size */}
      <FontSizeControl tableName={tableName} />
    </>
  )
}

export default PurchasePowerSettings
