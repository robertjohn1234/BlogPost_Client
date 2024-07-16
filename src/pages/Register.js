import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function Register() {

    const { user } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    const [alertVariant, setAlertVariant] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    function registerUser(e) {
        e.preventDefault();

        fetch('https://blogpost-api-g0ab.onrender.com/users/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.message === 'Registered Successfully') {
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                    title: 'Success!',
                    text: 'Registered Successfully',
                    icon: 'success',
                });

            } else {
                let errorMsg = 'Something went wrong';
                if (data.error === 'Email invalid') {
                    errorMsg = 'Email invalid';
                } else if (data.error === 'Password must be atleast 8 characters') {
                    errorMsg = 'Password must be at least 8 characters';
                }

                Swal.fire({
                    title: 'Failed',
                    text: errorMsg,
                    icon: 'error',
                });

                setAlertVariant('danger');
                setAlertMessage(errorMsg);
                setShowAlert(true);
            }
        });
    }

    useEffect(() => {
        if (username !== '' && email !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [username, email, password, confirmPassword]);

    const handleAlertClose = () => setShowAlert(false);

    return (
        user.id !== null ?
            <Navigate to="/blogs" />
        :
            <Form onSubmit={registerUser} className="my-5 mx-auto" style={{ maxWidth: '400px' }}>
                <h1 className="text-center mb-5">Register</h1>

                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

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
                    />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ marginBottom: '1rem' }}
                    />
                </Form.Group>

                {isActive ? (
                    <Button variant="primary" type="submit" className="w-100 mb-3">
                        Submit
                    </Button>
                ) : (
                    <Button variant="danger" type="submit" className="w-100 mb-3" disabled>
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
                    Already have an account? <Link to="/login">Click here</Link> to login.
                </p>
            </Form>
    );
}
