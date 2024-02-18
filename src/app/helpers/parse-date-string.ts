import {isDate, parse} from 'date-fns'

function parseDateString(value, originalValue) {
  const parseDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'yyyy-mm-dd', new Date())
  return parseDate
}

export default parseDateString
