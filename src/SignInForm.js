import React, { useState, useEffect } from 'react';
import './SignInForm.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function SignInForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    mail: '',
    password: '',
  });

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
      const userId = Cookies.get('userId');
      // Si l'ID utilisateur existe dans les cookies, rediriger vers le tableau de bord
      if (userId) {
        navigate('/dashboard');
      }
    }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: formData.mail,
        password: formData.password,
      }),
    })
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.message === 'User logged in successfully') {
          // Stocker les données utilisateur dans des cookies
          Cookies.set('userId', data.user.id, { expires: 1 });
          Cookies.set('userMail', data.user.mail, { expires: 1 });
          Cookies.set('userPseudo', data.user.pseudo, { expires: 1 });
          Cookies.set('userAccessRight', data.user.access_right, { expires: 1 });
  
          setSuccessMessage('Connexion réussie...');
          setTimeout(() => {
            setSuccessMessage('');
            navigate('/');
            window.location.reload();
          }, 3000); // Redirection après 3 secondes
        } else {
          throw new Error(data.message || "Erreur lors de la connexion");
        }
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setErrorMessage(error.message || 'Une erreur est survenue lors de la connexion.');
      });
  };

  return (
    <div className="signin-form-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2> {/* Titre avec espace */}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
        <div className="form-control">
          <label htmlFor="mail">Mail</label>
          <input
            type="email"
            id="mail"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <button type="submit" className="submit-btn">
          Connexion
        </button>
        <div className="form-footer">
          <p>
            Pas encore inscrit ? <a href="/signup">Inscrivez-vous ici</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
