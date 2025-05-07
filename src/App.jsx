import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './components/nav/Nav';
import Home from './pages/home/Home';
import PageNotFound from './pages/pageNotFound/PageNotFound';
import Reading from './pages/reading/Reading';
import Listening from './pages/listening/Listening';

function App() {
  // Parolni tekshirish funksiyasi (agar kerak bo'lsa)
  // const [authenticated, setAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const correctPassword = "your_secret_password";
  //   const userPassword = prompt('Saytga kirish parolini kiriting:');
    
  //   if (userPassword === correctPassword) {
  //     setAuthenticated(true);
  //   } else {
  //     alert('Noto‘g‘ri parol! Saytga kirish mumkin emas.');
  //   }
    
  //   setLoading(false);
  // }, []);

  // if (loading) {
  //   return <div className="loading">Yuklanmoqda...</div>;
  // }

  // if (!authenticated) {
  //   return <div className="auth-message">Kirish uchun parol talab qilinadi</div>;
  // }

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