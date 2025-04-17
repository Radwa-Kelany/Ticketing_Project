import Link from 'next/link';
import classes from './main-header.module.css';
import { usePathname } from 'next/navigation';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars } from '@fortawesome/free-solid-svg-icons';

const Header = ({ currentUser }) => {
  let path = usePathname();
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },

    currentUser && {
      label: `Hi, ${currentUser.username}`,
      href: '/profile/profile',
    },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={label}>
          <Link
            className={
              path.startsWith(`${href}`)
                ? `${classes.active} nav-link  fs-5 text-white`
                : 'nav-link fs-5 text-white'
            }
            href={href}
          >
            {label}
          </Link>
        </li>
      );
    });
  return (
    <div
      className="container-fluid d-flex justify-content-sm-between align-content-center p-2 shadow"
      style={{ background: '#009eb7' }}
    >
      <Link className="ms-5 nav-link text-white" href="/">
        <h1>Ticketing</h1>
      </Link>

      <Link className={`${classes.menu} me-5 mt-2`} href="">
        {/* <FontAwesomeIcon icon={faBars} className={`${classes.bar}`} /> */}
      </Link>

      <nav className={classes.navb}>
        <ul className="nav">{links}</ul>
      </nav>
    </div>
  );
};

export default Header;
