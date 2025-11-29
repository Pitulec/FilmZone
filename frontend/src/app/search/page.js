"use client";
import { useState, useEffect } from 'react';
import Poster from '@/components/Poster';

export default function SearchPage() {
  const [films, setFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await fetch('http://localhost:8000/films/');
      if (!response.ok) {
        throw new Error('Failed to fetch films');
      }
      const data = await response.json();
      setFilms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
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
    <main className="min-h-screen flex flex-col items-center mt-40 w-xl mx-auto">
      <h1 className='font-semibold text-3xl mb-6'>Film Search</h1>
        <input
          type="text"
          placeholder="Search films by title, director, genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-4 outline outline-[#8D99AE] shadow-2xl shadow-[#8d99ae2c] bg-[#8d99ae1c] rounded-xl w-full mb-6"
          />

        { error && (
          <div className="bg-red-50/80 border border-red-200 rounded-lg p-3 mb-6 w-full">
            <p className="text-red-700 font-semibold">Error: {error}</p>
            <button
              onClick={fetchFilms}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!error && (
          <>
            <div className="mb-4 text-neutral-400">
              {filteredFilms.length} {filteredFilms.length === 1 ? 'film' : 'films'} found
            </div>

            {filteredFilms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-400 text-xl">No films found matching your search.</p>
              </div>
            ) : (
            <>
                <div>
                    <Poster />
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFilms.map((film) => (
                  <div
                    key={film.id}
                    className="bg-white/5 rounded-lg outline outline-[#8d99aebe]"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-neutral-50 mb-2">
                        {film.title}
                      </h3>
                      
                      {film.creator && (
                        <p className="text-sm text-neutral-300 mb-2">
                          <span className="font-medium">Director:</span> {film.creator}
                        </p>
                      )}
        
                      {film.year && (
                        <p className="text-sm text-neutral-400 mb-2">
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
            </>
            )}
          </>
        )}
    </main>
  );
}