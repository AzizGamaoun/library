import React from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Icône illustrative */}
        <div className="mb-10 relative">
          <div className="mx-auto w-48 h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-2xl">
            <AlertCircle className="w-24 h-24 text-indigo-600" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-4 -right-4 bg-red-100 text-red-600 text-5xl font-bold rounded-full w-20 h-20 flex items-center justify-center shadow-lg animate-pulse">
            404
          </div>
        </div>

        {/* Titre et message */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Oups ! Page introuvable
        </h1>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>

        </div>

        
      </div>
    </div>
  );
};

export default NotFound;