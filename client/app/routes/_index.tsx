import type { MetaFunction } from "@remix-run/node";
import { Web3 } from "web3";
import axios from "axios";

import { useCallback, useEffect, useState } from "react";
import { RegisteredSubscription } from "node_modules/web3-eth/lib/types/web3_eth";
import { PrivateKeyModal } from "../components/PrivateKeyModal";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState<Web3<RegisteredSubscription> | null>(null);
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);

  const connectMetaMask = useCallback(async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(new Web3(window.ethereum));
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else {
      console.error("MetaMask not detected.");
    }
  }, []);

  const getAccounts = useCallback(async () => {
    if (web3 !== null) {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      console.log("Connected account:", accounts[0]);
    }
  }, [web3]);

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  useEffect(() => {
    connectMetaMask();
  }, [connectMetaMask]);

  const deposit = async () => {
    try {
      if (window.ethereum && web3) {
        // const tx = {
        //   from: account,
        //   gas: web3.utils.toHex(21000),
        //   to: "0xd91ac8364e144341C1928C8302cA042DE1B8f935",
        //   value: web3.utils.toWei("0.001", "ether"),
        // };
        // console.log(tx);
        // const txHash = await window.ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [tx],
        // });

        // console.log(txHash);

        const txParams = {
          nonce: await web3.eth.getTransactionCount(account),
          gasPrice: web3.utils.toHex(20000000000), // 20 gwei
          gas: web3.utils.toHex(21000), // 21k gas
          to: "0xd91ac8364e144341C1928C8302cA042DE1B8f935",
          value: web3.utils.toWei("0.1", "ether"),
          // data: "0x", // Optional, set this if you are sending a contract call
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          txParams,
          privateKey,
        );

        const response = await axios.post("http://localhost:7500/deposit", {
          signedTx: signedTx.rawTransaction,
        });

        console.log(response);

        alert("success deposit");

        setShowPrivateKeyModal(false);
      } else {
        alert("you need to connect to metamask");
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <PrivateKeyModal
        show={showPrivateKeyModal}
        setShow={setShowPrivateKeyModal}
        setPrivateKey={setPrivateKey}
        privateKey={privateKey}
        onSubmit={deposit}
      />
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <button
          className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700"
          onClick={() => setShowPrivateKeyModal(true)}
        >
          <p className="leading-6 text-gray-700 dark:text-gray-200">DEPOSIT</p>
        </button>
      </div>
    </div>
  );
}
