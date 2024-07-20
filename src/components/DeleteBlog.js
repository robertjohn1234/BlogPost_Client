import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

export default function DeleteBlog({ blogId, onDelete }) {

    const handleDelete = () => {
        const token = localStorage.getItem('token');
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://blogpost-api-g0ab.onrender.com/blogs/${blogId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Blog deleted successfully') {
                        Swal.fire(
                            'Deleted!',
                            'Your blog post has been deleted.',
                            'success'
                        );
                        if (typeof onDelete === 'function') {
                            onDelete(blogId);
                        }
                    } else if (data.auth === 'Failed. No Token') {
                        Swal.fire(
                            'Error!',
                            'Please Login and Try Again',
                            'error'
                        );
                    } else if (data.auth === 'Failed') {
                        Swal.fire(
                            'Error!',
                            'You are not allowed to delete this blog.',
                            'error'
                        );
                    } else {
                        Swal.fire(
                            'Error!',
                            data.message || 'Failed to delete the blog post.',
                            'error'
                        );
                    }
                })
                .catch(error => {
                    console.error('Error deleting blog post:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to delete the blog post.',
                        'error'
                    );
                });
            }
        });
    };

    return (
        <Button variant="link" className="me-2" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
    );
}
