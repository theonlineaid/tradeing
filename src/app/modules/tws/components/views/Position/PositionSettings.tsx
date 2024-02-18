import FontSizeControl from '#common/components/FontSizeControl'

const PositionSettings = ({checkData, handleCheckData, tableName}) => {
  return (
    <>
      {/* font size */}
      <FontSizeControl tableName={tableName} />
    </>
  )
}

export default PositionSettings
