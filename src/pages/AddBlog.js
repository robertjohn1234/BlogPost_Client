import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import UserContext from '../UserContext';

export default function AddBlog() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isActive, setIsActive] = useState(false);

    console.log(user);

    useEffect(() => {
        if (title !== '' && content !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [title, content]);

    function createBlog(e) {
        e.preventDefault();

        let token = localStorage.getItem('token');

        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                content
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Response data:', data);
        
            if (data.savedBlog._id) {
                Swal.fire({
                    title: "Blog Added",
                    icon: "success",
                    text: data.message
                });

                navigate("/");
            } else if (data.message === "Blog already exists") {
                Swal.fire({
                    icon: "error",
                    title: "Blog already exists",
                    text: data.message
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to save blog"
                });
            }
        });

        setTitle("");
        setContent("");
    }

    return (

        user.id !== null ?

        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="my-5 text-center">Write Blog</h1>
                    <Form onSubmit={e => createBlog(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title:</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter title" 
                                required 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content:</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={5} 
                                placeholder="Enter content" 
                                required 
                                value={content} 
                                onChange={e => setContent(e.target.value)} 
                            />
                        </Form.Group>
                        <div className="text-center">
                            {isActive ? 
                                <Button variant="primary" type="submit" className='my-2'>Submit</Button> 
                                : 
                                <Button variant="danger" type="submit" className='my-2' disabled>Submit</Button>
                            }
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>

        :

        <Navigate to="/login" />
    );
}
