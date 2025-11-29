import { useState, useEffect } from 'react';

export default function SearchPage() {
  const [films, setFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/films/');
      if (!response.ok) {
        throw new Error('Failed to fetch films');
      }
      const data = await response.json();
      setFilms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFilms = films.filter(film => {
    const query = searchQuery.toLowerCase();
    return (
      film.title?.toLowerCase().includes(query) ||
      film.director?.toLowerCase().includes(query) ||
      film.genre?.toLowerCase().includes(query) ||
      film.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Film Search</h1>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search films by title, director, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading films...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
            <button
              onClick={fetchFilms}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 text-gray-600">
              {filteredFilms.length} {filteredFilms.length === 1 ? 'film' : 'films'} found
            </div>

            {filteredFilms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No films found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFilms.map((film) => (
                  <div
                    key={film.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {film.title}
                      </h3>
                      
                      {film.director && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Director:</span> {film.director}
                        </p>
                      )}
                      
                      {film.year && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Year:</span> {film.year}
                        </p>
                      )}
                      
                      {film.genre && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                          {film.genre}
                        </span>
                      )}
                      
                      {film.description && (
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {film.description}
                        </p>
                      )}
                      
                      {film.rating && (
                        <div className="mt-4 flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-sm font-medium text-gray-700">
                            {film.rating}/10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}