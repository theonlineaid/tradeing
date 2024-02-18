import {useState} from 'react'
import {Link} from 'react-router-dom'
import {TemplateSettings} from './TemplateSettings'
import {TwsSettings} from './TwsSettings'

const GeneralSettingsTab: React.FC<React.PropsWithChildren> = () => {
  const [TemplateTab, setTemplateTab] = useState<any>(true)
  const [TwsTab, setTwsTab] = useState<any>()

  const ShowHideTab = (params: any) => {
    if (params === 'Template') {
      setTemplateTab(true)
      setTwsTab(false)
    }
    if (params === 'TWS') {
      setTwsTab(true)
      setTemplateTab(false)
    }
  }

  return (
    <>
      <div className='container'>
        <div className='card my-2 my-xl-3'>
          <div className='card-header ps-0'>
            <div className='trade-tabs d-flex overflow-auto'>
              <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-6 fw-bold flex-nowrap'>
                <li className='nav-item'>
                  <Link
                    className={`nav-link secondary-bg px-4 ` + (TemplateTab && 'active')}
                    to='#'
                    onClick={(e) => ShowHideTab('Template')}
                  >
                    Template Settings
                  </Link>
                </li>

                <li className='nav-item'>
                  <Link
                    className={`nav-link secondary-bg px-4 ` + (TwsTab && 'active')}
                    to='#'
                    onClick={(e) => ShowHideTab('TWS')}
                  >
                    TWS Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <form className='form'>
            {TemplateTab && <TemplateSettings />}
            {TwsTab && <TwsSettings />}
          </form>
        </div>
      </div>
    </>
  )
}

export {GeneralSettingsTab}
