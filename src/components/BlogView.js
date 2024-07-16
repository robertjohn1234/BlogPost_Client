import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import AddComment from './AddComment';
import DeleteBlog from './DeleteBlog';
import DeleteComment from './DeleteComment';
import EditComment from './EditComment';
import UserContext from '../UserContext';

export default function BlogView({ blog, onBlogDeleted }) {
    const { user } = useContext(UserContext);
    const { title, authorEmail, createdAt, content, _id: blogId, likes } = blog;
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [userLiked, setUserLiked] = useState(false); // To handle if the user has liked the blog
    const navigate = useNavigate();

    useEffect(() => {
        fetchComments();
        fetchLikes(); // Fetch the initial like count
    }, []);

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

    const handleReadMore = () => {
        (user.id !== null) ? navigate(`/blogs/${blogId}`) : navigate('/login');
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="blog-header text-start">
                        <h1>{title}</h1>
                        <p className="warning">
                            By {authorEmail} | {new Date(createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="blog-content mt-4 text-start">
                        <p>{content.substring(0, 200)}... <Button variant="link" onClick={handleReadMore}><FontAwesomeIcon icon={faArrowRight} /> Read More</Button></p>
                    </div>
                    <div className="blog-footer mt-4 text-start">
                        <Button variant="link" className="me-2" onClick={handleLike} disabled={userLiked}>
                            <FontAwesomeIcon icon={faThumbsUp} /> Like {likeCount}
                        </Button>
                        <Button variant="link" className="me-2" onClick={toggleComments}>
                            <FontAwesomeIcon icon={faComment} /> {showComments ? 'Hide Comments' : 'Show Comments'}
                        </Button>
                        <DeleteBlog blogId={blogId} onDelete={onBlogDeleted} />
                    </div>
                    
                    {showComments && (
                        <div className="comments-section mt-3">
                            <h5>Comments</h5>
                            {comments.map((comment, index) => (
                                <div key={index} className="comment mb-3">
                                    <p className="warning mb-1">
                                        By {comment.authorEmail} | {new Date(comment.createdAt).toLocaleDateString()}
                                    </p>
                                    <p>{comment.content}</p>
                                    <div className="comment-actions">
                                        <EditComment
                                            commentId={comment._id}
                                            content={comment.content}
                                            onUpdate={handleCommentUpdated}
                                        />
                                        <DeleteComment
                                            blogId={blogId}
                                            commentId={comment._id}
                                            onDelete={handleCommentDeleted}
                                        />
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
