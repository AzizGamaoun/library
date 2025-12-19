import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Edit, Trash2, Plus, X, 
  AlertCircle, Check, Loader, BookMarked, Calendar,
  User as UserIcon, FileText, CheckCircle, XCircle
} from 'lucide-react';
import livreService from '../services/livreService';
import Navbar from './Navbar';
const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    pub_year: '',
    copies: 1,
    availability: true
  });
  

  // Charger les livres
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await livreService.getAllLivres();
      setBooks(response.livres || response || []);
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir modal pour éditer
  const handleEdit = (book) => {
    setModalMode('edit');
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre || '',
      isbn: book.isbn || '',
      pub_year: book.pub_year || '',
      copies: book.copies || 1,
      availability: book.availability
    });
    setShowModal(true);
  };

  // Ouvrir modal pour créer
  const handleCreate = () => {
    setModalMode('create');
    setSelectedBook(null);
    setFormData({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      pub_year: '',
      copies: 1,
      availability: true
    });
    setShowModal(true);
  };

  // Sauvegarder (create ou update)
  const handleSave = async () => {
    try {
      if (modalMode === 'edit') {
        await livreService.updateLivre(selectedBook._id, formData);
        setSuccess('Book updated successfully');
      } else {
        await livreService.createLivre(formData);
        setSuccess('Book created successfully');
      }
      
      setShowModal(false);
      fetchBooks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  // Supprimer un livre
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await livreService.deleteLivre(id);
      setSuccess('Book deleted successfully');
      fetchBooks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  // Filtrer les livres
  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
           <Navbar/>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
     
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {books.length} books in library
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <Check className="w-5 h-5" />
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Author</th>
                   
                    <th className="px-6 py-4 text-left text-sm font-semibold">Genre</th>
                   
                    <th className="px-6 py-4 text-center text-sm font-semibold">Availability</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No books found
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book, index) => (
                      <tr 
                        key={book._id || index} 
                        className="hover:bg-indigo-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                              <BookMarked className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {book.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            {book.author}
                          </div>
                        </td>
                    
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {book.genre}
                          </span>
                        </td>
                
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            {book.availability ? (
                              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                <CheckCircle className="w-3 h-3" />
                                Disponible
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                <XCircle className="w-3 h-3" />
                                Indisponible
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(book)}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(book._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {modalMode === 'edit' ? 'Edit Book' : 'Add New Book'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                    placeholder="Author name"
                  />
                </div>


                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                    placeholder="e.g., Fiction, Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max={new Date().getFullYear()}
                    value={formData.pub_year}
                    onChange={(e) => setFormData({ ...formData, pub_year: parseInt(e.target.value) || '' })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                    placeholder="e.g., 1949"
                  />
                </div>

                

             
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                {modalMode === 'edit' ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    </div>
    
  );
};

export default BookManagement;