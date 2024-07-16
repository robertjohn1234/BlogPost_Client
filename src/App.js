import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-tsparticles';
import AppNavbar from './components/AppNavbar';
import Register from './pages/Register';
import Home from './pages/Home';
import ReadBlog from './pages/ReadBlog';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import AddBlog from './pages/AddBlog';
import { UserProvider } from './UserContext';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    fetch('https://blogpost-api-g0ab.onrender.com/users/details', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.user !== 'undefined') {
          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin,
          });
        } else {
          setUser({
            id: null,
            isAdmin: null,
          });
        }
      });
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: {
      color: {
        value: '#0d47a1',
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#bbbbbb', // Less bright particle color
      },
      links: {
        color: '#bbbbbb', // Less bright link color
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: 'none',
        enable: true,
        outMode: 'bounce',
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: 'circle',
      },
      size: {
        random: true,
        value: 5,
      },
    },
    detectRetina: true,
  };

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <div className="particle-container">
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      </div>
      <Router>
        <AppNavbar />
        <Container className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route exact path="/blogs/:blogId" element={<ReadBlog />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
