import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './Header.css';
import brandlogo from '../../images/brandlogo.png';

const Header = props => {
  return (
    <>
      <Navbar className='header' bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>
            <img
              alt=""
              src={brandlogo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            /> {' '}
            Stock Price Tracker
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;