import React, { useEffect, useState } from "react";
import loanService from "../services/loanService"; // adapte le chemin
import { format } from "date-fns"; // npm install date-fns si pas déjà installé
import { fr } from "date-fns/locale"; // pour dates en français
import Navbar from './Navbar';
import { Trash2,CheckLine  } from 'lucide-react';
const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger tous les emprunts au montage
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await loanService.getAllLoans();
        if (data.success) {
          setLoans(data.loans);
        } else {
          setError(data.message || "Erreur lors du chargement");
        }
      } catch (err) {
        setError(err.message||"Impossible de charger les emprunts");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Fonction pour retourner un livre
  const handleReturn = async (loanId) => {
    if (!window.confirm("Confirmer le retour de ce livre ?")) return;

    try {
      const data = await loanService.returnLoan(loanId);
      if (data.success) {
        setLoans((prev) =>
          prev.map((loan) =>
            loan._id === loanId ? { ...loan, return_date: new Date() } : loan
          )
        );
      }
    } catch (err) {
      alert(err.message||"Erreur lors du retour du livre");
    }
  };

  // Fonction pour supprimer un emprunt (admin)
  const handleDelete = async (loanId) => {
    if (!window.confirm("Supprimer définitivement cet emprunt ?")) return;

    try {
      const data = await loanService.deleteLoan(loanId);
      if (data.success) {
        setLoans((prev) => prev.filter((loan) => loan._id !== loanId));
      }
    } catch (err) {
      alert(err.message||"Erreur lors de la suppression");
    }
  };

  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr });
  };

  // Déterminer le statut visuel
  const getStatusBadge = (loan) => {
    if (loan.return_date) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Retourné
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
        En cours
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
        <Navbar/>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestion des Emprunts
          </h1>
          <p className="text-lg text-gray-600">
            Suivi complet des livres empruntés et retournés
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total emprunts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loans.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {loans.filter((l) => !l.return_date).length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retournés</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {loans.filter((l) => l.return_date).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des emprunts */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Liste des emprunts</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date emprunt
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date retour
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      Aucun emprunt enregistré pour le moment
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => (
                    <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {loan.student_id.Firstname} {loan.student_id.Lastname}
                          </div>
                          <div className="text-sm text-gray-500">{loan.student_id.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {loan.book_id.title}
                          </div>
                          <div className="text-sm text-gray-500">par {loan.book_id.author}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(loan.loan_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(loan.return_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(loan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!loan.return_date && (
                          <CheckLine
                            onClick={() => handleReturn(loan._id)}
                            className="text-blue-600 hover:text-blue-900 mr-4 font-medium cursor-pointer"
                          >
                            
                          </CheckLine>
                        )}
                        <Trash2   
                          onClick={() => handleDelete(loan._id)}
                          className="w-4 h-4 text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          
                        </Trash2>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoanManagement;