import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { Web3 } from "web3";
import { RegisteredSubscription } from "node_modules/web3-eth/lib/types/web3_eth";
import { useEffect, useState } from "react";

type PrivateKeyModalProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  setPrivateKey: (value: string) => void;
  setDepositAmount: (value: string) => void;
  onSubmit: () => void;
  gasPrice: number;
  gasLimit: number;
  web3: Web3<RegisteredSubscription> | null;
  depositAmount: string;
};

export const DepositModal = (props: PrivateKeyModalProps) => {
  const [gasFeeInEther, setGasFeeInEther] = useState(0);

  const {
    show,
    setShow,
    setPrivateKey,
    setDepositAmount,
    onSubmit,
    gasPrice,
    gasLimit,
    web3,
    depositAmount,
  } = props;

  useEffect(() => {
    if (web3) {
      const gasPriceInWei = web3.utils.toBigInt(gasPrice);
      const gasPriceLimit = web3.utils.toBigInt(gasLimit);
      const gasFeeInWei = gasPriceInWei * gasPriceLimit;
      setGasFeeInEther(+web3.utils.fromWei(gasFeeInWei, "ether"));
    }
  }, [depositAmount, gasPrice, web3, gasLimit]);

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Body>
        <InputGroup.Text className="mb-3">
          <Form.Control
            placeholder="Enter Your Private Key"
            aria-label="Private Key"
            aria-describedby="basic-addon1"
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <Form.Control
            placeholder="Enter Amount in ETH"
            aria-label="Deposit Amount"
            aria-describedby="basic-addon1"
            onChange={(e) => setDepositAmount(e.target.value)}
          />
        </InputGroup.Text>
        <p>Gas Fee: {gasFeeInEther}</p>
        <p className="text-red-500">
          Total Price in ETH: {gasFeeInEther + +depositAmount}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
