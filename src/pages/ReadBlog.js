import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import AddComment from '../components/AddComment';
import DeleteBlog from '../components/DeleteBlog';
import DeleteComment from '../components/DeleteComment';
import EditComment from '../components/EditComment';
import EditBlog from '../components/EditBlog';
import UserContext from '../UserContext';

export default function ReadBlog({ onBlogDeleted }) {

    const { user } = useContext(UserContext);
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        fetchBlog();
        fetchComments();
        fetchLikes(); // Fetch initial likes and check if user liked
    }, []);

    const fetchBlog = () => {
        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/${blogId}`, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setBlog(data.blog))
            .catch(error => console.error('Error fetching blog:', error));
    };

    const fetchComments = () => {
        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/${blogId}/comments`)
            .then(response => response.json())
            .then(data => {
                if (data.comments) {
                    setComments(data.comments);
                } else {
                    setComments([]);
                    console.error('Failed to fetch comments:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    };

    const fetchLikes = () => {
        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/${blogId}`)
            .then(response => response.json())
            .then(data => {
                if (data.blog) {
                    setLikeCount(data.blog.likes.length);
                    setUserLiked(data.blog.likes.includes(user.id));
                } else {
                    console.error('Failed to fetch likes:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching likes:', error);
            });
    };

    const handleLike = () => {
        if (user.id === null) {
            navigate('/login');
            return;
        }

        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/${blogId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setLikeCount(prevCount => prevCount + 1);
                    setUserLiked(true);
                } else {
                    console.error('Failed to like the blog:', data.error);
                }
            })
            .catch(error => {
                console.error('Error liking the blog:', error);
            });
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    function handleCommentAdded(newComment) {
        setComments([...comments, newComment]);
    }

    function handleCommentDeleted(commentId) {
        setComments(comments.filter(comment => comment._id !== commentId));
    }

    function handleCommentUpdated(commentId, updatedContent) {
        const updatedComments = comments.map(comment =>
            comment._id === commentId ? { ...comment, content: updatedContent } : comment
        );
        setComments(updatedComments);
    }

    function handleBlogUpdated(updatedBlog) {
        setBlog(updatedBlog);
    }

    function handleBlogDeleted(deletedBlogId) {
        // Perform additional actions if necessary, e.g., show a success message
        console.log(`Blog with id ${deletedBlogId} has been deleted.`);
        navigate('/'); // Navigate to home page after deletion
    }

    if (!blog) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="blog-header text-start">
                        <h1>{blog.title}</h1>
                        <p className="warning">
                            By {blog.authorEmail} | {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="blog-content mt-4 text-start">
                        <p>{blog.content}</p>
                    </div>
                    <div className="blog-footer mt-4 text-start">
                        <Button variant="link" className="me-2" onClick={handleLike} disabled={userLiked}>
                            <FontAwesomeIcon icon={faThumbsUp} /> Like {likeCount}
                        </Button>
                        <Button variant="link" className="me-2" onClick={toggleComments}>
                            <FontAwesomeIcon icon={faComment} /> {showComments ? 'Hide Comments' : 'Show Comments'}
                        </Button>
                        {(blog.authorId === user.id) && (
                            <EditBlog blogId={blogId} currentTitle={blog.title} currentContent={blog.content} onUpdate={handleBlogUpdated} />
                        )}
                        {(blog.authorId === user.id || user.isAdmin) && (
                            <DeleteBlog blogId={blogId} onDelete={handleBlogDeleted} />
                        )}
                    </div>
                    
                    {showComments && (
                        <div className="comments-section mt-3">
                            <h5>Comments</h5>
                            {comments.map((comment, index) => (
                                <div key={index} className="comment mb-3">
                                    <p className="text-muted mb-1">
                                        By {comment.authorEmail} | {new Date(comment.createdAt).toLocaleDateString()}
                                    </p>
                                    <p>{comment.content}</p>
                                    <div className="comment-actions">
                                        {(comment.authorId === user.id || user.isAdmin) && (                                          
                                            <DeleteComment
                                                blogId={blogId}
                                                commentId={comment._id}
                                                onDelete={handleCommentDeleted}
                                            />                                          
                                        )}
                                        {comment.authorId === user.id && (
                                            <EditComment
                                                commentId={comment._id}
                                                content={comment.content}
                                                onUpdate={handleCommentUpdated}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <AddComment blogId={blogId} onCommentAdded={handleCommentAdded} />
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
