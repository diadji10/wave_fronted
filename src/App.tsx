import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhoneNumberInput from './pages/PhoneNumberInput';
import OTPInput from './pages/OTPInput';
import SecretCodeInput from './pages/SecretCodeInput';
import PasswordChange from './pages/PasswordChange';
import PasswordConfirm from './pages/PasswordConfirm';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhoneNumberInput />} />
        <Route path="/otp" element={<OTPInput />} />
        <Route path="/secret-code" element={<SecretCodeInput />} />
        <Route path="/password-change" element={<PasswordChange />} />
        <Route path="/password-confirm" element={<PasswordConfirm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
