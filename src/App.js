import './App.css';
import Home from './pages/Home';
import LeaderBoard from './pages/LeaderBoard';
import NewQuestion from './pages/NewQuestion';
import Poll from './pages/Poll';
import Signin from './pages/Signin';
import Nav from './components/Nav';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUsers } from './reducers/users';
import Auth from './components/Auth';
import { fetchQuestions } from './reducers/questions';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsers);
    dispatch(fetchQuestions);

  }, [dispatch]);
  return (
    <div className='App'>
      <Router>
        <Nav />
        <Switch>
          <Route exact path='/'>
            <Auth>
              <Home />
            </Auth>
          </Route>
          <Route exact path='/question'>
            <Auth>
              <NewQuestion />
            </Auth>
          </Route>
          <Route exact path='/question/:id'>
            <Auth>
              <Poll />
            </Auth>
          </Route>
          <Route exact path='/leaderboard'>
            <Auth>
              <LeaderBoard />
            </Auth>
          </Route>
          <Route exact path='/signin'>
            <Signin />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
