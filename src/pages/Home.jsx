import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { useAuth } from "../Hooks/useAuth";
import { Link } from "react-router-dom";
import TransferToken from "./TransferToken";
import ApproveToken from "./ApproveToken";
const Home = () => {
  const [tokenInfo, settokenInfo] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
    balance: "",
    decimals: "",
  });
  const [list, setList] = useState([]);
  const [reload, setReload] = useState(true);

  const { address, provider, contract } = useAuth();
  const handleGetTokenInfo = async () => {
    try {
      const tokenName = await contract._methods.name().call();
      const tokenSymbol = await contract._methods.symbol().call();
      const tokenTotalSupply = await contract._methods.totalSupply().call();
      const tokenBalance = await contract._methods.balanceOf(address).call();
      const tokenDecimals = await contract._methods.decimals().call();
      settokenInfo({
        name: tokenName,
        symbol: tokenSymbol,
        totalSupply: Number(tokenTotalSupply) / 10 ** Number(tokenDecimals),
        balance: Number(tokenBalance) / 10 ** Number(tokenDecimals),
        decimals: Number(tokenDecimals),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getTransferEvent = async () => {
    if (provider) {
      try {
        const transferList = await contract.getPastEvents("Transfer", {
          fromBlock: 0,
          toBlock: "latest",
        });
        setList(transferList);
        console.log(transferList);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    handleGetTokenInfo();
    getTransferEvent();
  }, [provider, reload]);
  return (
    <Container className="my-5">
      <Row className="gap-1">
        <Col xs={6} md={4}>
          <Card>
            <Card.Body>
              <Card.Title>
                Token : {tokenInfo.name} {tokenInfo.symbol}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Max Supply : {tokenInfo.totalSupply}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4}>
          <Card>
            <Card.Body>
              <Card.Title>
                Balance : {tokenInfo.balance} {tokenInfo.symbol}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <hr />
      <TransferToken
        address={address}
        contract={contract}
        provider={provider}
        tokenInfo={tokenInfo}
        reload={reload}
        setReload={setReload}
      />
      <hr />
      <ApproveToken
        address={address}
        contract={contract}
        provider={provider}
        tokenInfo={tokenInfo}
        reload={reload}
        setReload={setReload}
      />
      <hr />
      <div className="my-5">
        <h3>Transactions</h3>
        <Table striped>
          <thead>
            <th>#</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Explore</th>
          </thead>
          <tbody>
            {list &&
              list.length > 0 &&
              list.map((item, key) => {
                return (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{item.returnValues.from}</td>
                    <td>{item.returnValues.to}</td>
                    <td>
                      {Number(item.returnValues.value) /
                        10 ** Number(tokenInfo.decimals)}{" "}
                      {tokenInfo.symbol}
                    </td>
                    <td>
                      <Link
                        to={`https://sepolia.etherscan.io/tx/${item.transactionHash}`}
                        target="_blank"
                      >
                        Explore
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Home;
