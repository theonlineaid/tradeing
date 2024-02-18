import axios from 'axios'
import {Suspense, useEffect, useRef} from 'react'
import {useCookies} from 'react-cookie'
import {useDispatch} from 'react-redux'
import {Outlet} from 'react-router'
import {useToggle} from 'react-use'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {AuthInit} from './modules/auth'

const App = () => {
  const dispatch = useDispatch()
  const [cookies] = useCookies(['Authorization'])
  const ref = useRef(null)
  const [show, toggle] = useToggle(false)

  useEffect(() => {
    // document.body.style.zoom = "85%";
    //     document.body.style['--zoom'] = '.85';
    // document.body.style.fontSize = `calc(16px * var(--zoom))`
  }, [])

  if (cookies?.Authorization) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + cookies.Authorization
  }

  return (
    <main className='dark:tw-bg-dark-100' ref={ref}>
      <Suspense fallback={<LayoutSplashScreen />}>
        <I18nProvider>
          <LayoutProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </LayoutProvider>
        </I18nProvider>
      </Suspense>
    </main>
  )
}

export {App}
