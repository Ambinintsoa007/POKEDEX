import {Fragment, useState} from "react";

function App() {

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
        border: 'solid, black, 1px'
    }
    let searchBarStyle = {
        borderRadius: '8px',
        border: '1px, solid, black',
        width: '20rem',
        height: '1.5rem'
    }

    let [iconIsClicked, seticonIsClicked] = useState(false)
    const iconIsClick = () =>{
        iconIsClicked = true
    }

    let PokemonStyle = {
        borderRadius: '20px',
        width: '20rem',
        height: '20rem'
    }

    let PokemonBar = {
        borderRadius: '20px',
        width: '20rem'
    }

    let Id = {
        color: ''
    }


    const LogoPokemon = () => {
        return <img src="/src/asset/logo_pokemon.png" alt="a" style={{width: 30, heigth: 30}}/>
    }
    const SearchIcon = () => {
        return <img src="/src/asset/magnifying-glass-solid-full.svg" alt="search_icon" style={{width: 30, heigth: 30}} />
    }
    const SearchBar = ({style}) => {
        return <input type="text" placeholder={'search...'} style={style}/>
    }
    const DivPokemon = () => {
        return <section>
            <div>
                <img src="/src/asset/bulbizare.png" alt="b" style={PokemonStyle}/>
            </div>

        </section>
    }

    return <>
            <header style={headerStyle}>
                <div style={{display: 'flex',alignItems: 'center'}}>
                    <LogoPokemon/>
                    <p style={Pstyle}>POKEDEX</p>
                </div>
                <SearchBar onClick={iconIsClick} style={searchBarStyle}/>
                <SearchIcon style={{paddingLeft: '50'}}/>
            </header>

            <section style={{display: 'flex', alignItems: 'center',justifyContent: 'center', marginTop: '30px'}}>
                <div style={PokemonBar}>
                    <DivPokemon/>
                    <p style={Id}>N°001</p>
                    <p>
                        <h1>Bulbizarre</h1>
                    </p>
                </div>

            </section>
    </>
}

export default App