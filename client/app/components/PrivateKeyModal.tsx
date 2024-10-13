import { Button, Form, InputGroup, Modal } from "react-bootstrap";

type PrivateKeyModalProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  privateKey: string;
  setPrivateKey: (value: string) => void;
  onSubmit: () => void;
};

export const PrivateKeyModal = (props: PrivateKeyModalProps) => {
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
