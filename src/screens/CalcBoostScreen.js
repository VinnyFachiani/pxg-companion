import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput, // TextInput padrão do React Native para os outros campos
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Platform,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Provider, Menu } from 'react-native-paper'; // Importa Provider e Menu do React Native Paper
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importa ícones para a seta do dropdown

// --- Funções de cálculo e formatação ---
const formatNumber = (number) => {
  if (isNaN(number) || number === null) return '0';
  return Number(number).toLocaleString("pt-BR", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 3 });
};

function calcNormalBoost(initBoost, endBoost, boostType, stonePrice, boostStonePrice) {
  const responseBoost = [];
  let usedNormalStones = 0;
  let usedBoostStones = 0;
  let stonesForBoost = 0;

  for (let i = 0; i <= initBoost; i++) {
    if (i % boostType === 0) stonesForBoost++;
  }

  for (let i = initBoost + 1; i <= endBoost; i++) {      
    if ((stonesForBoost * stonePrice) < boostStonePrice) {
      usedNormalStones += stonesForBoost;
    } else {
      usedBoostStones++;
    }

    if (i % boostType === 0 && i !== initBoost) {
      stonesForBoost++;
    }

    responseBoost.push(
      {
        price: (usedNormalStones * stonePrice) + (usedBoostStones * boostStonePrice),
        normal_stones: usedNormalStones,
        boost_stones: usedBoostStones,
        boost: i
      }
    );
  }

  return responseBoost;
}

function calcExceptionBoost(initBoost, endBoost, boostType, stonePrice, boostStonePrice) {
  const responseBoost = [];
  let usedNormalStones = 0;
  let usedBoostStones = 0;
  let stonesForBoost = 1;

  for (let i = 1; i <= initBoost; i++) {
    if (i < 10) continue;
    if (i % boostType === 0) stonesForBoost++;
  }

  for (let i = initBoost + 1; i <= endBoost; i++) {
    if (i < 10) {
      if (!(i % 2 === 0)) {
        responseBoost.push(
          {
            price: null,
            normal_stones: null,
            boost_stones: null,
            boost: i
          }
        );
        continue;
      }
      if ((stonesForBoost * stonePrice) < boostStonePrice) {
        usedNormalStones += stonesForBoost;
      } else {
        usedBoostStones++;
      }

      responseBoost.push(
        {
          price: (usedNormalStones * stonePrice) + (usedBoostStones * boostStonePrice),
          normal_stones: usedNormalStones,
          boost_stones: usedBoostStones,
          boost: i
        }
      );
      continue;
    }

    if ((stonesForBoost * stonePrice) < boostStonePrice) {
      usedNormalStones += stonesForBoost; // Corrigido para stonesForBoost
    } else {
      usedBoostStones++;
    }

    if (i % boostType === 0) {
      stonesForBoost++;
    }

    responseBoost.push(
      {
        price: (usedNormalStones * stonePrice) + (usedBoostStones * boostStonePrice),
        normal_stones: usedNormalStones,
        boost_stones: usedBoostStones,
        boost: i
      }
    );
  }

  return responseBoost;
}


function CalculatorScreen() {
  // --- Estados para os campos de entrada ---
  const [boostType, setBoostType] = useState('2');
  const [useSpecialStone, setUseSpecialStone] = useState(false);
  const [currentBoost, setCurrentBoost] = useState('0');
  const [desiredBoost, setDesiredBoost] = useState('50');
  const [commonStonePrice, setCommonStonePrice] = useState('');
  const [boostStonePrice, setBoostStonePrice] = useState('');
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar a visibilidade do Menu

  // --- Estados para os resultados ---
  const [commonStonesNeeded, setCommonStonesNeeded] = useState(0);
  const [boostStonesNeeded, setBoostStonesNeeded] = useState(0);
  const [totalCost, setTotalCost] = useState('0 KK');
  const [showResultContainer, setShowResultContainer] = useState(false);

  // --- LÓGICA DE CÁLCULO ---
  const calculateResult = () => {
    const startBoostVal = parseInt(currentBoost || '0', 10);
    const endBoostVal = parseInt(desiredBoost || '0', 10);
    const boostTypeVal = parseInt(boostType, 10);
    
    const stonePriceVal = commonStonePrice ? (parseFloat(commonStonePrice) > 1000 ? parseFloat(commonStonePrice) / 1000 : parseFloat(commonStonePrice)) : 0;
    const boostStonePriceVal = boostStonePrice ? (parseFloat(boostStonePrice) > 1000 ? parseFloat(boostStonePrice) / 1000 : parseFloat(boostStonePrice)) : 9999999;
    
    if (isNaN(startBoostVal) || isNaN(endBoostVal) || isNaN(boostTypeVal) || isNaN(stonePriceVal) || isNaN(boostStonePriceVal)) {
        Alert.alert('Erro', 'Por favor, insira valores numéricos válidos em todos os campos.');
        clearResults();
        return;
    }

    if (startBoostVal > endBoostVal) {
      Alert.alert('Erro', 'O boost inicial não pode ser maior do que o final.');
      clearResults();
      return;
    }

    let result;
    if (useSpecialStone) {
      result = calcExceptionBoost(startBoostVal, endBoostVal, boostTypeVal, stonePriceVal, boostStonePriceVal);
    } else {
      result = calcNormalBoost(startBoostVal, endBoostVal, boostTypeVal, stonePriceVal, boostStonePriceVal);
    }
    
    const finalResult = result[result.length - 1];

    if (finalResult) {
        setCommonStonesNeeded(finalResult.normal_stones || 0);
        setBoostStonesNeeded(finalResult.boost_stones || 0);

        let formattedCost = '';
        if (finalResult.price === null || isNaN(finalResult.price)) {
            formattedCost = 'N/A';
        } else if (finalResult.price >= 1000) {
            formattedCost = `${formatNumber(finalResult.price / 1000)} KK`;
        } else {
            formattedCost = `${formatNumber(finalResult.price)} K`;
        }
        setTotalCost(formattedCost);
    } else {
      clearResults();
    }
    setShowResultContainer(true);
  };

  const clearResults = () => {
    setCommonStonesNeeded(0);
    setBoostStonesNeeded(0);
    setTotalCost('0 KK');
    setShowResultContainer(false);
  };

  const clearAllFields = () => {
    setBoostType('2');
    setUseSpecialStone(false);
    setCurrentBoost('0');
    setDesiredBoost('50');
    setCommonStonePrice('');
    setBoostStonePrice('');
    clearResults();
  };

  // Opções para o Menu do Paper
  const boostTypeOptions = [
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
    { label: '20', value: '20' },
    { label: '25', value: '25' },
    { label: '30', value: '30' },
    { label: '50', value: '50' },
  ];

  return (
    <Provider> {/* Provider do React Native Paper */}
      <ImageBackground
        source={require('../../assets/bg.jpg')} // Caminho para sua imagem de fundo
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          style={styles.scrollViewContent}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.sectionTitle}>Selecione o tipo do boost</Text>
          <View style={styles.pickerContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={styles.dropdownButton} // Estilo para o botão de dropdown
                >
                  <Text style={styles.dropdownButtonText}>{boostType || 'Selecione o tipo de boost...'}</Text>
                  <Icon name="menu-down" size={24} color="#ffffffff" />
                </TouchableOpacity>
              }
              style={styles.menuDropdown} // Estilo para o Menu flutuante
            >
              {boostTypeOptions.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setBoostType(option.value);
                    setMenuVisible(false); // Fecha o menu após a seleção
                  }}
                  title={option.label}
                />
              ))}
            </Menu>
          </View>

          <View style={styles.checkboxRow}>
            <Switch
              trackColor={{ false: "#767577", true: "#ff0000" }}
              thumbColor={useSpecialStone ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setUseSpecialStone(previousState => !previousState)}
              value={useSpecialStone}
            />
            <Text style={styles.checkboxLabel}>Marque se você irá usar metal, crystal ou ancient stone!</Text>
          </View>

          <Text style={styles.inputLabel}>Digite o boost atual</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={currentBoost}
            onChangeText={setCurrentBoost}
            placeholder="0"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Digite o boost desejado</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={desiredBoost}
            onChangeText={setDesiredBoost}
            placeholder="50"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Digite o preço da stone (Ex: 8)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={commonStonePrice}
            onChangeText={setCommonStonePrice}
            placeholder="8"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Digite o preço da Boost stone (Ex: 180)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={boostStonePrice}
            onChangeText={setBoostStonePrice}
            placeholder="180"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.calculateButton} onPress={calculateResult}>
            <Text style={styles.calculateButtonText}>CALCULAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.calculateButton} onPress={clearAllFields}>
            <Text style={styles.calculateButtonText}>LIMPAR</Text>
          </TouchableOpacity>
          {showResultContainer && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Resultado</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultText}>Pedras comuns: </Text>
                <Text style={styles.resultValue}>{formatNumber(commonStonesNeeded)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultText}>Pedras de boost: </Text>
                <Text style={styles.resultValue}>{formatNumber(boostStonesNeeded)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultText}>Custo total: </Text>
                <Text style={styles.resultValue}>{totalCost}</Text>
              </View>
            </View>
          )}

          <View style={{ height: 50 }} />
        </ScrollView>
      </ImageBackground>
    </Provider>
  );
}

// Estilos específicos para o RNPickerSelect (não mais usados)
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderRadius: 25,
    color: '#ffffffff',
    paddingRight: 30,
    backgroundColor: 'transparent',
    height: 50,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0,
    borderRadius: 25,
    color: '#ffffffff',
    paddingRight: 30,
    backgroundColor: 'transparent',
    height: 50,
  },
  placeholder: {
    color: '#999',
  },
  iconContainer: {
    top: 15,
    right: 15,
  },
});

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
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginTop: 10,
    width: '100%',
    textAlign: 'left',
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 15,
    // Os estilos de borda e fundo agora são gerenciados pelo dropdownButton
  },
  dropdownButton: { // Novo estilo para o botão de dropdown
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 15,
    height: 50,
    width: '100%',
  },
  dropdownButtonText: {
    color: '#ffffffff',
    fontSize: 16,
    flex: 1, // Permite que o texto ocupe o espaço disponível
  },
  menuDropdown: {
    top: 110,
    width: Dimensions.get('window').width * 0.9, // Largura do menu, ajuste conforme necessário
    maxWidth: 400, // Mesma largura máxima do container
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 5,
  },
  checkboxLabel: {
    color: '#ffffffff',
    fontSize: 15,
    flex: 1,
    marginLeft: 10,
  },
  inputLabel: {
    fontSize: 15,
    color: '#ffffffff',
    marginBottom: 5,
    width: '100%',
    textAlign: 'left',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: '#ffffffff',
    borderRadius: 25,
    padding: 10,
    fontSize: 16,
    color: '#ffffffff',
    marginBottom: 15,
    width: '100%',
    textAlign: 'center',
  },
  calculateButton: {
    backgroundColor: '#000000ff',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ffffff'
  },
  calculateButtonImage: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
  },
  calculateButtonText: {
    color: '#ffffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearText: {
    color: '#ffffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderWidth: 2,
    borderColor: '#ffffffff',
    borderRadius: 25,
    padding: 25,
    width: '100%',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#c2c2c2ff',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
});

export default CalculatorScreen;
