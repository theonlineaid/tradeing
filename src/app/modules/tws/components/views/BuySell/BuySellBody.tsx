import React from 'react'
import BuySellModalBody from '#tws/components/buy-sell-modal/BuySellModalBody'
import BuySellModalFooter from '#tws/components/buy-sell-modal/BuySellModalFooter'

type Props = {
  setSelectedInstrument?: any
  checked?: boolean
}
const BuySellBody: React.FC<React.PropsWithChildren<Props>> = ({
  setSelectedInstrument, checked
}) => {
  const handleSubmit = (e: any) => {}
  return (
    <>
      <BuySellModalBody isHidden={true}  setSelectedInstrument={setSelectedInstrument} checked={checked}/>
      <BuySellModalFooter isHidden={true} onConfirm={handleSubmit} />
    </>
  )
}

export default BuySellBody
