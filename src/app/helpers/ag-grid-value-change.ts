function agGridValueChange(ref: any, updateValue: any[]) {
  if (!ref.current) return

  for (let i = 0; i < updateValue.length; i++) {
    const currentValue = updateValue[i]
    const rowNode = ref.current!.api.getRowNode(currentValue.id)
    if (!rowNode) continue
    const fields = ['high', 'low', 'lpt', 'volume', 'ycp', 'change', 'change_per']

    fields.map((item) => updateRow(rowNode, currentValue, item))
  }
}

const updateRow = async (rowNode, currentValue, item) => {
  rowNode.setDataValue(item, currentValue[item])
}

export default agGridValueChange
