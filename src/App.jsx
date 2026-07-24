import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import React, { useState, useEffect } from "react";
import { FaHeart, FaBirthdayCake, FaGift } from "react-icons/fa";
import confetti from "canvas-confetti";

export default function App() {
  const birthdaysList = [
    { name: "مودة", month: 7, day: 25 },
    { name: "حذيفه", month: 12, day: 10 },
    { name: "هدايه", month: 11, day: 18 },
    { name: "نور", month: 8, day: 20 },
    { name: " امي الغاليه", month: 4, day: 3 },
    { name: "بابا الغالي", month: 2, day: 16 },
    { name: "يوسف", month: 9, day: 19 },
  ];

  const [nearestBirthday, setNearestBirthday] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  useEffect(() => {
    const findNearestBirthday = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      let closest = null;
      let minDifference = Infinity;

      birthdaysList.forEach((person) => {
        let birthdayDate = new Date(currentYear, person.month - 1, person.day);

        // إذا مر عيد الميلاد هذا العام، احسبه للسنة القادمة
        if (birthdayDate < now && (now - birthdayDate > 86400000)) {
          birthdayDate = new Date(currentYear + 1, person.month - 1, person.day);
        }

        const difference = birthdayDate - now;

        if (difference >= 0 && difference < minDifference) {
          minDifference = difference;
          closest = person;
        }
      });

      return closest;
    };

    const targetPerson = findNearestBirthday();
    setNearestBirthday(targetPerson);

    const checkBirthdayAndCountdown = () => {
      if (!targetPerson) return;

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();

      // التحقق مما إذا كان اليوم هو عيد ميلاد الشخص الأقرب
      if (currentMonth === targetPerson.month && currentDay === targetPerson.day) {
        setIsBirthdayToday(true);
      } else {
        setIsBirthdayToday(false);
        
        const currentYear = now.getFullYear();
        let birthday = new Date(currentYear, targetPerson.month - 1, targetPerson.day);
        if (now > birthday) {
          birthday = new Date(currentYear + 1, targetPerson.month - 1, targetPerson.day);
        }

        const difference = birthday - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    checkBirthdayAndCountdown();
    const timer = setInterval(checkBirthdayAndCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // ألعاب نارية مستمرة في الخلفية
  useEffect(() => {
    const interval = setInterval(() => {
      confetti({
        particleCount: 30,
        spread: 90,
        startVelocity: 30,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#ff007f', '#ffd700', '#ff4d4d', '#ffffff', '#da70d6'],
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!nearestBirthday) return null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-950 via-indigo-900 to-pink-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-white overflow-x-hidden relative">
      
      {/* خلفية مضيئة متجاوبة */}
      <div className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-72 h-72 sm:w-96 sm:h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 sm:-bottom-40 sm:-right-40 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      {/* الكارد الرئيسي المتجاوب */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-10 lg:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_40px_rgba(255,105,180,0.2)] max-w-lg w-full text-center space-y-6 z-10 mx-4">
        
        {isBirthdayToday ? (
          <>
            <div className="flex justify-center animate-bounce">
              <div className="p-3 sm:p-4 bg-yellow-400/25 rounded-full border border-yellow-300/50 shadow-lg">
                <FaBirthdayCake className="text-yellow-300 w-14 h-14 sm:w-20 sm:h-20" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider bg-gradient-to-r from-yellow-200 via-pink-300 to-white bg-clip-text text-transparent leading-relaxed py-1">
              Happy Birthday, {nearestBirthday.name}! 🎉
            </h1>
            <p className="text-sm sm:text-lg text-pink-100 font-medium leading-relaxed">
              النهارده أجمـل يوم في السنة لأنه عيد ميلادك! نتمنى لك سنة مليانة سعادة وتحقيق لكل أحلامك. 🎂✨
            </p>
            <div className="pt-2 flex justify-center gap-6 text-2xl sm:text-3xl">
              <FaHeart className="text-red-400 animate-pulse" />
              <FaGift className="text-yellow-300 animate-bounce" />
              <FaHeart className="text-red-400 animate-pulse" />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="p-3 sm:p-4 bg-pink-500/20 rounded-full border border-pink-400/40 animate-pulse">
                <FaGift className="text-pink-300 w-12 h-12 sm:w-16 sm:h-16" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide text-pink-200">
              قريباً عيد ميلاد {nearestBirthday.name} ⏳
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm">
               العد التنازلي لعيد ميلاد {nearestBirthday.name} القادم {nearestBirthday.day} / {nearestBirthday.month} : 
            </p>
            
            {/* مربعات العد التنازلي المتجاوبة */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                <span className="text-2xl sm:text-3xl font-black text-yellow-300 block">{timeLeft.days}</span>
                <span className="text-xs uppercase text-pink-200 block mt-1">يوم</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                <span className="text-2xl sm:text-3xl font-black text-pink-300 block">{timeLeft.hours}</span>
                <span className="text-xs uppercase text-pink-200 block mt-1">ساعة</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                <span className="text-2xl sm:text-3xl font-black text-purple-300 block">{timeLeft.minutes}</span>
                <span className="text-xs uppercase text-pink-200 block mt-1">دقيقة</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                <span className="text-2xl sm:text-3xl font-black text-blue-300 block">{timeLeft.seconds}</span>
                <span className="text-xs uppercase text-pink-200 block mt-1">ثانية</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}