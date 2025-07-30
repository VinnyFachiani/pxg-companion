import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ImageBackground,
  Platform,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';

// --- INÍCIO DAS MODIFICAÇÕES ---

// 1. Importe o seu image_map.js
// ATENÇÃO: Ajuste o caminho '../utils/image_map' para onde você salvou o seu arquivo image_map.js
import pokemonImageMap from '../../assets/image_map';

// --- FIM DAS MODIFICAÇÕES ---

import datarespawn from '../data/dataRespawns.json';

function RespawnsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const uniqueNames = new Set();
    datarespawn.forEach(item => {
      uniqueNames.add(item.pokemon.name);
    });
    setAllPokemonNames(Array.from(uniqueNames).sort());
  }, []);

  const handleInputChange = (value) => {
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = allPokemonNames.filter(name =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (pokemonName) => {
    setSearchTerm(pokemonName);
    setSuggestions([]);
    performSearch(pokemonName);
  };

  const performSearch = (nameToSearch) => {
    const results = [];
    datarespawn.forEach(item => {
      if (item.pokemon.name.toLowerCase() === nameToSearch.toLowerCase()) {
        results.push(item);
      }
    });
    setSearchResults(results);
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
    >
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  // Renderiza cada card de resultado de Pokémon
  const renderPokemonResultCard = ({ item }) => (
    <View style={styles.pokemonResultCard}>
      {/* --- INÍCIO DA MODIFICAÇÃO DA IMAGEM --- */}
      <Image
        // Acessa a imagem do mapa usando o ID do Pokémon como string
        // Assumimos que item.pokemon.id existe e corresponde às chaves numéricas no image_map.js
        source={pokemonImageMap[item.pokemon.icon.toString()]}
        style={styles.pokemonResultImage}
        // O `onError` para imagens locais carregadas via `require` geralmente não é necessário.
        // Se a referência em `image_map.js` estiver incorreta ou a imagem não existir,
        // o Metro Bundler (React Native) já avisará durante a compilação ou causará um erro em tempo de execução.
        // O fallback para "https://placehold.co" é mais para imagens externas.
        // Se você ainda quiser um fallback local, pode usar uma imagem de placeholder local, ex:
        // source={pokemonImageMap[item.pokemon.id.toString()] || require('../../assets/placeholder.png')}
      />
      {/* --- FIM DA MODIFICAÇÃO DA IMAGEM --- */}
      <View>
        <Text style={styles.pokemonResultName}>{item.pokemon.name}</Text>
        <Text style={styles.pokemonResultDetail}>Coordenadas: <Text style={styles.pokemonResultCoords}>{item.coords}</Text></Text>
        <Text style={styles.pokemonResultDetail}>Região: <Text style={styles.pokemonResultRegion}>{item.region}</Text></Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={[
          styles.contentContainer,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Localizador de Respawns Pokémon</Text>

        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={handleInputChange}
            placeholder="Digite o nome do Pokémon..."
            placeholderTextColor="#aaa"
            onSubmitEditing={() => performSearch(searchTerm)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => performSearch(searchTerm)}
          >
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="always"
            />
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Resultados para "{searchTerm}"</Text>
            <FlatList
              data={searchResults}
              renderItem={renderPokemonResultCard}
              keyExtractor={(item, index) => item.pokemon.slug + item.coords + index}
              scrollEnabled={false}
            />
          </View>
        )}

        {searchTerm.length > 0 && searchResults.length === 0 && (
          <Text style={styles.noResultsText}>Nenhum resultado encontrado para "{searchTerm}".</Text>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400,
    marginBottom: 15,
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: 30,
    overflow: 'hidden',
    borderColor: '#fff',
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  },
  searchButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 155,
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    maxHeight: 200,
    overflow: 'hidden',
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  resultsContainer: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: 'rgba(0, 0, 0, 0.71)',
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#fff"
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  pokemonResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  pokemonResultImage: {
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 35,
  },
  pokemonResultName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  pokemonResultDetail: {
    fontSize: 16,
    color: '#fff',
  },
  pokemonResultCoords: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold'
  },
  pokemonResultRegion: {
    fontWeight: '600',
  },
  noResultsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RespawnsPage;