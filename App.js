import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { addDoc, collection, firestore, PRODUCTS, serverTimestamp, deleteDoc, doc } from './firebase/config';
import { useEffect, useState } from 'react';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const save = async () => {
    if (newProduct.trim().length === 0) {
      Alert.alert('Empty Input', 'Please enter a product name.');
      return;
    }
    try {
      await addDoc(collection(firestore, PRODUCTS), {
        text: newProduct,
        created: serverTimestamp()
      });
      setNewProduct('');
      console.log('Product saved.');
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Could not save product.');
    }
  };
  useEffect(() => {
    const q = query(collection(firestore, PRODUCTS), orderBy('created', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempProducts = [];
      querySnapshot.forEach((doc) => {
        tempProducts.push({ ...doc.data(), id: doc.id });
      });
      setProducts(tempProducts);
    });
    return () => unsubscribe();
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, PRODUCTS, id));
      console.log('Product deleted:', id);
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', 'Could not delete product.');
    }
  };
  const toggleSelection = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter(item => item !== id) : [...prevSelected, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <View style={styles.form}>
        <TextInput
          placeholder='Add new item...'
          value={newProduct}
          onChangeText={setNewProduct}
          onSubmitEditing={save}
          style={styles.input}
        />
        <TouchableOpacity onPress={save} style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {products.map((product) => (
          <View key={product.id} style={styles.product}>
            <TouchableOpacity
              style={styles.productTextContainer}
              onPress={() => toggleSelection(product.id)}>
              <Text style={[styles.productText, selectedProducts.includes(product.id) && styles.selectedText]}>
                {product.text}
              </Text>
            </TouchableOpacity>
            {selectedProducts.includes(product.id) && (
              <TouchableOpacity onPress={() => handleDelete(product.id)}>
                <MaterialCommunityIcons name='trash-can' size={24} color='red' style={styles.trashIcon} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  productTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  trashIcon: {
    paddingLeft: 8,
  },
});
