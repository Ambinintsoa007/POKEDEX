import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from "react-router-dom";

function Home() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((res) => res.json())
      .then((data) => setPokemonList(data.results));
  }, []);

  const getPokemonIdFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Liste des Pokémon</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {pokemonList.map((pokemon) => (
          <Link
            to={`/pokemon/${pokemon.name}`}
            key={pokemon.name}
            style={{
              textDecoration: "none",
              color: "black",
              border: "1px solid black",
              padding: "1rem",
              borderRadius: "8px",
              textAlign: "center",
              width: "120px"
            }}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png`}
              alt={pokemon.name}
            />
            <h4>{pokemon.name.toUpperCase()}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState("");
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

  if (!pokemon) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Retour
      </button>
      <h1>{pokemon.name.toUpperCase()}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p>
        <strong>Description :</strong> {description}
      </p>
      <p>
        <strong>Height :</strong> {pokemon.height / 10} m
      </p>
      <p>
        <strong>Weight :</strong> {pokemon.weight / 10} kg
      </p>

      <h3>Abilities :</h3>
      <ul>
        {pokemon.abilities.map((a, i) => (
          <li key={i}>{a.ability.name}</li>
        ))}
      </ul>

      <h3>Base Stats :</h3>
      <ul>
        {pokemon.stats.map((stat, i) => {
          const min =
            stat.stat.name === "hp"
              ? Math.floor(((2 * stat.base_stat) * 100) / 100 + 110)
              : Math.floor(
                  ((2 * stat.base_stat + 31 + Math.floor(252 / 4)) * 100) /
                    100 +
                    5
                );
          const max = min;
          return (
            <li key={i}>
              <strong>{stat.stat.name.toUpperCase()}</strong>:{" "}
              {stat.base_stat} (Min: {min}, Max: {max})
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
