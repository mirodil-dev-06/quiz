import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Nav from './components/nav/Nav';
import Home from './pages/home/Home';
import PageNotFound from './pages/pageNotFound/PageNotFound';
import Reading from './pages/reading/Reading';
import Listening from './pages/listening/Listening';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const correctPassword = "ibrokhim";
    const userPassword = prompt('Saytga kirish uchun parolni kiriting:');

    if (userPassword === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('Noto‘g‘ri parol! Siz Google sahifasiga yo‘naltirilasiz.');
      window.location.href = "https://www.google.com";
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  if (!authenticated) {
    return <div className="auth-message">Kirish uchun parol talab qilinadi</div>;
  }

  return (
    <Router>
      <div className="app">
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/listening" element={<Listening />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
