import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

export default function EditBlog({ blogId, currentTitle, currentContent, onUpdate }) {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState(currentTitle);
    const [content, setContent] = useState(currentContent);

    useEffect(() => {
        setTitle(currentTitle);
        setContent(currentContent);
    }, [currentTitle, currentContent]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleSave = () => {
        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/${blogId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    onUpdate(data.updatedBlog);
                    handleClose();
                } else {
                    console.error('Failed to update the blog:', data.error);
                }
            })
            .catch(error => {
                console.error('Error updating the blog:', error);
            });
    };

    return (
        <>
            <Button variant="link" className="me-2" onClick={handleShow}>
                <FontAwesomeIcon icon={faEdit} /> Edit
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBlogTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Enter title" 
                            />
                        </Form.Group>

                        <Form.Group controlId="formBlogContent" className="mt-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)} 
                                placeholder="Enter content" 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
