import { useEffect,useState } from "react";

const PokeCard = ({ pokemon }) => {
    const [pokeState, setPokeState] = useState({});

    useEffect   (() => {
        fetch(pokemon.url)
            .then((response) => response.json())
            .then((data) => {
                setPokeState(data);
                console.log("Détails du Pokémon reçus:", data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des détails du Pokémon:", error);
            });
    }, [pokemon]);


    return (
        <div>
            <h3>{pokeState.name}</h3>
            <p>{pokeState.height}</p>
        </div>
    );
}

export default PokeCard;