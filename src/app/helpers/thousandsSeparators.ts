function thousandsSeparators(number) {
  let numberString = number.toString()

  // Split the number into integer and decimal parts (if any)
  let parts = numberString.split('.')

  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Join the integer and decimal parts back together
  return parts.join('.')
}

export default thousandsSeparators
