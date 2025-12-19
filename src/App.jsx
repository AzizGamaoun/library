import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import UserManagement from './components/UsersPage';
import BookManagement from './components/LivresPage';
import LoanManagement from './components/LoanPage';
import BorrowBookPage from './components/EmprunterLivre';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/livres" element={<BookManagement />} />
        <Route path="/loans" element={<LoanManagement />} />
        <Route path="/emprunter-livre" element={<BorrowBookPage />} />
        <Route path="*" element={<NotFound />} />
   
      </Routes>
    </Router>
  );
}

export default App;
