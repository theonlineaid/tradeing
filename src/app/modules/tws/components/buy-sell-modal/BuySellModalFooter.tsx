import {RootState} from '#store/index'
import {Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {changeIsShow} from '../../../../redux/slices/buysell'

interface Props {
  isHidden?: boolean
  onConfirm: (e: any) => void
}
const BuySellModalFooter: React.FC<React.PropsWithChildren<Props>> = ({
  onConfirm,
  isHidden = false,
}) => {
  const {buySell} = useSelector((state: RootState) => state)
  const dispatch = useDispatch()

  return (
    <div className='tw-flex tw-justify-between tw-flex-row-reverse tw-items-center tw-pt-2'>
      {!isHidden && (
        <>
          <ul className='tw-flex ps-5'>
            <li className='tw-footer-option'>
              <p className='mb-1 dark:tw-text-slate-300'>Order Value ....</p>
              <h6 className='dark:tw-text-slate-400'>0.00</h6>
            </li>
            {/* <li className='tw-footer-option'>
              <p className='mb-1 dark:tw-text-slate-300'>Commission</p>
              <h6 className='dark:tw-text-slate-400'>0.00</h6>
            </li> */}
            <li className='tw-footer-option'>
              <p className='mb-1 dark:tw-text-slate-300'>Net Value</p>
              <h6 className='dark:tw-text-slate-400'>0.00</h6>
            </li>
          </ul>
          <div>
            <button className='btn btn-outline-primary text-white text-sm' onClick={onConfirm}>
              Confirm 
            </button>
            <button
              type='button'
              className='btn tw-text-gray-400 hover:tw-bg-slate-100 dark:hover:tw-bg-dark-500 ms-2'
              onClick={() => dispatch(changeIsShow())}
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default BuySellModalFooter
