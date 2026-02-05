import { ConfigProvider, Layout } from 'antd';
import ProductList from './pages/ProductList';
import Header from './components/Header';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f9b17a',
          colorBgBase: '#2d2250',
          colorTextBase: '#ffffff',
          colorBgContainer: '#576f9d',
          // Note: Ant Design might use colorBgContainer for card backgrounds, 
          // let's ensure text on top of it is readable.
        },
      }}
    >
      <div className="App">
        <Header />
        <ProductList />
      </div>
    </ConfigProvider>
  );
}

export default App;