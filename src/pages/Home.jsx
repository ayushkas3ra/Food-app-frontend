import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Welcome to Food App</h1>
            <p>Discover amazing food from local partners!</p>
            <Link to="/feed">
                <button style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}>
                    Go to Feed
                </button>
            </Link>
        </div>
    )
}

export default Home
