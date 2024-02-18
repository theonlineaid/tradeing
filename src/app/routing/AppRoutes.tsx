/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC, PropsWithChildren} from 'react'
import {useCookies} from 'react-cookie'
import {useSelector} from 'react-redux'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {App} from '../App'
import {AuthPage, Logout} from '../modules/auth'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {RootState} from '../redux'
import {PrivateRoutes} from './PrivateRoutes'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = import.meta.env

const AppRoutes: FC<PropsWithChildren> = () => {
  const [cookies] = useCookies(['Authorization'])
  const is_verified = useSelector((state: RootState) => state.userData?.profile?.is_verified)

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {/* {currentUser || expireToken? ( */}

          {/* {currentUser || expireToken ? ( */}
          {cookies?.Authorization && is_verified ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
