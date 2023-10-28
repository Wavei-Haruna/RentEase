
import PrivateRoute from '../App/PrivateRoute';
import Profile from '../App/Profile';
import Home from '../Pages/Home';


export const routes = [
  { path: '/', element: <Home /> },
 
  {
    path: '/profile',
    element: <PrivateRoute />,
    // don't forget to pass the children to it as it is necessary.
    children: [
      { path: '/profile', element: <Profile /> },
    ],
  },
];
