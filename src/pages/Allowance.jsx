import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
const Allowance = ({ contract, provider, tokenInfo }) => {
  const [data, setData] = useState({
    owner: "",
    spender: "",
  });
  const [allowance, setAllowance] = useState(0);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const actionAllowance = async () => {
    if (data.owner === "") {
      alert("Invalid Owner Address.");
      return;
    }
    if (data.spender === "") {
      alert("Invalid Spender Address.");
      return;
    }
    if (provider) {
      try {
        const amount = await contract._methods
          .allowance(data.owner, data.spender)
          .call();
        setAllowance(Number(amount) / 10 ** Number(tokenInfo.decimals));
      } catch (error) {
        console.log("Error actionApprove : ", error);
      }
    }
  };
  return (
    <div className="my-5">
      <h2>Allowance</h2>
      <Row className="gap-1">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Owner"
            name="owner"
            value={data.account}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Spender"
            name="spender"
            value={data.value}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <Button onClick={() => actionAllowance()}>Approve</Button>
        </Col>
      </Row>
      <Row>
        <strong>
          Allowance amount : {allowance} {tokenInfo.symbol}
        </strong>
      </Row>
    </div>
  );
};

export default Allowance;
