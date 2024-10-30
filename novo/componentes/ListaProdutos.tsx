import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// xemplo
const produtos = [
  { id: '1', nome: 'Coca-Cola 2L', quantidade: 4, tamanho: 'M' },
  { id: '2', nome: 'Biscoito Passatempo 140g', quantidade: 16, tamanho: 'P' },
  { id: '3', nome: 'Whisky Red Label', quantidade: 3, tamanho: 'G' },
];

const ListaProdutos = ({ abrirModal }: any) => {
  const renderizarProduto = ({ item }: any) => (
    <TouchableOpacity onPress={() => abrirModal(item)}>
      <View style={estilos.item}>
        <Text style={estilos.nomeProduto}>{item.nome}</Text>
        <Text style={estilos.quantidade}>Quantidade: {item.quantidade}</Text>
        <Text style={estilos.tamanho}>Tamanho: {item.tamanho}</Text>
        {item.quantidade < 5 && <Text style={estilos.alerta}>Repor estoque!</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={produtos}
      renderItem={renderizarProduto}
      keyExtractor={item => item.id}
      contentContainerStyle={estilos.listaProdutos}
    />
  );
};

const estilos = StyleSheet.create({
  listaProdutos: {
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  nomeProduto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantidade: {
    fontSize: 14,
    marginTop: 5,
  },
  tamanho: {
    fontSize: 14,
    marginTop: 5,
    color: 'blue', // Cor azul para  o tamanho
  },
  alerta: {
    color: 'red',
    marginTop: 5,
    fontWeight: 'bold',
  },
  botaoTamanho: {
    backgroundColor: '#007AFF', // Azul da Bluetik
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  textoBotao: {
    color: '#FFF',
  },
});

export default ListaProdutos;
