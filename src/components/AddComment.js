import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { Navigate } from 'react-router-dom';

export default function AddComment({ blogId, onCommentAdded }) {
    const { user } = useContext(UserContext);
    const [content, setContent] = useState("");

    const handleAddComment = (e) => {
        e.preventDefault();

        let token = localStorage.getItem('token');

        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/${blogId}/comments`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Comment added successfully') {
                onCommentAdded(data.comment);
                setContent("");
                Swal.fire({
                    title: "Comment Added",
                    icon: "success",
                    text: data.message
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to add comment. Try Loggin in.",
                    text: data.error
                });
            }
        })
        .catch(error => {
            console.error('Error adding comment:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong!"
            });
        });
    };

   
    return (
        <Form onSubmit={handleAddComment}>
            <Form.Group>
                <Form.Label>Add a Comment</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="link" type="submit" className="mt-3">
                <FontAwesomeIcon icon={faPaperPlane} /> Add Comment
            </Button>
        </Form>
    );
}
