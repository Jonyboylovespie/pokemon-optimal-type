const colors = {
    NORMAL: '#A8A77A',
    FIRE: '#EE8130',
    WATER: '#6390F0',
    ELECTRIC: '#F7D02C',
    GRASS: '#7AC74C',
    ICE: '#96D9D6',
    FIGHTING: '#C22E28',
    POISON: '#A33EA1',
    GROUND: '#E2BF65',
    FLYING: '#A98FF3',
    PSYCHIC: '#F95587',
    BUG: '#A6B91A',
    ROCK: '#B6A136',
    GHOST: '#735797',
    DRAGON: '#6F35FC',
    DARK: '#705746',
    STEEL: '#B7B7CE',
    FAIRY: '#D685AD',
};

async function findWeaknesses(name) {
    
    let listItems = ["WEAKNESSES:"];
    for (let attackType of sortByFrequencyAndAlphabet(await goodAttackTypes(name)))
    {
        listItems.push(attackType.toUpperCase());
    }
    if (listItems.length === 1)
    {
        listItems = ["Name Invalid"];
    }
    else
    {
        listItems.push("RESISTANCES:");
        for (let attackType of await badAttackTypes(name))
        {
            listItems.push(attackType.toUpperCase());
        }
    }
    
    let element = document.getElementById('weaknesses');

    while (element.firstChild) 
    {
        element.removeChild(element.firstChild);
    }

    listItems.forEach(listItem => 
    {
        const listElement = document.createElement('li');
        listElement.textContent = listItem;
        if (listItem === "WEAKNESSES:" || listItem === "RESISTANCES:" || listItem === "Name Invalid")
        {
            listElement.style.fontSize = "30px";
            listElement.style.color = "white";
        }
        else
        {
            listElement.style.color = colors[listItem];
        }
        element.appendChild(listElement);
    })
}

async function fetchFromPokeAPI(endpoint) 
{
    const baseUrl = 'https://pokeapi.co/api/v2/';
    try 
    {
        const response = await fetch(`${baseUrl}${endpoint}`);

        if (!response.ok) 
        {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) 
    {
        console.error(`There was a problem fetching data from endpoint "${endpoint}":`, error);
        return null;
    }
}

async function getPokemonTypes(pokemonName) 
{
    let endpoint = "pokemon/" + pokemonName;
    let pokemon = await fetchFromPokeAPI(endpoint);

    if (pokemon && pokemon.types) 
    {
        return pokemon.types.map(typeInfo => typeInfo.type.name);
    }

    return [];
}

async function goodAttackTypes(pokemonName)
{
    let pokemonTypes = await getPokemonTypes(pokemonName);
    let goodAttackList = [];
    for (let pokemonType of pokemonTypes)
    {
        let endpoint = "type/" + pokemonType;
        let type = await fetchFromPokeAPI(endpoint);
        if (type && type.damage_relations && type.damage_relations.double_damage_from) 
        {
            let attackTypes = type.damage_relations.double_damage_from.map(double_damage_from_info => double_damage_from_info.name);
            for (let attackType of attackTypes) 
            {
                goodAttackList.push(attackType);
            }
        }
    }
    return goodAttackList;
}

async function badAttackTypes(pokemonName) {
    let pokemonTypes = await getPokemonTypes(pokemonName);
    let noDamageList = [];
    let halfDamageList = [];

    for (let pokemonType of pokemonTypes) {
        let endpoint = "type/" + pokemonType;
        let type = await fetchFromPokeAPI(endpoint);

        if (type && type.damage_relations && type.damage_relations.no_damage_from) {
            let attackTypes = type.damage_relations.no_damage_from.map(double_damage_from_info => double_damage_from_info.name);
            noDamageList.push(...attackTypes);
        }

        if (type && type.damage_relations && type.damage_relations.half_damage_from) {
            let attackTypes = type.damage_relations.half_damage_from.map(double_damage_from_info => double_damage_from_info.name);
            halfDamageList.push(...attackTypes);
        }
    }

    noDamageList = sortByFrequencyAndAlphabet(noDamageList);
    halfDamageList = sortByFrequencyAndAlphabet(halfDamageList);

    return [...noDamageList, ...halfDamageList];
}

function sortByFrequencyAndAlphabet(arr) {
    const countOccurrences = (arr) => {
        const count = {};
        arr.forEach(item => {
            count[item] = (count[item] || 0) + 1;
        });
        return count;
    };

    const counts = countOccurrences(arr);

    const uniqueList = [...new Set(arr)];

    return uniqueList.sort((a, b) => {
        if (counts[b] !== counts[a]) {
            return counts[b] - counts[a];
        }
        return a.localeCompare(b);
    });
}