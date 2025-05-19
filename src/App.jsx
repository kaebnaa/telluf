  import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  
  const [postContent, setPostContent] = useState("")
  const [postTitle, setPostTitle] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)

  const [activeCommentPost, setActiveCommentPost] = useState(null)
  const [activeReplyComment, setActiveReplyComment] = useState(null)
  const [posts, setPosts] = useState([])

  // Define school options
  const schoolOptions = [
    "Amjilt cyber school",
    "School B",
    "School C",
    "School D"
  ];

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/posts');
        console.log('Response status:', response.status); 
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched posts:', data); 
          setPosts(data); 
        } else {
          console.error('Error fetching posts:', await response.text());
        }
      } catch (error) {
        console.error('Error during fetching posts:', error);
      }
    };

    fetchPosts(); 
  }, []); 

  const handleSubmitPost = async () => {
    if (!postTitle.trim() || !postContent.trim() || !selectedSchool || !currentUser) {
      console.error('Missing required fields for post submission.');
      return;
    }

    const newPost = {
      title: postTitle,
      content: postContent,
      school: selectedSchool, 
      isAnonymous: isAnonymous,
      author: currentUser.username,
      authorId: currentUser.id,
      date: new Date().toLocaleString(),

    };

    try {
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const savedPost = await response.json();
        setPosts((prevPosts) => [savedPost, ...prevPosts]); 
        setPostContent('');
        setPostTitle('');
        setSelectedSchool('');
        setIsAnonymous(false);
        setIsCreatePostOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Error saving post:', errorData);
      }
    } catch (error) {
      console.error('Error during post submission:', error);
    }
  };

  // Add account states
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser')
    return saved ? JSON.parse(saved) : null
  })

  // Save user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  // Add these new states at the top of your App component
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users')
    return savedUsers ? JSON.parse(savedUsers) : []
  })
  const [loginError, setLoginError] = useState('')
  const [signUpError, setSignUpError] = useState('')

  // Add this useEffect to save users
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), 
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setCurrentUser({ username: data.username, id: data.id });
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        setUsername('');
        setPassword('');
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        setLoginError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('An error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      if (response.ok) {
        setCurrentUser(null);
        setIsLoggedIn(false);
        console.log('Logout successful');
      } else {
        console.error('Logout failed:', await response.text());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleCreatePost = () => {
    setIsCreatePostOpen(true)
  }

  

 


 

  // Add these new functions
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signUpData.username,
          email: signUpData.email,
          password: signUpData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser({ username: data.username, id: data.id });
        setIsLoggedIn(true);
        setIsSignUpModalOpen(false);
        setSignUpData({ username: '', email: '', password: '', confirmPassword: '' });
      } else {
        const errorData = await response.json();
        setSignUpError(errorData.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      setSignUpError('An error occurred. Please try again.');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/posts');
      console.log('Response status:', response.status); 
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched posts:', data); 
        setPosts(data); 
      } else {
        console.error('Error fetching posts:', await response.text());
      }
    } catch (error) {
      console.error('Error during fetching posts:', error);
    }
  };

  console.log('Current posts:', posts);

  return (
    <div className="app">
      <div className='navbar'>
        <div className="nav-left">
          <h1 onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>TellU</h1>
        </div>
        <div className="nav-right">
          {currentUser ? (
            <div className="user-menu">
              <span className="username">{currentUser.username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-btn" onClick={() => setIsLoginModalOpen(true)}>
                Login
              </button>
              <button className="signup-btn" onClick={() => setIsSignUpModalOpen(true)}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="container">
        <div className="sidebar">
          <div className="sidebar-items">
            <button className='cpbtn' onClick={handleCreatePost}>Create post</button>
          </div>
        </div>

        <div className="main">
          <div className="posts-container">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .map((post) => (
                  <div key={post.id} className="post">
                    <div className="post-header">
                      <div className="post-title">{post.title}</div>
                      <small className="post-date">{post.date}</small>
                    </div>
                    <p className="post-content">{post.content}</p>
                    <div className="post-footer">
                      <div className="post-actions">
                     
                      </div>
                      <div className="post-meta-info">
                        <span className="post-author">
                          {post.isAnonymous ? "👤 Anonymous" : `👤 ${post.author}`}
                        </span>
                        <span className="post-school">
                          📚 {post.school}
                        </span>
                      </div>
                    </div>

                    
                  </div>
                ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>

          {isCreatePostOpen && (
            <div className="create-post-modal">
              <div className="modal-content">
                <h2>Create New Post</h2>
                
                <div className="post-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Enter post title"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>School</label>
                    <select 
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                    >
                      <option value="">Select a school</option>
                      {schoolOptions.map((school) => (
                        <option key={school} value={school}>
                          {school}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Content</label>
                    <textarea 
                      placeholder="What's on your mind?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      Post Anonymously
                    </label>
                  </div>
                </div>

                <div className="modal-buttons">
                  <button onClick={() => {
                    setIsCreatePostOpen(false)
                    setPostContent("")
                    setPostTitle("")
                    setSelectedSchool("")
                    setIsAnonymous(false)
                  }}>Cancel</button>
                  <button 
                    onClick={handleSubmitPost}
                    disabled={!postContent.trim() || !postTitle.trim() || !selectedSchool}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <h2>Login</h2>
            {loginError && <div className="error-message">{loginError}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setIsLoginModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">
                  Login
                </button>
              </div>
            </form>
            <div className="auth-switch">
              Don't have an account?{' '}
              <button 
                className="switch-btn"
                onClick={() => {
                  setIsLoginModalOpen(false)
                  setIsSignUpModalOpen(true)
                  setLoginError('')
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add the Sign Up Modal */}
      {isSignUpModalOpen && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <h2>Sign Up</h2>
            {signUpError && <div className="error-message">{signUpError}</div>}
            <form onSubmit={handleSignUp}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={signUpData.username}
                  onChange={(e) => setSignUpData({...signUpData, username: e.target.value})}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => {
                  setIsSignUpModalOpen(false)
                  setSignUpData({ username: '', email: '', password: '', confirmPassword: '' })
                  setSignUpError('')
                }}>
                  Cancel
                </button>
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App



