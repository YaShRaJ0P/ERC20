import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useAuth } from "../Hooks/useAuth";
function NavBar() {
  const auth = useAuth();

  const { login, address, connected } = auth;

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">BTB</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="dark" onClick={() => login()}>
            {connected && address ? address : "Connect Wallet."}
          </Button>
          <Navbar.Text>
            Signed in as: <a href="#login">CWS</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
