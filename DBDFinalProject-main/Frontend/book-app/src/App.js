import Home from './components/Home';
import AccountProvider from './components/context/AccountProvider';
import FunctionsProvider from './components/context/FunctionsProvider';
const App = () =>{
  return (
    <FunctionsProvider>
      <AccountProvider>
        <Home/>
    </AccountProvider>
    </FunctionsProvider>
  );
}

export default App;
