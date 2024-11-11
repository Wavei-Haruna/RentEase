/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { navContext } from './Helpers/Context';
import LogImg from '../assets/Images/logo.png';

const Logo = () => {
  const { setIsActive } = useContext(navContext);
  return (
    <div>
      <Link
        onClick={(e) => {
          e.preventDefault();
          setIsActive(1);
          let page = document.getElementById('Home');
          const yOffset = -72;
          const y = page?.getBoundingClientRect()?.top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }}
        className="flex items-center"
      >
        <img src={LogImg} alt="our logog"  className='h-12'/>
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold text-secondary">Sate Consult</span> */}
      </Link>
    </div>
  );
};
export default Logo;
