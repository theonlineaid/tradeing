export const stringArrayToString = (data: string | string[]) => {
  if (typeof data === 'string') {
    return data
  }
  return data.flat()
}
