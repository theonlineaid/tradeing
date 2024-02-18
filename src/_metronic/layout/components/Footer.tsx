import {FC, PropsWithChildren} from 'react'

const Footer: FC<PropsWithChildren> = () => {
  return (
    <div className='tw-text-black tw-text-center dark:tw-bg-dark-200 py-4'>
      <span className='text-muted tw-font-bold me-1'>{new Date().getFullYear()} ©</span>
      <a
        href='https://benemoysecurities.com/'
        rel='noreferrer'
        target='_blank'
        className='tw-text-gray-800 hover:tw-text-primary dark:tw-text-sky-500'
      >
        Benemoy
      </a>
    </div>
  )
}

export {Footer}
