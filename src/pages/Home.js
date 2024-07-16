import { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';
import Banner from '../components/Banner';
import BlogList from '../components/BlogList';

export default function Home() {

    const { user } = useContext(UserContext);
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState('');

	const data = user.isAdmin ? {
        title: "Welcome, Handsome Admin!",
        content: "Manage and review all blogs and comments. You also have the ability to create and publish your own articles.",
        destination: (user.id !== null) ? "/add-blog" : "/login",
        label: "Write Blog",
        imageUrl: 'https://www.shutterstock.com/image-photo/flat-lay-home-office-desktop-260nw-1869950761.jpg'
    } : {
        title: "Welcome to BLOGS.PH!",
        content: "Explore a wide range of articles on various topics. Stay updated with the latest trends, tips, and insights from our expert authors.",
        destination: (user.id !== null) ? "/add-blog" : "/login",
        label: "Write Blog",
        imageUrl: 'https://www.shutterstock.com/image-photo/flat-lay-home-office-desktop-260nw-1869950761.jpg'
    };

    const fetchData = () => {
        fetch(`https://blogpost-api-g0ab.onrender.com/blogs/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (typeof data.blogs !== 'string') {
                setBlogs(data.blogs);
            } else { 
                setBlogs([]);
            }
        })
        .catch(err => setError('Error fetching blogs.'));
    }

    useEffect(() => {
        fetch('https://blogpost-api-g0ab.onrender.com/blogs/', {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {

            if (data.blogs && Array.isArray(data.blogs)) {
                setBlogs(data.blogs);
            } else {
                setBlogs([]);
            }
        })
        .catch(err => setError('Error fetching blogs.'));
    }, []);

    return (

        <>
            {error && <p>{error}</p>}
            <Banner data={data}/>
            <BlogList blogs={blogs}/>
		</>
	)
}