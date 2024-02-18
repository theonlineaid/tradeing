/**
 * Title: Single News Item Component
 * Description: Here you can show the single news item details
 * Developer: Mks Tamin
 * Date: 11-12-2023
 */

interface Props {
  selectedInstrument: any
  modalHandler?: any
  show?: boolean
}

const SingleNews: React.FC<Props> = ({selectedInstrument, modalHandler, show}) => {
  return (
    <div className='tw-w-full tw-min-h-[200px] tw-border tw-bg-white tw-absolute tw-top-0 tw-left-0 tw-z-50 tw-shadow-2xl'>
      <div className='tw-flex tw-items-center tw-justify-between tw-bg-slate-300 tw-py-4 tw-px-5'>
        <div className='tw-flex tw-gap-5'>
          <h2>Title: {selectedInstrument.title}</h2>
          <h2>FirmId: {selectedInstrument.firmId}</h2>
          <h2>NewsId: {selectedInstrument.newsId}</h2>
        </div>
        {show && <button onClick={modalHandler}>close</button>}
      </div>
      <div className='tw-mt-5 tw-px-2 tw-pb-10'>
        <p>{selectedInstrument.newsText}</p>
      </div>
    </div>
  )
}

export default SingleNews
