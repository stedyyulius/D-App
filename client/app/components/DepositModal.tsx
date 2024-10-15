import { Button, Form, InputGroup, Modal } from "react-bootstrap";

type PrivateKeyModalProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  setPrivateKey: (value: string) => void;
  setDepositAmount: (value: string) => void;
  onSubmit: () => void;
};

export const DepositModal = (props: PrivateKeyModalProps) => {
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
