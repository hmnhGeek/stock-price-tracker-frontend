import React from 'react';
import StockPriceDisplay from './components/StockPriceDisplay/StockPriceDisplay';
import { Container } from 'react-bootstrap';
import Header from './components/Header/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <Container>
        <StockPriceDisplay />
      </Container>
    </div>
  );
}

export default App;
