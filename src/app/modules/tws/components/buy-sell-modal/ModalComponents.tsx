import React, {MutableRefObject, useRef, useState} from 'react'
import BuySellModalBody from './BuySellModalBody'
import BuySellModalFooter from './BuySellModalFooter'
import BuySellConfirmation from './BuySellConfirmation'
import { useDispatch } from 'react-redux'
import { changeIsBuy } from '#store/slices/buysell'

interface ModalComponentProps {
  handleSubmit: (event) => void
  handleClose: (event) => void
  buySell:any
  isConfirmationVisible:any
}

const ModalComponents: React.FC<ModalComponentProps> = ({handleSubmit, handleClose, isConfirmationVisible, buySell}) => {
  const ref = useRef(null)
  // const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const dispatch = useDispatch()

  // const handleConfirm = () => {
  //   console.log('click')

  //   setIsConfirmationVisible(true)
  // }

  return (
    <div className='tw-relative' ref={ref}>
      {isConfirmationVisible && (
        <BuySellConfirmation
          width={(ref.current as any)?.clientWidth}
          height={(ref.current as any)?.clientHeight}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          companyCode={buySell.modalData?.short_name}
          clientCode={buySell.clientCode}
          quantity={buySell.buySellApi?.qty}
          price={buySell.buySellApi?.price}
        />
      )}
      <BuySellModalBody />
      <BuySellModalFooter onConfirm={handleClose} />
    </div>
  )
}

export default ModalComponents
