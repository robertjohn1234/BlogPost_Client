import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
    const { title, content, destination, label, imageUrl } = data;

    return (
        <Container className="banner-container" style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'black',
            minHeight: '40vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        }}>
            <Row className="justify-content-center" style={{ width: '100%' }}>
                <Col md={10}>
                    <h1>{title}</h1>
                    <p>{content}</p>
                    <Link className="btn btn-primary" to={destination}>{label}</Link>
                </Col>
            </Row>
        </Container>
    );
}
