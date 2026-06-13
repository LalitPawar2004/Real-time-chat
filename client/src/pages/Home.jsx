import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            🔒 SecureChat
          </Link>
          <div>
            <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
            <Link to="/register" className="btn btn-light">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary text-white py-5 flex-grow-1">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Private & Secure Real-time Chat
              </h1>
              <p className="lead mb-4">
                End-to-end encrypted messaging platform. Your conversations stay private with military-grade AES-256 encryption.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn btn-light btn-lg px-4">
                  Start Chatting Free
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-white bg-opacity-10 rounded-4 p-4">
                <div className="display-1 mb-3">💬</div>
                <div className="d-flex flex-column gap-2">
                  <div className="bg-white bg-opacity-25 rounded-3 p-3 text-start">
                    <small>🔒 Encrypted Message</small>
                    <div className="fw-semibold">Hey! This is secured...</div>
                  </div>
                  <div className="bg-white bg-opacity-25 rounded-3 p-3 text-start ms-4">
                    <small>🔒 Encrypted Reply</small>
                    <div className="fw-semibold">Perfect! Your privacy matters.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose SecureChat?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="display-4 mb-3">🔐</div>
                <h5>End-to-End Encryption</h5>
                <p className="text-muted">
                  AES-256 encryption ensures only you and your recipient can read messages. Not even we can access them.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="display-4 mb-3">⚡</div>
                <h5>Real-time Messaging</h5>
                <p className="text-muted">
                  Instant message delivery with typing indicators and read receipts. Stay connected in real-time.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="display-4 mb-3">📱</div>
                <h5>Responsive Design</h5>
                <p className="text-muted">
                  Chat seamlessly across all devices - desktop, tablet, and mobile. Your conversations go wherever you go.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="display-4 mb-3">🖼️</div>
                <h5>Image Sharing</h5>
                <p className="text-muted">
                  Share images securely with your contacts. All files are transmitted with the same encryption standards.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="display-4 mb-3">👥</div>
                <h5>Group Chats</h5>
                <p className="text-muted">
                  Create group conversations for team collaboration or family chats. Everyone stays in sync.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="display-4 mb-3">🟢</div>
                <h5>Online Presence</h5>
                <p className="text-muted">
                  See who's online in real-time. Know when your contacts are available to chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Ready for Private Conversations?</h2>
          <p className="lead mb-4">Join thousands of users who trust SecureChat for their communications.</p>
          <Link to="/register" className="btn btn-light btn-lg px-5">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2024 SecureChat. All rights reserved. | Privacy First</small>
      </footer>
    </div>
  )
}