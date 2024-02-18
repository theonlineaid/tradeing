import FontSizeControl from '#common/components/FontSizeControl'

const ExecutionSettings = ({checkData, handleCheckData, tableName}) => {
  return (
    <>
      {/* font size */}
      <FontSizeControl tableName={tableName} />
    </>
  )
}

export default ExecutionSettings
