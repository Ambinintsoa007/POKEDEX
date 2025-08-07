import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from "react-router-dom";
import "./index.css";

// Navbar avec recherche intelligente
function Navbar() {
  const [search, setSearch] = useState("");
  const [allPokemon, setAllPokemon] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10000")
      .then((res) => res.json())
      .then((data) => setAllPokemon(data.results));
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    if (!query) return setFiltered([]);

    if (!isNaN(query)) {
      const match = allPokemon[parseInt(query) - 1];
      setFiltered(match ? [match] : []);
    } else {
      const matches = allPokemon.filter((p) =>
        p.name.includes(query)
      );
      setFiltered(matches.slice(0, 10));
    }
  }, [search, allPokemon]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filtered.length > 0) {
      navigate(`/pokemon/${filtered[0].name}`);
      setSearch("");
      setFiltered([]);
    }
  };

  const handleSuggestionClick = (name) => {
    navigate(`/pokemon/${name}`);
    setSearch("");
    setFiltered([]);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
            alt="Logo"
          />
          <h1>Pokédex</h1>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Nom ou numéro"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {filtered.length > 0 && (
          <ul className="suggestions">
            {filtered.map((pokemon) => (
              <li
                key={pokemon.name}
                onClick={() => handleSuggestionClick(pokemon.name)}
              >
                {pokemon.name}
              </li>
            ))}
          </ul>
        )}
      </form>
    </nav>
  );
}

// Accueil
function Home() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=24")
      .then((res) => res.json())
      .then((data) => setPokemonList(data.results));
  }, []);

  const getPokemonIdFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };

  return (
    <div className="container">
      <h2 className="title">Liste des Pokémon</h2>
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <Link
            to={`/pokemon/${pokemon.name}`}
            key={pokemon.name}
            className="pokemon-card"
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png`}
              alt={pokemon.name}
            />
            <p>{pokemon.name.toUpperCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Fonction pour calculer min et max des stats
function calculateStatRanges(baseStat, statName) {
  if (statName === "hp") {
    const min = Math.floor(((2 * baseStat) * 100) / 100 + 110);
    const max = Math.floor(((2 * baseStat + 31 + Math.floor(252 / 4)) * 100) / 100 + 110);
    return { min, max };
  } else {
    const min = Math.floor(((2 * baseStat) * 100) / 100 + 5);
    const max = Math.floor(((2 * baseStat + 31 + Math.floor(252 / 4)) * 100) / 100 + 5);
    return { min, max };
  }
}

// Fiche Pokémon avec boutons Base, Min, Max
function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState("");
  const [displayMode, setDisplayMode] = useState("base"); // base, min ou max
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data);
        return fetch(data.species.url);
      })
      .then((res) => res.json())
      .then((speciesData) => {
        const entry = speciesData.flavor_text_entries.find(
          (e) => e.language.name === "en"
        );
        setDescription(
          entry?.flavor_text.replace(/\f/g, " ") || "No description."
        );
      });
  }, [name]);

  if (!pokemon) return <p className="loading">Loading...</p>;

  // Fonction qui retourne la valeur à afficher selon displayMode
  const getStatValue = (baseStat, statName) => {
    const { min, max } = calculateStatRanges(baseStat, statName);
    if (displayMode === "min") return min;
    if (displayMode === "max") return max;
    return baseStat;
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>
      <div className="pokemon-detail">
        <h2 className="pokemon-name">{pokemon.name}</h2>

        <img src={pokemon.sprites.front_default} alt={pokemon.name} />

        <p className="pokemon-description">{description}</p>

        <div className="pokemon-types">
          {pokemon.types.map(({ type }) => (
            <span key={type.name} className={`type ${type.name}`}>
              {type.name}
            </span>
          ))}
        </div>

        <p><strong>Hauteur :</strong> {pokemon.height / 10} m</p>
        <p><strong>Poids :</strong> {pokemon.weight / 10} kg</p>

        <div className="pokemon-abilities">
          <h3>Capacités</h3>
          <ul>
            {pokemon.abilities.map(({ ability }) => (
              <li key={ability.name}>{ability.name}</li>
            ))}
          </ul>
        </div>

        {/* Boutons pour choisir affichage des stats */}
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <button
            onClick={() => setDisplayMode("base")}
            style={{
              marginRight: "10px",
              backgroundColor: displayMode === "base" ? "#ef5350" : "#ddd",
              color: displayMode === "base" ? "white" : "black",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Base
          </button>
          <button
            onClick={() => setDisplayMode("min")}
            style={{
              marginRight: "10px",
              backgroundColor: displayMode === "min" ? "#ef5350" : "#ddd",
              color: displayMode === "min" ? "white" : "black",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Min
          </button>
          <button
            onClick={() => setDisplayMode("max")}
            style={{
              backgroundColor: displayMode === "max" ? "#ef5350" : "#ddd",
              color: displayMode === "max" ? "white" : "black",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Max
          </button>
        </div>

        <div className="pokemon-stats">
          <h3>Statistiques ({displayMode.toUpperCase()})</h3>
          {pokemon.stats.map(({ stat, base_stat }) => {
            const valueToShow = getStatValue(base_stat, stat.name);
            const widthPercent = (valueToShow / 150) * 100;

            return (
              <div className="stat" key={stat.name}>
                <span className="stat-name">{stat.name.toUpperCase()}</span>
                <div className="stat-bar">
                  <div
                    className="stat-bar-fill"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="stat-value">{valueToShow}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
