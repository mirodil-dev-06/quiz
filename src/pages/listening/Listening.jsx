import { useState } from 'react';
import '../listening/Listening.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import music from '../../assets/music.mp3'

const Listening = () => {
  const questions = [
    { id: 1, question: "React - JavaScript kutubxonasimi?", correctAnswer: true },
    { id: 2, question: "useState - Reactning asosiy hook'laridan biri emasmi?", correctAnswer: false },
    { id: 3, question: "JSX - JavaScriptni kengaytmasi hisoblanadimi?", correctAnswer: true },
    { id: 4, question: "React - JavaScript kutubxonasimi?", correctAnswer: true },
    { id: 5, question: "useState - Reactning asosiy hook'laridan biri emasmi?", correctAnswer: false },
    { id: 6, question: "JSX - JavaScriptni kengaytmasi hisoblanadimi?", correctAnswer: true }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const sendResultsToTelegram = async (resultsData) => {
    const TELEGRAM_BOT_TOKEN = '6456711758:AAGhN0zQzQG9Xfr6gRG6pD5xcJmlTN_eIOc';
    const TELEGRAM_CHAT_ID = '5084402296';
    
    const message = `Test natijalari:\n\n${resultsData.map(item => 
      `${item.id}. ${item.question}\nJavob: ${item.userAnswer ? "✅ To'g'ri" : "❌ Noto'g'ri"}\nTo'g'ri javob: ${item.correctAnswer ? "✅ True" : "❌ False"}\n`
    ).join('\n')}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      if (response.ok) {
        toast.success("Natijalar muvaffaqiyatli Telegramga yuborildi!");
      } else {
        toast.error("Telegramga yuborishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
      toast.error("Xatolik yuz berdi: " + error.message);
    }
  };

  const checkAnswers = () => {
    // Barcha savollarga javob berilganligini tekshirish
    const allAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);
    
    if (!allAnswered) {
      toast.warning("Iltimos, barcha savollarga javob bering!");
      return;
    }

    const newResults = {};
    questions.forEach(q => {
      newResults[q.id] = selectedAnswers[q.id] === q.correctAnswer;
    });
    
    setResults(newResults);
    setIsSubmitted(true);
    
    // Telegramga yuborish uchun ma'lumotlarni tayyorlash
    const resultsData = questions.map(q => ({
      id: q.id,
      question: q.question,
      userAnswer: selectedAnswers[q.id],
      correctAnswer: q.correctAnswer,
      isCorrect: newResults[q.id]
    }));
    
    sendResultsToTelegram(resultsData);
    
    // To'g'ri javoblar sonini hisoblash
    const correctCount = Object.values(newResults).filter(Boolean).length;
    toast.success(`Siz ${correctCount} ta savolga to'g'ri javob berdingiz!`);
  };

  return (
    <div className="container mt-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>№</th>
            <th>True</th>
            <th>False</th>
            <th>Savol</th>
            <th>Natija</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${q.id}`}
                    checked={selectedAnswers[q.id] === true}
                    onChange={() => handleAnswerChange(q.id, true)}
                    disabled={isSubmitted}
                  />
                </div>
              </td>
              <td>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${q.id}`}
                    checked={selectedAnswers[q.id] === false}
                    onChange={() => handleAnswerChange(q.id, false)}
                    disabled={isSubmitted}
                  />
                </div>
              </td>
              <td>{q.question}</td>
              <td>
                {results[q.id] !== undefined && (
                  <span className={results[q.id] ? "text-success" : "text-danger"}>
                    {results[q.id] ? "✅ To'g'ri" : "❌ Noto'g'ri"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {!isSubmitted ? (
        <button 
          className="btn btn-primary mt-3"
          onClick={checkAnswers}
        >
          Javoblarni Tekshirish
        </button>
      ) : (
        <button 
          className="btn"
          onClick={() => {
            setSelectedAnswers({});
            setResults({});
            setIsSubmitted(false);
            toast.info("Yangi test boshlanishi!");
          }}
        >
          Qayta Urinish
        </button>
      )}
      <br /><br />
      <audio controls src={music}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Listening;