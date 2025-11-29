"use client";
import { useState, useEffect } from 'react';
import { User, Calendar } from 'lucide-react';

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
    <main className="min-h-screen flex flex-col items-center mt-40 w-3xl mx-auto">
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
              <div className="flex flex-col gap-6 self-start w-full">
                {filteredFilms.map((film) => (
                  <div
                    key={film.id}
                    className="flex flex-col w-full"         
                  >
                    <a href={`/film/${film.id}`} className="flex w-full gap-6">
                        <img src={film.poster_url} alt={film.title} className="rounded-xl outline-2 outline-[#8D99AE] shadow-2xl shadow-[#8d99ae2c] w-48 h-64 object-cover flex-shrink-0"/>
                        <div>
                            <h3 className="text-xl font-semibold text-neutral-50">{film.title.slice(0, 70)} {film.title.length > 70 ? "..." : ""}</h3>
                            <p className="text-neutral-300 text-sm">{film.description.slice(0, 500)} {film.description.length > 500 ? "..." : ""}</p>
                            <p className="mt-4 text-sm text-neutral-400"><User className="inline w-5" /> {film.creator}</p>
                            <p className="text-sm text-neutral-400"><Calendar className="inline w-5" /> {film.year}</p>
                        </div>
                    </a>
                    <hr className="my-6 border-neutral-200/20 w-full"/>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
    </main>
  );
}