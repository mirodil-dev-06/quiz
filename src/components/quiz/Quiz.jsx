import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../quiz/Quiz.css';
import Slider from '../slider/Slider';

const Quiz = () => {
  // Load saved data from localStorage on initial render
  const savedData = JSON.parse(localStorage.getItem('quizProgress')) || {};
  
  const [selectedAnswers, setSelectedAnswers] = useState(savedData.selectedAnswers || {});
  const [submitted, setSubmitted] = useState(savedData.submitted || false);
  const [userInfo, setUserInfo] = useState(savedData.userInfo || { name: '', phone: '' });
  
    




  const [testStarted, setTestStarted] = useState(savedData.testStarted || false);
  const [startTime, setStartTime] = useState(savedData.startTime ? new Date(savedData.startTime) : null);
  const [endTime, setEndTime] = useState(savedData.endTime ? new Date(savedData.endTime) : null);
  const [testDuration, setTestDuration] = useState(savedData.testDuration || 0);
  
  // Save progress to localStorage whenever relevant state changes
  useEffect(() => {
    const progressData = {
      selectedAnswers,
      submitted,
      userInfo,
      testStarted,
      startTime: startTime ? startTime.getTime() : null,
      endTime: endTime ? endTime.getTime() : null,
      testDuration
    };
    localStorage.setItem('quizProgress', JSON.stringify(progressData));
  }, [selectedAnswers, submitted, userInfo, testStarted, startTime, endTime, testDuration]);

  const questions = [
    {
      id: 1,
      question: "React qanday kutubxona?",
      options: {
        a: "Frontend kutubxonasi",
        b: "Backend frameworki",
        c: "Dasturlash tili",
        d: "Ma'lumotlar bazasi"
      },
      correctAnswer: "a"
    },
    {
      id: 2,
      question: "React komponentlari qanday yaratiladi?",
      options: {
        a: "class yoki function",
        b: "faqat class",
        c: "faqat function",
        d: "object literal"
      },
      correctAnswer: "a"
    },
    {
      id: 3,
      question: "Reactda state nima?",
      options: {
        a: "Komponentning ichki holati",
        b: "Tashqi API dan kelgan ma'lumot",
        c: "Global o'zgaruvchi",
        d: "CSS stil"
      },
      correctAnswer: "a"
    },
    {
      id: 4,
      question: "JSX nima?",
      options: {
        a: "JavaScript XML",
        b: "Yangi dasturlash tili",
        c: "JSON ning kengaytmasi",
        d: "HTML shablon"
      },
      correctAnswer: "a"
    },
    {
      id: 5,
      question: "Reactda props nima?",
      options: {
        a: "Komponentga berilgan ma'lumotlar",
        b: "Komponent ichidagi o'zgaruvchilar",
        c: "Global state",
        d: "CSS xususiyatlari"
      },
      correctAnswer: "a"
    },
    {
      id: 6,
      question: "useEffect hooki nima uchun ishlatiladi?",
      options: {
        a: "Yon ta'sirlarni boshqarish uchun",
        b: "State ni o'zgartirish uchun",
        c: "Komponentni render qilish uchun",
        d: "Eventlarni qo'shish uchun"
      },
      correctAnswer: "a"
    },
    {
      id: 7,
      question: "Reactda virtual DOM nima?",
      options: {
        a: "Haqiqiy DOM ning JavaScript representatsiyasi",
        b: "Yangi DOM turi",
        c: "3D model",
        d: "Server-side render"
      },
      correctAnswer: "a"
    },
    {
      id: 8,
      question: "React komponenti qachon qayta render bo'ladi?",
      options: {
        a: "State yoki props o'zgarganda",
        b: "Faqat state o'zgarganda",
        c: "Faqat props o'zgarganda",
        d: "Har doim"
      },
      correctAnswer: "a"
    },
    {
      id: 9,
      question: "React Router nima uchun kerak?",
      options: {
        a: "Single Page Application navigation uchun",
        b: "Serverga so'rov yuborish uchun",
        c: "State ni boshqarish uchun",
        d: "Komponentlarni import qilish uchun"
      },
      correctAnswer: "a"
    },
    {
      id: 10,
      question: "Key prop nima uchun kerak?",
      options: {
        a: "Reactga elementlarni ajratish uchun",
        b: "CSS stil berish uchun",
        c: "Komponent nomi uchun",
        d: "Event handler uchun"
      },
      correctAnswer: "a"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? score + 1 : score;
    }, 0);
  };

  const handleStartTest = () => {
    if (userInfo.name && userInfo.phone) {
      setTestStarted(true);
      // Only set start time if it's not already set (to preserve it on refresh)
      if (!startTime) {
        setStartTime(new Date());
      }
    } else {
      alert("Iltimos, ismingiz va telefon raqamingizni kiriting!");
    }
  };

  const handleSubmit = () => {
    const end = new Date();
    setEndTime(end);
    const duration = Math.round((end - startTime) / 1000);
    setTestDuration(duration);
    
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    
    const results = {
      score,
      percentage,
      answers: selectedAnswers,
      userInfo,
      startTime: startTime.toLocaleString(),
      endTime: end.toLocaleString(),
      duration
    };
    
    // Save final results separately
    localStorage.setItem('quizResults', JSON.stringify(results));
    // Clear the progress data since test is completed
    localStorage.removeItem('quizProgress');
    sendResultsToTelegram(results);
    setSubmitted(true);
  };

  const sendResultsToTelegram = async (results) => {
    const TELEGRAM_BOT_TOKEN = '6456711758:AAGhN0zQzQG9Xfr6gRG6pD5xcJmlTN_eIOc';
    const CHAT_ID = '5084402296';
    
    try {
      const message = `📊 Yangi test natijalari:\n\n` +
        `👤 Foydalanuvchi: ${userInfo.name}\n` +
        `📞 Telefon: ${userInfo.phone}\n` +
        `⏱ Davomiylik: ${results.duration}s\n` +
        `✅ To'g'ri javoblar: ${results.score}/${questions.length}\n` +
        `📈 Foiz: ${results.percentage.toFixed(0)}%`;
      
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        }
      );
    } catch (error) {
      console.error('Xatolik:', error);
    }
  };

  const score = calculateScore();
  const percentage = (score / questions.length) * 100;

  // Function to reset the test
  const handleResetTest = () => {
    localStorage.removeItem('quizProgress');
    setSelectedAnswers({});
    setSubmitted(false);
    setUserInfo({ name: '', phone: '' });
    setTestStarted(false);
    setStartTime(null);
    setEndTime(null);
    setTestDuration(0);
  };

  return (
    <div className='quiz'>
      <Slider style={{ height: '200px' }} />
      
      <div className="quiz__container">
        {!submitted && (
          <div className="quiz__container-form">
            <h2 className="quiz__container-form__title">Testni boshlash uchun ma'lumotlaringizni kiriting</h2>
            <input
              type="text"
              name="name"
              placeholder="Ismingiz"
              value={userInfo.name}
              onChange={handleInputChange}
              required
              disabled={testStarted} // Disable after test starts
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefon raqamingiz"
              value={userInfo.phone}
              onChange={handleInputChange}
              required
              disabled={testStarted} // Disable after test starts
            />
            
            {!testStarted ? (
              <button 
                className="start-btn" 
                onClick={handleStartTest}
                disabled={!userInfo.name || !userInfo.phone}
              >
                Testni Boshlash
              </button>
            ) : (
              <div className="test-info">
                <p>Test boshlangan: {startTime.toLocaleTimeString()}</p>
              </div>
            )}
          </div>
        )}
        
        {testStarted && !submitted && (
          <div className="questions-wrapper">
            <div className="questions-container">
              {questions.map(q => (
                <div key={q.id} className="question-card">
                  <h3>{q.id}. {q.question}</h3>
                  <div className="options">
                    {Object.entries(q.options).map(([key, value]) => (
                      <div 
                        key={key}
                        className={`option ${selectedAnswers[q.id] === key ? 'selected' : ''}`}
                        onClick={() => handleAnswerSelect(q.id, key)}
                      >
                        <span className="option-letter">{key.toUpperCase()}</span>
                        <span className="option-text">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="submit-btn"
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length}
            >
              Testni Yakunlash
            </button>
          </div>
        )}
        
        {submitted && (
          <div className="results__container">
            <h2 className='results__container-title'>Test natijalari</h2>
            <div className="results__container-card">
              <p><strong>Ism:</strong> {userInfo.name}</p>
              <p><strong>Telefon:</strong> {userInfo.phone}</p>
              <p><strong>To'g'ri javoblar:</strong> {score}/{questions.length}</p>
              <p><strong>Foiz:</strong> {percentage.toFixed(0)}%</p>
              <p><strong>Davomiylik:</strong> {testDuration} soniya</p>
              <p><strong>Boshlanish vaqti:</strong> {startTime.toLocaleString()}</p>
              <p><strong>Tugash vaqti:</strong> {endTime.toLocaleString()}</p>
            </div>
            <p className="results__container-info">Ma'lumotlaringiz Telegram botga yuborildi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;