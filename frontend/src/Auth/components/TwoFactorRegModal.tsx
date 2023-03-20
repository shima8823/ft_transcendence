import React, {
  type ReactElement,
  useState,
  useEffect,
  useContext
} from 'react'
import { Button, Modal, Card, InputGroup, FormControl } from 'react-bootstrap'
import { GlobalContext } from '../../App'
import {
  disable2FA,
  enable2FA,
  getIsTwoFactorEnabled,
  getOTPData
} from '../../utils/authAxios'

export function TwoFactorRegModal(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const [secret, setSecret] = useState('')
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false)

  useEffect(() => {
    if (modalIsOpen) {
      getOTPData(loginUser.id, (res) => {
        setSecret(res.secret)
        setQrCodeDataURL(res.qrCode)
      })
      getIsTwoFactorEnabled(loginUser.id, (res: boolean) => {
        if (res) setIsTwoFactorEnabled(true)
      })
    }
  }, [modalIsOpen])

  const openModal = (): void => {
    setModalIsOpen(true)
  }

  const closeModal = (): void => {
    setModalIsOpen(false)
  }

  const handleConfirm = (): void => {
    const obj: EnableTwoFactorAuth = {
      userId: loginUser.id,
      secret,
      token: inputValue
    }
    enable2FA(obj, () => {})
    closeModal()
  }
  const handleDisable2FA = (): void => {
    disable2FA(loginUser.id, () => {
      setIsTwoFactorEnabled(false)
    })
  }
  return (
    <div>
      <Button onClick={openModal}>2FAを有効・無効にするボタンになる予定</Button>
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body className="d-flex justify-content-center">
              <img src={qrCodeDataURL} alt="QR Code" />
            </Card.Body>
          </Card>
          <InputGroup className="mt-3">
            <FormControl
              type="number"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
            />
            <Button variant="outline-secondary" onClick={handleConfirm}>
              Confirm
            </Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          {isTwoFactorEnabled && (
            <Button variant="danger" onClick={handleDisable2FA}>
              2FAを無効化する
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  )
}