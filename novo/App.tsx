import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, StyleSheet, FlatList, TouchableOpacity, Text, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
    Projeto: Bluetik
    Descrição: Este é meu primeiro projeto para uma cliente! 
    É um aplicativo simples de controle de estoque.
    Observação: Não usem JDK 11 ou qualquer outra versão; utilizem a versão 17, é serio!
    muita dor de cabeça pela falta da icompatibilidade com o uso, obrigado e boa sorte para nos todos.
*/

// só besteira que eu coloquei aqui
const initialProdutos = [
  { id: '1', nome: 'Coca-Cola 2L', quantidade: 4, tamanho: 'M', descricao: 'Refrigerante sabor cola' },
  { id: '2', nome: 'Biscoito Passatempo 140g', quantidade: 16, tamanho: 'P', descricao: 'Biscoito recheado' },
  { id: '3', nome: 'Whisky Red Label', quantidade: 3, tamanho: 'G', descricao: 'Whisky escocês' },
];

const App = () => {
  const [produtos, setProdutos] = useState(initialProdutos);
  const [modalVisible, setModalVisible] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState({ id: '', nome: '', quantidade: 0, tamanho: '', descricao: '' });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // sincronizacao inversa
    const carregarProdutos = async () => {
      const produtosSalvos = await AsyncStorage.getItem('produtos');
      if (produtosSalvos) {
        setProdutos(JSON.parse(produtosSalvos));
      }
    };
    carregarProdutos();
  }, []);

  useEffect(() => {
    // sincronizacao
    const salvarProdutos = async () => {
      await AsyncStorage.setItem('produtos', JSON.stringify(produtos));
    };
    salvarProdutos();
  }, [produtos]);

  const renderizarProduto = ({ item }: any) => (
    <View style={estilos.itemContainer}>
      <TouchableOpacity onPress={() => abrirModal(item)} style={estilos.item}>
        <Text style={estilos.nomeProduto}>{item.nome}</Text>
        <Text style={estilos.quantidade}>Quantidade: {item.quantidade}</Text>
        <Text style={estilos.tamanho}>Tamanho: {item.tamanho}</Text>
        {item.quantidade < 5 && <Text style={estilos.alerta}>Repor estoque!</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removerProduto(item.id)} style={estilos.lixeira}>
        <Text style={estilos.lixeiraTexto}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const abrirModal = (item: any) => {
    setProdutoAtual(item);
    setModalVisible(true);
  };

  const atualizarProduto = () => {
    setProdutos(produtos.map(prod => (prod.id === produtoAtual.id ? produtoAtual : prod)));
    setModalVisible(false);
  };

  const adicionarProduto = () => {
    const novoProduto = {
      id: (produtos.length + 1).toString(),
      nome: `Produto ${produtos.length + 1}`,
      quantidade: 1,
      tamanho: 'M',
      descricao: '',
    };
    setProdutos([...produtos, novoProduto]);
  };

  const removerProduto = (id: string) => {
    setProdutos(produtos.filter(prod => prod.id !== id));
  };

  const produtosFiltrados = produtos.filter(prod => 
    prod.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.logoContainer}>
        <Image source={require('./assets/imagens/logo.png')} style={estilos.logo} />
      </View>

      <TextInput
        style={estilos.input}
        placeholder="Buscar produto..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      <FlatList
        data={produtosFiltrados}
        renderItem={renderizarProduto}
        keyExtractor={item => item.id}
        contentContainerStyle={estilos.listaProdutos}
      />

      <TouchableOpacity style={estilos.fab} onPress={adicionarProduto}>
        <Text style={estilos.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={estilos.modalContainer}>
          <View style={estilos.modalView}>
            <Text style={estilos.modalText}>Editar Produto</Text>
            <TextInput
              style={estilos.input}
              placeholder="Nome do Produto"
              value={produtoAtual.nome}
              onChangeText={text => setProdutoAtual({ ...produtoAtual, nome: text })}
            />
            <TextInput
              style={estilos.input}
              placeholder="Quantidade"
              keyboardType="numeric"
              value={produtoAtual.quantidade.toString()}
              onChangeText={text => setProdutoAtual({ ...produtoAtual, quantidade: Number(text) })}
            />
            <TextInput
              style={estilos.input}
              placeholder="Descrição"
              value={produtoAtual.descricao}
              onChangeText={text => setProdutoAtual({ ...produtoAtual, descricao: text })}
            />
            <View style={estilos.botoesTamanho}>
              {['P', 'M', 'G', 'GG'].map(tamanho => (
                <TouchableOpacity
                  key={tamanho}
                  style={[estilos.botaoTamanho, produtoAtual.tamanho === tamanho && { backgroundColor: '#0056b3' }] }
                  onPress={() => setProdutoAtual({ ...produtoAtual, tamanho })}>
                  <Text style={estilos.textoBotao}>{tamanho}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="Salvar" onPress={atualizarProduto} />
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  input: {
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  listaProdutos: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // lixeira
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1, // 
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
    color: 'blue',
  },
  alerta: {
    color: 'red',
    marginTop: 5,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF', // Cor do botao
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Sombras
  },
  fabTexto: {
    color: '#FFF',
    fontSize: 30,
    lineHeight: 30,
  },
  lixeira: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  lixeiraTexto: {
    color: 'red',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escur do app 
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 10,
  },
  botoesTamanho: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  botaoTamanho: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  textoBotao: {
    color: '#FFF',
  },
});

export default App;
