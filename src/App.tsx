import WalletManager from './components/WalletManager';
import { WalletProvider } from './context/WalletContext'
import './App.css'

const App: React.FC = () => {
  return (
    <WalletProvider>
      <div className="App">
        <WalletManager />
      </div>
    </WalletProvider>
  );
};

export default App
