/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import MobileNav from './mobileMenu';
import { useContext } from 'react';
import { navContext } from './Helpers/Context';


const NavBar = () => {

  const {isActive, setIsActive, navItems, showMenu, setShowMenu} = useContext(navContext)
  return (
    <>
      <nav className=" top-0 hidden w-full items-center justify-between bg-white lg:order-1 lg:mt-0 lg:flex lg:w-auto font-menu">
        <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setIsActive(item.id);
                  let page = document.getElementById(item.title);
                  const yOffset = -72;
                  const y = page?.getBoundingClientRect()?.top + window.scrollY + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }}
                className={`${
                  isActive === item.id ? 'border-secondary text-primary' : 'border-transparent'
                } block rounded border-b px-2 py-1 hover:border-secondary hover:text-primary`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <MobileNav
        navItems={navItems}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    </>
  );
};

export default NavBar;
