import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../reading/Reading.css';
import Slider2 from '../../components/slider2/Slider2';

function Reading() {
  // Local storagedan saqlangan javoblarni yuklash
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const saved = localStorage.getItem('readingTestAnswers');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Local storagedan keyingi tartib raqamini yuklash
  const [nextOrder, setNextOrder] = useState(() => {
    const saved = localStorage.getItem('readingTestNextOrder');
    return saved ? parseInt(saved) : 1;
  });

  const [showSubmitButton, setShowSubmitButton] = useState(false);

  // Tanlovlar o'zgarganda local storagega saqlash
  useEffect(() => {
    localStorage.setItem('readingTestAnswers', JSON.stringify(selectedOptions));
    localStorage.setItem('readingTestNextOrder', nextOrder.toString());
    
    // Barcha savollarga javob berilganda jo'natish tugmasi chiqadi
    setShowSubmitButton(selectedOptions.length === 10);
  }, [selectedOptions, nextOrder]);

  const handleCheckboxChange = (index) => {
    setSelectedOptions(prev => {
      // Agar checkbox tanlangan bo'lsa, uni olib tashlash
      if (prev.some(item => item.index === index)) {
        toast.info(`Savol #${index + 1} bekor qilindi`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return prev.filter(item => item.index !== index);
      } 
      // Yangi checkbox tanlangan bo'lsa
      else {
        const newItem = { index, order: nextOrder };
        setNextOrder(nextOrder + 1);
        toast.success(`Savol #${index + 1} tanlandi`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return [...prev, newItem].sort((a, b) => a.index - b.index);
      }
    });
  };

  // Testlarni tozalash funksiyasi
  const clearTest = () => {
    setSelectedOptions([]);
    setNextOrder(1);
    toast.warn('Barcha javoblar tozalandi!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Testni yakunlash va Telegram botga yuborish
  const submitTest = async () => {
    const toastId = toast.loading("Natijalar yuborilmoqda...", {
      position: "top-right"
    });

    // Test natijalarini tayyorlash
    const results = selectedOptions.map(item => {
      const question = questions[item.index];
      return {
        questionId: question.id,
        questionText: question.question,
        selectedOption: Object.keys(question.options)[item.order - 1],
        isCorrect: Object.keys(question.options)[item.order - 1] === question.correctAnswer
      };
    });

    // To'g'ri javoblar soni
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Telegram botga yuborish uchun xabar
    const message = `
      📝 *Test Natijalari* 📝
      ✅ To'g'ri javoblar: ${correctAnswers}
      ❌ Noto'g'ri javoblar: ${totalQuestions - correctAnswers}
      📊 Umumiy ball: ${score}%
      
      *Tafsilotlar:*
      ${results.map(r => `
        ❓ *Savol:* ${r.questionText}
        🟢 *Tanlangan:* ${r.selectedOption}
        ${r.isCorrect ? '✅ To\'g\'ri' : '❌ Noto\'g\'ri'}
      `).join('\n')}
    `;

    try {
      // Telegram botga yuborish
      const botToken = '6456711758:AAGhN0zQzQG9Xfr6gRG6pD5xcJmlTN_eIOc';
      const chatId = '5084402296';
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        toast.update(toastId, {
          render: "Test natijalari muvaffaqiyatli yuborildi!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        clearTest(); // Testni tozalash
      } else {
        toast.update(toastId, {
          render: "Xatolik yuz berdi. Iltimos, qayta urunib ko'ring.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Xatolik:', error);
      toast.update(toastId, {
        render: "Internet aloqasi bilan muammo. Iltimos, tekshiring.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

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


  return (
    <div className='reading'>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Slider2 className='slider2'/>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '0 20px',
        fontFamily: 'Arial, sans-serif'
      }} className='reading__quiz'>
        
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{textAlign: 'center', marginBottom: '20px'}}>React Testi</h2>
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
            <span>Tanlanganlar: {selectedOptions.length} / 10</span>
         
          </div>
          
          {[...Array(10)].map((_, index) => {
            const selectedItem = selectedOptions.find(item => item.index === index);
            const isSelected = !!selectedItem;
            
            return (
              <div key={index} style={{
                margin: '10px 0',
                padding: '10px',
                backgroundColor: isSelected ? '#e3f2fd' : 'white',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s'
              }}>
                {isSelected && (
                  <span style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    borderRadius: '4px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    marginRight: '10px',
                    fontWeight: 'bold'
                  }}>
                    {selectedItem.order}
                  </span>
                )}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  flex: 1,
                  marginLeft: isSelected ? '0' : '34px'
                }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(index)}
                    style={{
                      marginRight: '10px',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    color: isSelected ? '#4CAF50' : '#333'
                  }}>
                    {questions[index].question}
                  </span>
                </label>
              </div>
            );
          })}

          {showSubmitButton && (
            <div style={{textAlign: 'center', marginTop: '20px'}}>
              <button
                onClick={submitTest}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Testni Yakunlash va Jo'natish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reading;