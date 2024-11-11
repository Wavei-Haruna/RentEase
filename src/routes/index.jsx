import ForRent from '../App/ForRent';
import ForSale from '../App/ForSale';
import PrivateRoute from '../App/PrivateRoute';
import Profile from '../App/Profile';
import Home from '../Pages/Home';
import DetailedListing from '../App/DetailedListing';
import ForHostels from '../App/ForHostels';
import GetStarted from '../Components/Modals/getStarted';

export const routes = [
  { path: '/', element: <Home /> },
  {
    path: '/profile',
    element: <PrivateRoute />,
    children: [{ path: '/profile', element: <Profile /> }],
  },
  { path: '/for-sale', element: <ForSale /> },
  { path: '/for-rent', element: <ForRent /> },
  { path: '/hostels', element: <ForHostels /> },
  { path: '/listing/:id', element: <DetailedListing /> }, // New route for detailed listing
  { path: '/register-with-rent-ease', element: <GetStarted /> }, // New route for detailed listing
];
