function dataFormateForSelect(data: any, val: string, lab: string) {
  return data.map((collection: any, key: any) => {
    let _data: any = {}
    _data.value = collection[val]
    _data.label = collection[lab]
    return _data
  })
}

export default dataFormateForSelect
