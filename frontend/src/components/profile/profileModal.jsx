import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";

function Profile() {
  const [username, setUsername] = useState("");
  const [modal, setModal] = useState({
    show: false,
    message: "",
    isError: false,
    isConfirm: false,
    type: null,
    passwordForm: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/login");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);


  const handleChangePassword = () => {
    setModal({
      show: true,
      message: "",
      isError: false,
      isConfirm: false,
      type: 'password',
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setModal(prev => ({
      ...prev,
      passwordForm: {
        ...prev.passwordForm,
        [name]: value
      }
    }));
  };

  const validatePasswordForm = () => {
    const { oldPassword, newPassword, confirmPassword } = modal.passwordForm;
    
    if (!oldPassword.trim()) return "Sisestage vana parool!";
    if (!newPassword.trim()) return "Sisestage uus parool!";
    if (!confirmPassword.trim()) return "Kinnitage uus parool!";
    
    if (newPassword !== confirmPassword) return "Paroolid ei kattu!";
    
    return null;
  };

  const handleChangePasswordSubmit = async () => {
    const validationError = validatePasswordForm();
    if (validationError) {
      setModal(prev => ({
        ...prev,
        message: validationError,
        isError: true
      }));
      return;
    }

    try {
      const response = (await axios.put(import.meta.env.VITE_BACKEND_URL + `/api/v1/users/${username}/password`,{oldPassword: modal.passwordForm.oldPassword, newPassword: modal.passwordForm.newPassword}));
      setModal({
        show: true,
        message: "Parool edukalt muudetud!",
        isError: false,
        isConfirm: false,
        type: 'success'
      });
    } catch (error) {
        let msg = undefined;
        if(error.response?.status === 404){
            msg = "Kasutajat ei leitud!";
        }
        else if (error.response?.status === 400){
            msg = "Puuduvad vajalikud väljad: vana parool / uus parool";
        }
        else if (error.response?.status === 401){
            msg = "Vale vana parool!";
        }
        setModal({
            show: true,
            message: msg || "Parooli muutmine ebaõnnestus!",
            isError: true,
            isConfirm: false,
            type: 'error'
        });
    }
  };

  const closeModal = () => {
    setModal({ 
      show: false, 
      message: "", 
      isError: false, 
      isConfirm: false, 
      type: null,
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
    });
  };

  const handleDeleteAccount = () => {
    setModal({
      show: true,
      message: "Kas olete kindel, et soovite oma konto kustutada? Seda toimingut ei saa tagasi võtta.",
      isError: false,
      isConfirm: true,
      type: 'delete'
    });
  };
  
  const confirmDeleteAccount = async () => {
    try{
        const response = (await axios.delete(`/api/v1/users/${username}`));
        setModal({
            show: true,
            message: "Teie konto on edukalt kustutatud.",
            isError: false,
            isConfirm: false,
            type: 'success'
        });
        setTimeout(() => {
            localStorage.removeItem("username");
            window.dispatchEvent(new Event("storage"));
            navigate("/register")
        }, 3000);
    }
    catch(error){
        let msg = undefined;
        if(error.response?.status === 404){
            msg = "Kasutajat ei leitud!";
        }
        else if (error.response?.status === 400){
            msg = "URL ei sisalda kasutajanime!";
        }
        setModal({
            show: true,
            message: msg|| "Konto kustutamine ebaõnnestus!",
            isError: true,
            isConfirm: false,
            type: 'error'
        });
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <h2>Teie profiil</h2>
          <div className="profile-info">
            <p>
                <span>Siin saate, kustutada enda konto või muuta selle parooli</span>
            </p>
          </div>

          <div className="profile-actions">
            <button 
              className="profile-btn change-password-btn" 
              onClick={handleChangePassword}
            >
              Muuda Parooli
            </button>
            <button 
              className="profile-btn delete-btn" 
              onClick={handleDeleteAccount}
            >
              Kustuta Konto
            </button>
          </div>
        </div>
      </div>

      {modal.show && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {modal.type === 'password' && (
              <>
                <h3 className="modal-title">Parooli Muutmine</h3>
                
                <div className="password-form">
                  <div className="form-group">
                    <label htmlFor="oldPassword">Vana parool:</label>
                    <input
                      id="oldPassword"
                      type="password"
                      name="oldPassword"
                      value={modal.passwordForm.oldPassword}
                      onChange={handlePasswordInputChange}
                      className="form-input"
                      placeholder="Sisestage oma vana parool"
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">Uus parool:</label>
                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={modal.passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className="form-input"
                      placeholder="Sisestage uus parool"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Kinnitage uus parool:</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={modal.passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="form-input"
                      placeholder="Kinnitage uus parool"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {modal.message && (
                  <p className={modal.isError ? "modal-error" : "modal-success"}>
                    {modal.message}
                  </p>
                )}

                <div className="confirm-buttons">
                  <button 
                    className="modal-btn cancel-btn" 
                    onClick={closeModal}
                  >
                    Tühista
                  </button>
                  <button 
                    className="modal-btn modal-close-btn" 
                    onClick={handleChangePasswordSubmit}
                  >
                    Muuda Parooli
                  </button>
                </div>
              </>
            )}

            {modal.type !== 'password' && (
              <>
                <h3 className={`modal-title ${modal.isError ? 'modal-error' : modal.isConfirm ? 'modal-title' : 'modal-success'}`}>
                  {modal.type === 'delete' ? 'Konto Kustutamine' : 
                   modal.isError ? 'Viga' : 'Ok'}
                </h3>
                
                <p className={modal.isError ? "modal-error" : modal.isConfirm ? "modal-title" : "modal-success"}>
                  {modal.message}
                </p>

                {modal.isConfirm ? (
                  <div className="confirm-buttons">
                    <button className="modal-btn cancel-btn" onClick={closeModal}>
                      Tühista
                    </button>
                    <button className="modal-btn confirm-delete-btn" onClick={confirmDeleteAccount}>
                      Jah, KUSTUTA minu konto
                    </button>
                  </div>
                ) : (
                    <button className="modal-close-btn" onClick={closeModal}>
                            Sulge
                    </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;