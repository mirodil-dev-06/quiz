import React, { useState } from 'react';
import '../reading/Reading.css'
import Slider2 from '../../components/slider2/Slider2'

function Reading() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [nextOrder, setNextOrder] = useState(1);

  const handleCheckboxChange = (index) => {
    setSelectedOptions(prev => {
      // Agar checkbox tanlangan bo'lsa, uni olib tashlash
      if (prev.some(item => item.index === index)) {
        return prev.filter(item => item.index !== index);
      } 
      // Yangi checkbox tanlangan bo'lsa
      else {
        const newItem = { index, order: nextOrder };
        setNextOrder(nextOrder + 1);
        return [...prev, newItem].sort((a, b) => a.index - b.index);
      }
    });
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
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
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
                  Variant {index + 1}
                </span>
              </label>
            </div>
          );
        })}
      </div>

    </div>
    </div>
  );
}

export default Reading;