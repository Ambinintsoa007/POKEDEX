import {Fragment, useEffect, useState} from "react";

function App() {
//----------------------------------STYLE--------------------------------------------
    let Pstyle = {
        fontsize: '2rem',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        paddingLeft: '1rem'
    }
    let headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: '100px',
        border: '1px, solid, black'
    }
    let searchBarStyle = {
        borderRadius: '8px',
        border: '1px, solid, black',
        width: '20rem',
        height: '1.5rem'
    }
    let searchIconStyle = {
        backgroundColor: '#fff',
        border: 'none',
        cursor: 'pointer'
    }
    let divPokemonSectionStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
//-------------------------------------HOOK-----------------------------------------
    const [iconClick, setIconClick] = useState(false)
    const iconIsClicked = () =>{
        setIconClick(!iconClick)
    }

//----------------------------------------RECUPERATION API----------------------------------------
    const [pokemon, setPokemon] = useState(null)

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon/')
            .then(res => res.json())
            .then(data => setPokemon(data))
    }, []);

//------------------------------------FUNCTION FOR THE BALISES---------------------------------------------
    const LogoPokemon = () => {
        return <img src="/src/asset/logo_pokemon.png" alt="a" style={{width: 30, height: 30}}/>
    }
    const SearchIcon = ({onClick}) => {
        return <button style={searchIconStyle} onClick={onClick} id="button">
            <img src="/src/asset/magnifying-glass-solid-full.svg" alt="search_icon" style={{width: 30, height: 30}} />
        </button>
    }
    const SearchBar = ({style}) => {
        return <input type="text" placeholder={'   search...'} style={style} id="input"/>
    }
    const DivPokemon = () => {
        return <section style={divPokemonSectionStyle}>
            <div>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} width='100px' height='100px'/>
            </div>
            <h2>{pokemon.name}</h2>
            <ul style={{listStyleType: 'none'}}>
                <li>Height : {pokemon.height}</li>
                <li>Width : {pokemon.width}</li>
            </ul>
        </section>
    }
//-------------------------------------------------------------------------------
    return <>
            <header style={headerStyle}>
                <div style={{display: 'flex',alignItems: 'center'}}>
                    <LogoPokemon/>
                    <p style={Pstyle}>POKEDEX</p>
                </div>
                {iconClick && (<SearchBar style={searchBarStyle}/>)}
                <SearchIcon style={{paddingLeft: '50px'}} onClick={iconIsClicked}/>
            </header>

        {pokemon && <DivPokemon/>}
    </>
}

export default App