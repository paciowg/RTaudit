import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RTaudit from '../pages/RTaudit/RTaudit';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={RTaudit} />
        <Route exact path='/details' component={RTaudit} />
      </Switch>
    </Router>
  );
}

export default App;
