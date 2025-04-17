import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/header';
import buildClient from '../utils/api-requests/build-client';
import { usePathname } from 'next/navigation';
const AppComponent = ({ Component, pageProps, currentUser }) => {
    let path = usePathname();
    const hideHeader = path.startsWith('/auth/signup') || path.startsWith('/auth/signin');
  return (
    <div>
      {!hideHeader && <Header currentUser={currentUser} />}
      <Component currentUser={currentUser} {...pageProps}></Component>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/v1/auth/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {pageProps, ...data };
};
export default AppComponent;
