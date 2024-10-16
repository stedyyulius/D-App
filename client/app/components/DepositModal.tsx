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

  useEffect(() => {
    if (props.web3) {
      const gasPriceInWei = props.web3.utils.toBigInt(props.gasPrice); // 20 gwei
      const gasLimit = props.web3.utils.toBigInt(props.gasLimit); // 21k gas
      const gasFeeInWei = gasPriceInWei * gasLimit;
      setGasFeeInEther(+props.web3.utils.fromWei(gasFeeInWei, "ether"));
    }
  }, [props.depositAmount, props.gasPrice, props.web3, props.gasLimit]);

  return (
    <Modal show={props.show} onHide={() => props.setShow(false)}>
      <Modal.Body>
        <InputGroup.Text className="mb-3">
          <Form.Control
            placeholder="Enter Your Private Key"
            aria-label="Private Key"
            aria-describedby="basic-addon1"
            onChange={(e) => props.setPrivateKey(e.target.value)}
          />
          <Form.Control
            placeholder="Enter Amount in ETH"
            aria-label="Deposit Amount"
            aria-describedby="basic-addon1"
            onChange={(e) => props.setDepositAmount(e.target.value)}
          />
        </InputGroup.Text>
        <p>Gas Fee: {gasFeeInEther}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.setShow(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={props.onSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
