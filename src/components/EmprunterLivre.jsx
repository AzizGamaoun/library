import React, { useEffect, useState } from "react";
import livreService from "../services/livreService"
import loanService from "../services/loanService"; 
import userService from '../services/userService';
import { LogOut, BookOpen, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const BorrowBookPage = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [borrowingId, setBorrowingId] = useState(null);
  const navigate = useNavigate();

  // Récupérer l'utilisateur connecté depuis localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const student_id = user.id;
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      userService.logout();
      navigate('/login');
    }
  };
  
   


  useEffect(() => {
    if (!student_id) {
      setError("Vous devez être connecté pour emprunter un livre.");
      setLoading(false);
      return;
    }

    const fetchLivres = async () => {
      try {
        const data = await livreService.getAllLivres();
        setLivres(data.livres || data.books || data);
        console.log("Livres disponibles:", data);
      } catch (err) {
        setError("Impossible de charger la liste des livres");
      } finally {
        setLoading(false);
      }
    };

    fetchLivres();
  }, [student_id]);

  const handleBorrow = async (book_id) => {
    if (!student_id) {
      alert("Utilisateur non identifié.");
      return;
    }

    setBorrowingId(book_id);
    setSuccessMessage(null);
    setError(null);

    try {
      const response = await loanService.createLoan({ book_id, student_id });
      if (response.success) {
        setSuccessMessage(`Le livre "${response.loan.book_id?.title || 'inconnu'}" a été emprunté avec succès !`);
        setLivres(prev =>
          prev.map(livre =>
            livre._id === book_id ? { ...livre, availability: false } : livre
          )
        );
      }
    } catch (err) {
      setError(err.message || "Impossible d'emprunter ce livre (déjà emprunté ou erreur serveur)");
    } finally {
      setBorrowingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header avec Logout */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Emprunter un Livre
                </h1>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* User Welcome */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Bonjour <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.Firstname || user.name}</span> ! Choisissez un livre disponible ci-dessous.
              </p>
            </div>
          </div>
            
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-8 p-5 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-center font-medium shadow-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-8 p-5 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-center font-medium shadow-lg">
            {successMessage}
          </div>
        )}

        {/* Grille de livres */}
        {livres.filter(livre => livre.availability).length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-12">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-500 dark:text-gray-400">Aucun livre disponible pour le moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {livres.filter(livre => livre.availability).map((livre) => (
              <div
                key={livre._id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image placeholder */}
                <div className="h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {livre.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    <span className="font-medium">Auteur :</span> {livre.author}
                  </p>

                  {livre.ISBN && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      ISBN : {livre.ISBN}
                    </p>
                  )}

                  {livre.genre && (
                    <span className="inline-block px-3 py-1 mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                      {livre.genre}
                    </span>
                  )}

                  {/* Statut disponibilité */}
                  <div className="mb-6">
                    {livre.availability ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        ✓ Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                        ✗ Emprunté
                      </span>
                    )}
                  </div>

                  {/* Bouton d'emprunt */}
                  <button
                    onClick={() => handleBorrow(livre._id)}
                    disabled={!livre.availability || borrowingId === livre._id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      livre.availability
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    } ${borrowingId === livre._id ? "opacity-80 cursor-wait" : ""}`}
                  >
                    {borrowingId === livre._id ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Emprunt en cours...
                      </span>
                    ) : livre.availability ? (
                      "Emprunter ce livre"
                    ) : (
                      "Indisponible"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowBookPage;