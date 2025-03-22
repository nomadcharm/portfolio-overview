import { FC, useState } from "react";
import ModalForm from "../ModalForm/ModalForm";
import "./header.scss";

const Header: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <>
      <header className="header">
        <div className="container header__container">
          <h1 className="header__logo">Portfolio Overview</h1>
          <button
            className="header__btn"
            onClick={handleClick}
          >
            +
          </button>
        </div>
      </header>
      {isModalOpen && <ModalForm onClose={handleCloseModal} />}
    </>
  )
}

export default Header;
