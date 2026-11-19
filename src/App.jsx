import { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  FaHeart,
  FaBirthdayCake,
  FaVolumeUp,
  FaVolumeMute,
  FaStar,
} from "react-icons/fa";
import "./App.css";
import "./desktop-fit.css"; // لازم يكون بعد App.css
import Confetti from "react-confetti";

const birthdays = [
  { name: "مودة", month: 7, day: 25 },
  { name: "حذيفه", month: 12, day: 10 },
  { name: "هدايه", month: 11, day: 20 },
  { name: "نور", month: 8, day: 20 },
  { name: "امي الغاليه", month: 4, day: 3 },
  { name: "بابا الغالي", month: 2, day: 16 },
  { name: "يوسف", month: 9, day: 19 },
];

function getNextBirthday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nextBirthday = null;
  let minDiff = Infinity;

  for (const person of birthdays) {
    let date = new Date(today.getFullYear(), person.month - 1, person.day);
    date.setHours(0, 0, 0, 0);

    if (date < today) {
      date = new Date(today.getFullYear() + 1, person.month - 1, person.day);
    }

    const diff = date.getTime() - today.getTime();

    if (diff < minDiff) {
      minDiff = diff;
      nextBirthday = { ...person, date };
    }
  }

  return nextBirthday;
}

function getBirthdayToday() {
  const today = new Date();

  return birthdays.find(
    (person) =>
      person.month === today.getMonth() + 1 &&
      person.day === today.getDate()
  );
}

function calculateTimeLeft(targetDate) {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CakeAnimation() {
  return (
    <div className="animated-cake-container">
      <div className="cake-shadow" />

      <div className="cake">
        {/* Base */}
        <div className="cake-base cake-tier">
          <div className="cake-icing">
            <span className="icing-drip drip-1" />
            <span className="icing-drip drip-2" />
            <span className="icing-drip drip-3" />
            <span className="icing-drip drip-4" />
            <span className="icing-drip drip-5" />
          </div>

          <div className="cake-sprinkles">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>

        {/* Middle tier */}
        <div className="cake-middle cake-tier">
          <div className="cake-icing">
            <span className="icing-drip drip-1" />
            <span className="icing-drip drip-2" />
            <span className="icing-drip drip-3" />
            <span className="icing-drip drip-4" />
          </div>

          <div className="cake-sprinkles">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>

        {/* Top tier */}
        <div className="cake-top cake-tier">
          <div className="cake-icing">
            <span className="icing-drip drip-1" />
            <span className="icing-drip drip-2" />
            <span className="icing-drip drip-3" />
          </div>

          <div className="cake-sprinkles">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>

        {/* 3 Candles */}
        <div className="cake-candles">
          {[0, 1, 2].map((candle) => (
            <div className={`cake-candle candle-${candle + 1}`} key={candle}>
              <div className="candle-flame" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [targetPerson, setTargetPerson] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // على شاشات اللاب والـ PC: بنصغّر المحتوى تلقائيًا لحد ما يظهر كله في الشاشة من غير اسكرول
  const containerRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);

  const audioRef = useRef(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const desktop = window.matchMedia("(min-width: 1024px)");

    const fit = () => {
      if (!desktop.matches) {
        setFitScale(1); // الموبايل والتابلت: الصفحة عادية (ممكن تتسكرول)
        return;
      }
      const margin = 32;
      const scaleX = (window.innerWidth - margin) / el.offsetWidth;
      const scaleY = (window.innerHeight - margin) / el.offsetHeight;
      setFitScale(Math.min(1.15, scaleX, scaleY));
    };

    fit();

    // الحجم بيتغير لما تتغير الشاشة (عد تنازلي / يوم عيد الميلاد) أو لما الخطوط تتحمل
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    window.addEventListener("resize", fit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    const todayBirthday = getBirthdayToday();

    if (todayBirthday) {
      setTargetPerson(todayBirthday);
      setIsBirthdayToday(true);
    } else {
      setTargetPerson(getNextBirthday());
      setIsBirthdayToday(false);
    }

    const updateCountdown = () => {
      const birthdayToday = getBirthdayToday();

      if (birthdayToday) {
        setTargetPerson(birthdayToday);
        setIsBirthdayToday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const next = getNextBirthday();

      setTargetPerson(next);
      setIsBirthdayToday(false);

      if (next) {
        setTimeLeft(calculateTimeLeft(next.date));
      }
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  const formatNumber = (number) => String(number).padStart(2, "0");

  return (
    <main className="birthday-app h-full" style={{ "--fit-scale": fitScale }}>
      {isBirthdayToday && <Confetti recycle numberOfPieces={180} />}

      {/* BASE_URL بيخلي الملف يشتغل صح حتى لو الموقع على GitHub Pages تحت مسار فرعي */}
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}Happy.aac`}
        loop
        onEnded={() => setIsPlaying(false)}
      />

      <div className="background-decor decor-1">
        <FaStar />
      </div>
      <div className="background-decor decor-2">
        <FaStar />
      </div>
      <div className="background-decor decor-3">
        <FaHeart />
      </div>
      <div className="background-decor decor-4">
        <FaHeart />
      </div>

      <div className="birthday-container" ref={containerRef}>
        {/* <header className="birthday-header">
          <span className="eyebrow">
            <FaHeart /> A SPECIAL DAY <FaHeart />
          </span>

          <h1>
            Birthday
            <span className="title-highlight">Countdown</span>
          </h1>

          <p className="header-description">
            Counting down to a day filled with happiness, love and beautiful
            memories.
          </p>
        </header> */}

        <section className="birthday-card">
          {/* العمود الأول: الرسمة / التورتة */}
          <div className="card-visual">
            <div className="illustration-wrapper">
              {isBirthdayToday ? (
                <CakeAnimation />
              ) : (
                <div className="cake-illustration">
                  <div className="cake-icon">
                    <FaBirthdayCake />
                  </div>
                  <div className="cake-decoration decoration-left">
                    <FaStar />
                  </div>
                  <div className="cake-decoration decoration-right">
                    <FaHeart />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* العمود التاني: الاسم والعد التنازلي وزرار الموسيقى */}
          <div className="card-body">
            {isBirthdayToday ? (
              <div className="celebration-content">
                <span className="celebration-tag">
                  <FaStar /> TODAY IS THE DAY <FaStar />
                </span>

                <h2 className="birthday-name">
                  Happy Birthday <span>{targetPerson?.name}</span>!
                </h2>

                <p className="birthday-message">
                  Today is all about you! May your day be filled with love,
                  laughter, sweet surprises and endless happiness.
                </p>

                <div className="birthday-heart">
                  <FaHeart />
                  <FaHeart />
                  <FaHeart />
                </div>
                            <button
              className={`music-button ${isPlaying ? "music-playing" : ""}`}
              onClick={toggleMusic}
            >
              {isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
              {isPlaying ? "Pause Music" : "Play Birthday Music"}
            </button>
              </div>
              
            ) : (
              <>
                <div className="countdown-content">
                  <span className="countdown-label">NEXT BIRTHDAY</span>

                  <h2 className="birthday-name">
                    {targetPerson?.name || "..."}
                  </h2>

                  <p className="countdown-subtitle">
                    The big day is getting closer!
                  </p>
                </div>

                <div className="countdown-timer">
                  <div className="time-box">
                    <span className="time-number">
                      {formatNumber(timeLeft.days)}
                    </span>
                    <span className="time-label">Days</span>
                  </div>

                  <div className="time-separator">:</div>

                  <div className="time-box">
                    <span className="time-number">
                      {formatNumber(timeLeft.hours)}
                    </span>
                    <span className="time-label">Hours</span>
                  </div>

                  <div className="time-separator">:</div>

                  <div className="time-box">
                    <span className="time-number">
                      {formatNumber(timeLeft.minutes)}
                    </span>
                    <span className="time-label">Minutes</span>
                  </div>

                  <div className="time-separator">:</div>

                  <div className="time-box">
                    <span className="time-number">
                      {formatNumber(timeLeft.seconds)}
                    </span>
                    <span className="time-label">Seconds</span>
                  </div>
                </div>
              </>
            )}


          </div>
        </section>
      </div>
    </main>
  );
}