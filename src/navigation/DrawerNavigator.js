import 'react-native-gesture-handler';
import React from 'react';
import { View, Image, StyleSheet } from 'react-native'; // Importe View, Image, StyleSheet
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importe suas telas
import HomeScreen from '../screens/HomePage';
import RespawnsPage from '../screens/RespawnsPage';
import SettingsScreen from '../screens/SettingsScreen';
import CalculatorScreen from '../screens/CalcBoostScreen'; // Nome da sua tela de calculadora
import CustomDrawerContent from './CustomDrawerContent';
import EggSelectorScreen from '../screens/EggSelectorScreen';

// Componente para a logo no cabeçalho
const LogoTitle = () => {
  return (
    <Image
      style={styles.headerLogo}
      source={require('../../assets/logo.png')} // Caminho da sua logo no cabeçalho
    />
  );
};

const Drawer = createDrawerNavigator();

function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      // Se estiver usando um CustomDrawerContent, descomente a linha abaixo e adapte-o
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000ff', // Cor de fundo do cabeçalho (preto)
        },
        headerTintColor: '#ffffffff', // Cor dos elementos do cabeçalho (botão do menu, etc.)
        headerTitleStyle: {
          // fontWeight: 'bold', // Este estilo não é mais necessário se você estiver usando uma imagem
        },
        drawerActiveTintColor: '#ffffffff', // Cor do texto/ícone do item ativo no drawer
        drawerInactiveTintColor: '#ffffffff', // Cor do texto/ícone do item inativo no drawer
        drawerLabelStyle: {
          fontSize: 16,
        },
        drawerStyle : {
          backgroundColor: '#000000ff', // Fundo do drawer lateral
        }
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home', // Título que aparece no menu lateral
          headerTitle: (props) => <LogoTitle {...props} />, // Logo no cabeçalho da tela
          // ÍCONE PERSONALIZADO PARA 'Home' VIA URL
          drawerIcon: ({ size }) => (
            <Image
              source={require('../../assets/icons/home.png')} // <-- COLOQUE A URL DO SEU ÍCONE CALCULADORA AQUI
              style={{ width: size, height: size, resizeMode: 'contain' }} // Ajusta tamanho e modo de redimensionamento
            />
          ),
        }}
      />
      <Drawer.Screen
        name="CalcBoost" // Nome da rota para a calculadora
        component={CalculatorScreen}
        options={{
          title: 'Calculadora Boost', // Título que aparece no menu lateral
          headerTitle: (props) => <LogoTitle {...props} />, // Logo no cabeçalho da tela
          // ÍCONE PERSONALIZADO PARA 'Calculadora Boost' VIA URL
          drawerIcon: ({ size }) => (
            <Image
              source={require('../../assets/icons/calculadora.png')} // <-- COLOQUE A URL DO SEU ÍCONE CALCULADORA AQUI
              style={{ width: size, height: size, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="BoxPokemon"
        component={EggSelectorScreen}
        options={{
          title: 'Box Pokémon', // Título que aparece no menu lateral
          headerTitle: (props) => <LogoTitle {...props} />, // Logo no cabeçalho da tela
          // ÍCONE PERSONALIZADO PARA 'Respawns' VIA URL
          drawerIcon: ({ size }) => (
            <Image
              source={{ uri: 'https://resource.pokemon-home.com/battledata/img/pokei128/icon0000_f00_s0.png' }} // <-- COLOQUE A URL DO SEU ÍCONE RESPAWN AQUI
              style={{ width: size, height: size, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Respawns"
        component={RespawnsPage}
        options={{
          title: 'Respawns', // Título que aparece no menu lateral
          headerTitle: (props) => <LogoTitle {...props} />, // Logo no cabeçalho da tela
          // ÍCONE PERSONALIZADO PARA 'Settings' VIA URL
          drawerIcon: ({ size }) => (
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1033/1033064.png' }} // <-- COLOQUE A URL DO SEU ÍCONE SETTINGS AQUI
              style={{ width: size, height: size, resizeMode: 'contain' }}
            />
          ),
        }}
      />

    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    width: 340, // Ajuste o tamanho da largura da sua logo no cabeçalho
    height: 50, // Ajuste o tamanho da altura da sua logo no cabeçalho
    resizeMode: 'contain', // Garante que a imagem se ajuste
  },
});

export default AppDrawerNavigator;
