/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC, PropsWithChildren} from 'react'
import {KTSVG, defaultAlerts, toAbsoluteUrl} from '../../../helpers'

const HeaderNotificationsMenu: FC<PropsWithChildren> = () => (
  <div
    className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
    data-kt-menu='true'
  >
    <div
      className='tw-flex tw-flex-column bgi-no-repeat rounded-top'
      style={{
        backgroundImage: `url('${toAbsoluteUrl('/media/logos/pattern-1.jpg')}')`,
        backgroundPosition: 'center',
        backgroundColor: '#3954BB'
      }}
    >
      <h3 className='tw-text-slate-100 tw-font-semibold px-6 my-6'>
        Notifications <span className='tw-font-md opacity-75 tw-ps-3'>24 reports</span>
      </h3>
    </div>

    <div className='notifications dark:tw-bg-dark-200'>
      <div className='scroll-y mh-325px mt-5 px-8  tw-border-b dark:tw-border-b-slate-700'>
        {defaultAlerts.map((alert, index) => (
          <div key={`alert${index}`} className='tw-flex  flex-stack py-3'>
            <div className='tw-flex align-items-center'>
              <div className='symbol symbol-35px me-4'>
                <span className={clsx('symbol-label', `bg-light-${alert.state}`)}>
                  <KTSVG
                    path={`/media/${alert.icon}`}
                    className={`svg-icon-2 svg-icon-${alert.state}`}
                  />
                </span>
              </div>

              <div className='mb-0 me-2'>
                <a
                  href='#'
                  className='dropdown-title dark:tw-text-slate-300 tw-text-md tw-font-bold'
                >
                  {alert.title}
                </a>
                <div className='text-gray-400 tw-text-sm'>{alert.description}</div>
              </div>
            </div>

            <span className='badge badge-light dark:tw-bg-dark-400 dark:tw-text-slate-400 tw-text-xs'>
              {alert.time}
            </span>
          </div>
        ))}
      </div>

      <div className='tw-p-4 tw-text-center'>
        <button className='dark:tw-text-white tw-px-4 tw-py-2 tw-border-0 tw-rounded dark:tw-bg-dark-400 hover:tw-bg-slate-700 tw-bg-slate-200'>
          View All
        </button>
      </div>
    </div>
  </div>
)

export {HeaderNotificationsMenu}
