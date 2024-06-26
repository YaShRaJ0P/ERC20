import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
const ApproveToken = ({
  address,
  contract,
  provider,
  tokenInfo,
  reload,
  setReload,
}) => {
  const [data, setData] = useState({
    account: "",
    value: 0,
  });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const actionApprove = () => {
    // Approve token
    if (data.value <= 0) {
      alert("Invalid Token.");
      return;
    }
    if (data.account === "") {
      alert("Invalid Account.");
      return;
    }
    if (provider) {
      try {
        const value = Number(data.value) * 10 ** Number(tokenInfo.decimals);
        contract._methods
          .approve(data.account, value)
          .send({ from: address })
          .on("transactionHash", function (hash) {
            console.log("approve hash : ", hash);
          })
          .on("receipt", function (receipt) {
            console.log("approve receipt : ", receipt);
            setReload(!reload);
            setData({
              account: "",
              value: 0,
            });
          })
          .on("error", function (error) {
            console.log("approve error : ", error);
          });
      } catch (error) {
        console.log("Error actionApprove : ", error);
      }
    }
  };
  return (
    <div className="my-5">
      <h2>Approve</h2>
      <Row className="gap-1">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Spender"
            name="account"
            value={data.account}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Amount"
            name="value"
            value={data.value}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <Button onClick={() => actionApprove()}>Approve</Button>
        </Col>
      </Row>
    </div>
  );
};

export default ApproveToken;
