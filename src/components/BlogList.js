import React, { useState, useEffect } from 'react';
import BlogView from './BlogView';

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = () => {
        fetch(`https://blogpost-api-g0ab.onrender.com/blogs`)
            .then(response => response.json())
            .then(data => {
                if (data.blogs) {
                    setBlogs(data.blogs);
                } else {
                    setBlogs([]);
                    console.error('Failed to fetch blogs:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
            });
    };

    const handleBlogDeleted = (deletedBlogId) => {
        setBlogs(blogs.filter(blog => blog._id !== deletedBlogId));
    };

    return (
        <div>
            {blogs.map(blog => (
                <BlogView key={blog._id} blog={blog} onBlogDeleted={handleBlogDeleted} />
            ))}
        </div>
    );
}
