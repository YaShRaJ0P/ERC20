import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
const TransferFrom = ({
  address,
  contract,
  provider,
  tokenInfo,
  reload,
  setReload,
}) => {
  const [data, setData] = useState({
    sender: "",
    recipient: "",
    amount: 0,
  });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const actionTransferFrom = async () => {
    // Transfer token
    if (data.amount <= 0) {
      alert("Invalid Token.");
      return;
    }
    if (data.recipient === "") {
      alert("Invalid Account.");
      return;
    }
    if (data.sender === "") {
      alert("Invalid Account.");
    }
    if (provider) {
      try {
        const value = Number(data.amount) * 10 ** Number(tokenInfo.decimals);
        await contract._methods
          .transferFrom(data.sender, data.recipient, value)
          .send({ from: address })
          .on("transactionHash", function (hash) {
            console.log("transferFrom hash : ", hash);
          })
          .on("receipt", function (receipt) {
            console.log("transferFrom receipt : ", receipt);
            setReload(!reload);
            setData({
              sender: "",
              recipient: "",
              amount: 0,
            });
          })
          .on("error", function (error) {
            console.log("error : ", error);
          });
      } catch (error) {
        console.log("Error actionTransfer : ", error);
        alert("Transaction failed.");
      }
    }
  };
  return (
    <div className="my-5">
      <h2>Transfer From</h2>
      <Row className="gap-1">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Sender"
            name="sender"
            value={data.account}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Recipient"
            name="recipient"
            value={data.account}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Amount"
            name="amount"
            value={data.value}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <Button onClick={() => actionTransferFrom()}>Transfer</Button>
        </Col>
      </Row>
    </div>
  );
};

export default TransferFrom;
