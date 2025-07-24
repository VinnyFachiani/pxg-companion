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
  TextInput, // Para a caixa de texto
  Platform,
  StatusBar,
  Dimensions, // Para ajustar o padding no Android
} from 'react-native';

// Importa os dados dos respawns (certifique-se de que este caminho está correto)
import datarespawn from '../data/dataRespawns.json';

function RespawnsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Carrega todos os nomes de Pokémon únicos do datarespawn.json
  useEffect(() => {
    const uniqueNames = new Set();
    // Itera diretamente sobre o array datarespawn
    datarespawn.forEach(item => {
      uniqueNames.add(item.pokemon.name);
    });
    setAllPokemonNames(Array.from(uniqueNames).sort()); // Ordena alfabeticamente
  }, []);

  // Lida com a mudança no campo de busca para gerar sugestões
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

  // Lida com a seleção de uma sugestão
  const handleSelectSuggestion = (pokemonName) => {
    setSearchTerm(pokemonName);
    setSuggestions([]); // Limpa as sugestões
    performSearch(pokemonName); // Realiza a busca imediatamente
  };

  // Função para realizar a busca no datarespawn
  const performSearch = (nameToSearch) => {
    const results = [];
    // Itera diretamente sobre o array datarespawn
    datarespawn.forEach(item => {
      if (item.pokemon.name.toLowerCase() === nameToSearch.toLowerCase()) {
        results.push(item);
      }
    });
    setSearchResults(results);
  };

  // Renderiza cada item da sugestão
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
      <Image
        source={{ uri: item.pokemon.icon }}
        style={styles.pokemonResultImage}
        onError={(e) => { e.nativeEvent.error = null; e.target.src = "https://placehold.co/64x64/cccccc/000000?text=?" }} // Fallback para imagem
      />
      <View>
        <Text style={styles.pokemonResultName}>{item.pokemon.name}</Text>
        <Text style={styles.pokemonResultDetail}>Coordenadas: <Text style={styles.pokemonResultCoords}>{item.coords}</Text></Text>
        <Text style={styles.pokemonResultDetail}>Região: <Text style={styles.pokemonResultRegion}>{item.region}</Text></Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')} // Caminho para sua imagem de fundo
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={[
          styles.contentContainer,          
        ]}
        keyboardShouldPersistTaps="handled" // Mantém o teclado aberto ao tocar nas sugestões
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
            onSubmitEditing={() => performSearch(searchTerm)} // Aciona a busca ao pressionar Enter/Done
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => performSearch(searchTerm)}
          >
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer} ref={suggestionsRef}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="always" // Garante que as sugestões sejam clicáveis
            />
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Resultados para "{searchTerm}"</Text>
            <FlatList
              data={searchResults}
              renderItem={renderPokemonResultCard}
              keyExtractor={(item, index) => item.pokemon.slug + item.coords + index} // Chave única
              scrollEnabled={false} // Desabilita o scroll da FlatList para que o ScrollView pai cuide disso
            />
          </View>
        )}

        {searchTerm.length > 0 && searchResults.length === 0 && (
          <Text style={styles.noResultsText}>Nenhum resultado encontrado para "{searchTerm}".</Text>
        )}
        
        <View style={{ height: 50 }} /> {/* Espaçamento extra no final para scroll */}
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
    color: '#ffffff',
    marginBottom: 20,
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
    borderColor: '#ffffffff',
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 20,
    color: '#ffffffff',
    fontWeight: 'bold'
  },
  searchButton: {
    backgroundColor: '#ff0000ff',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 145, // Ajuste conforme a altura do seu cabeçalho e campo de busca
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    maxHeight: 200, // Limita a altura das sugestões
    overflow: 'hidden',
    zIndex: 1000, // Garante que as sugestões fiquem acima de outros elementos
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  resultsContainer: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: 'rgba(0, 0, 0, 0.71)',
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#ffffff" // Espaçamento após a caixa de busca/sugestões
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
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
    borderColor: '#ffffffff',
  },
  pokemonResultImage: {
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 35, // Para imagens redondas
  },
  pokemonResultName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  pokemonResultDetail: {
    fontSize: 16,
    color: '#ffffffff',
  },
  pokemonResultCoords: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', // Fonte monoespaçada para coordenadas
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 15,
    color: '#ffffffff',
    fontWeight: 'bold'
  },
  pokemonResultRegion: {
    fontWeight: '600',
  },
  noResultsText: {
    color: '#ffffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RespawnsPage;
