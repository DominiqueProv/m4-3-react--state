import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import GlobalStyles from './GlobalStyles';


const Auto = () => {

  //display to display our options
  const [display, setDisplay] = useState(false);
  //state to display our options
  const [options, setOptions] = useState([]);
  //state to display our search result
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);


  useEffect(() => {
    //Array that's gonna hold everything
    const pokemon = [];
    //new array to hold 20 result using the "new Array" 
    const promises = new Array(30)
      .fill()
      .map((value, index) => fetch(`https://pokeapi.co/api/v2/pokemon-form/${index + 1}`));
    Promise.all(promises).then((pokemonArr) => {
      return pokemonArr.map(res =>
        res.json().then(({ name, sprites: { front_default: sprite } }) => {
          return pokemon.push({ name, sprite })
        })
      );
    });
    setOptions(pokemon);
  }, []);

  //======
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return (() => {
      document.removeEventListener("mousedown", handleClickOutside)
    })
  }, []);

  const handleClickOutside = event => {

    const { current: wrap } = wrapperRef;
    console.log(wrapperRef)
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  }

//=======

  const setPokeDex = poke => {
    setSearch(poke);
    setDisplay(false);
  }

  const maxResults = 6;

  return (
    <>
      <GlobalStyles />
      <Wrapper ref={wrapperRef}>
        <div>
          <h1><img src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" /></h1>
        </div>
        <InputDisplay>
          <input
            id="auto"
            onClick={() => setDisplay(!display)}
            placeholder="Search your Pokemon"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          <ClearButton
            onClick={() => {
              setSearch('');
              setDisplay('');
            }}
          >
            Clear
        </ClearButton>
        </InputDisplay>
        {display && (
          <ListDisplay>
            {options
              .filter(({ name }) => name.indexOf(search.toLowerCase()) > -1)
              .slice(0, maxResults)
              .map((value, index) => {
                return (
                  <div
                    onClick={() => setPokeDex(value.name)}
                    key={index}
                    tabIndex="0"
                  >
                    <span>{value.name}</span>
                    <img src={value.sprite} alt="pokemon" />
                  </div>
                );
              })}
          </ListDisplay>
        )}
      </Wrapper>
    </>
  );
}



const App = (props) => {

  return (
    <div>

      <div></div>
      <div>
        <Auto />
      </div>
    </div>

  );
}


const InputDisplay = styled.div`
position: relative;
  input{
    width: 300px;
    height: 40px;
    outline: none;
    padding-left: 10px;
    font-size: 1em;
    text-transform: uppercase;
    border-radius: 5px;
    outline: none;

  }
`

const ListDisplay = styled.div`
position: absolute;
top: 210px;
display: flex;
flex-direction: column;
justify-content: space-between;
width: 100%;

  div{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width : 100%;
    background-color: white;
    padding: 0 20px;
    text-transform: uppercase;
    margin-bottom: 10px;
    border-radius: 5px;
    transition: all .2s ease;
    cursor: pointer;

    &:hover{
      background: #f1f1f1;

    }

    img{
      padding: 5px;
      width: 60px;
    }
  }
`
const Wrapper = styled.div`
/* width: 100vw; */
height: auto;
display: flex;
align-items: center;
position: fixed;
flex-direction:column;
top: 20%;
left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
  img{
      padding: 30px;
    }
`

const ClearButton = styled.button`
    margin-left: 10px;
    height: 40px;
    background: #3662AC;
    border-radius: 4px;
    border: none;
    padding: 0px 20px;
    font-size: 18px;
    color: #fff;
    text-transform: uppercase;
    font-size: 1em;
    transition: all .3s ease;
    outline: none;

      &:hover{
        background: #1E2D5E;
      }
`;


export default App;
