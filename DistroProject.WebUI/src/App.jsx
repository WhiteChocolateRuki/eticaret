import { ConfigProvider, Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import Home from './pages/Home';
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

        },
      }}
    >
      <div className="app-container">
        <div className="content-container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;