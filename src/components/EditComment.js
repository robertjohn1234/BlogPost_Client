import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

export default function EditComment({ commentId, content, onUpdate }) {
    const [editMode, setEditMode] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(content);

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setUpdatedContent(content); // Reset to original content if cancel editing
    };

    const handleUpdate = () => {
        let token = localStorage.getItem('token');

        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                content: updatedContent
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Comment updated successfully') {
                Swal.fire(
                    'Updated!',
                    'Your comment has been updated.',
                    'success'
                );
                onUpdate(commentId, updatedContent);
                setEditMode(false);
            } else {
                Swal.fire(
                    'Error!',
                    data.message || 'Failed to update the comment.',
                    'error'
                );
            }
        })
        .catch(error => {
            console.error('Error updating comment:', error);
            Swal.fire(
                'Error!',
                'Failed to update the comment.',
                'error'
            );
        });
    };

    if (editMode) {
        return (
            <div className="mb-3">
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                    required
                />
                <div className="mt-2">
                    <Button variant="success" size="sm" className="me-2" onClick={handleUpdate}>
                        <FontAwesomeIcon icon={faSave} /> Save
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={toggleEditMode}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                </div>
            </div>
        );
    } else {
        return (
            <Button variant="link" size="sm" onClick={toggleEditMode}>
                <FontAwesomeIcon icon={faEdit} /> Edit
            </Button>
        );
    }
}
