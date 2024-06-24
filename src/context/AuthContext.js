import { createContext, useEffect, useState } from "react";
import Web3, { Contract } from "web3";
import abi from "./artifacts/abi.json";
const defaultProvider = {
  address: null,
  connected: false,
  provider: null,
  contract: null,
  loading: true,
  setAddress: () => null,
  setProvider: () => null,
  setLoading: () => null,
  login: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const [address, setAddress] = useState(defaultProvider.address);
  const [connected, setConnected] = useState(defaultProvider.connected);
  const [provider, setProvider] = useState(defaultProvider.provider);
  const [contract, setContract] = useState(defaultProvider.contract);
  const [loading, setLoading] = useState(defaultProvider.loading);

  useEffect(() => {
    const initAuth = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        console.log(web3);
        const accounts = await web3.eth.getAccounts();
        const contractInst = new Contract(
          abi,
          "0xaa13328FeACd20eaD7489D7814b419Ed7341B93B",
          web3
        );
        console.log(contractInst);
        setContract(contractInst);
        setAddress(accounts[0]);
        setProvider(web3);
        setConnected(true);
      } else {
        alert("Connect metamask");
      }
    };
    initAuth();
  }, []);

  const handleLogin = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        setProvider(web3);
        setConnected(true);
      } else {
        alert("Please install MetaMask");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const values = {
    address,
    connected,
    provider,
    contract,
    loading,
    setAddress,
    setLoading,
    login: handleLogin,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
