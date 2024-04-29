import './App.css';
import Footer from './components/Footer';
import Topbar from './components/Topbar';
import UserProvider from './context/UserProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import Shows from './pages/Shows';
import PrivateRoute from './pages/PrivateRoute';
import Group from './pages/Group';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Favourite from './pages/Favourite';
import Register from './pages/Register';
import Reviews from './pages/Reviews';
import Logout from './pages/Logout';
import Sharedfavourites from './pages/Sharedfavourites';
import GroupContent from './pages/GroupContent';

function App() {
  return (
    <Router>
      <UserProvider>
        <Topbar/>
        <div className='container'>
          <Routes>
            <Route path='/' exact element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register />} />
            <Route path='/search' element={<Search />} />
            <Route path='/shows' element={<Shows />} />
            <Route path='/reviews' element={<Reviews />} />
            <Route path='/group' element={<Group />} />
            <Route path='/sharedfavourite' element={<Sharedfavourites />} />
            <Route element={<PrivateRoute />}>
              <Route path="/group/:groupId" element={<GroupContent />}/>
              <Route path='/profile' element={<Profile />} />
              <Route path='/favourite' element={<Favourite />} />
              <Route path='/logout' element={<Logout />} />
            </Route>


            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
