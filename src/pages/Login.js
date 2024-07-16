import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function Login() {
    
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    const [alertVariant, setAlertVariant] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    function authenticate(e) {
        e.preventDefault();

        fetch(`https://blogpost-api-g0ab.onrender.com/users/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if (res.status === 404) {
                throw new Error('No Email Found');
            } else {
                throw new Error('Authentication failed');
            }
        })
        .then(data => {
            if (typeof data.access !== "undefined") {
                localStorage.setItem('token', data.access); 
                retrieveUserDetails(localStorage.getItem('token'));
                Swal.fire({
                    title: 'Login Successful',
                    icon: 'success',
                    text: 'Welcome!'
                });
            } else {
                throw new Error('Authentication failed');
            }
        })
        .catch(error => {
            console.error('Error authenticating:', error.message);
            if (error.message === 'No Email Found') {
                setAlertVariant('danger');
                setAlertMessage('No Email found. Email does not exist.');
            } else {
                setAlertVariant('danger');
                setAlertMessage('Authentication failed. Check your login details and try again.');
            }
            setShowAlert(true);
        });

        setEmail('');
        setPassword('');
    };

    const retrieveUserDetails = (token) => {
        fetch(`https://blogpost-api-g0ab.onrender.com/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to retrieve user details');
            }
        })
        .then(data => {
            setUser({
                id: data._id,
                isAdmin: data.isAdmin
            });
        })
        .catch(error => {
            console.error('Error retrieving user details:', error.message);
        });
    }

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    const handleAlertClose = () => setShowAlert(false);

    return (    
        user.id !== null ?
            <Navigate to="/" />
        :
        <Form onSubmit={(e) => authenticate(e)} className="my-5 mx-auto" style={{ maxWidth: '400px' }}>
            <h1 className="text-center mb-5">Login</h1>

            <Form.Group controlId="userEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ marginBottom: '1rem' }}
                />
            </Form.Group>

            {isActive ? (
                <Button variant="primary" type="submit" id="submitBtn" className="w-100 mb-3">
                    Submit
                </Button>
            ) : (
                <Button variant="danger" type="submit" id="submitBtn" className="w-100 mb-3" disabled>
                    Submit
                </Button>
            )}

            <Alert 
                variant={alertVariant} 
                show={showAlert} 
                onClose={handleAlertClose} 
                dismissible
                className="mt-3"
            >
                {alertMessage}
            </Alert>

            <p className="text-center">
                Don't have an account yet? <Link to="/register">Click here</Link> to register.
            </p>
        </Form>       
    )
}
