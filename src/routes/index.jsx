
import AllHouses from '../App/AllHouses';
import ForRent from '../App/ForRent';
import ForSale from '../App/ForSale';
import PrivateRoute from '../App/PrivateRoute';
import Profile from '../App/Profile';
import Home from '../Pages/Home';
import DetailedListing from '../App/DetailedListing'

export const routes = [
  { path: '/', element: <Home /> },
  {
    path: '/profile',
    element: <PrivateRoute />,
    children: [
      { path: '/profile', element: <Profile /> },
    ],
  },
  { path: '/for-sale', element: <ForSale /> },
  { path: '/for-rent', element: <ForRent /> },
  { path: '/all-houses', element: <AllHouses /> },
  { path: '/listing/:id', element: <DetailedListing /> }, // New route for detailed listing
];
