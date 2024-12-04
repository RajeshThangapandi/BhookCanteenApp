import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Image
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Recipe } from '../types/Recipe';
import { fetchRecipes } from '../api/recipeApi';
import { debounce } from 'lodash';

type RootStackParamList = {
  Home: { username: string };
};

type HomeScreenProps = {
  route: RouteProp<RootStackParamList, 'Home'>;
};

const categories = [
  { id: 'lunch', icon: 'cutlery', label: 'Lunch' },
  { id: 'dinner', icon: 'spoon', label: 'Dinner' },
  { id: 'breakfast', icon: 'coffee', label: 'Breakfast' },
  { id: 'dessert', icon: 'birthday-cake', label: 'Dessert' },
];

const ITEMS_PER_PAGE = 8;

export default function HomeScreen({ route }: HomeScreenProps) {
  const { username } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('lunch');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadRecipes = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const fetchedRecipes = await fetchRecipes(selectedCategory, searchQuery);
      const totalItems = fetchedRecipes.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedRecipes = fetchedRecipes.slice(startIndex, endIndex);

      setRecipes(paginatedRecipes);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to fetch recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
      setCurrentPage(1);
      loadRecipes(1);
    }, 300),
    [loadRecipes]
  );

  const handleRefresh = () => {
    setSearchQuery('');
    setCurrentPage(1);
    loadRecipes(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      loadRecipes(newPage);
    }
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    if (!item || !item.image) {
      return null;
    }

    return (
      <View style={styles.recipeCard}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.recipeImage}
        />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{item.name || 'Unnamed Recipe'}</Text>
          <Text style={styles.recipeSubtitle}>Fresh & Healthy</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs {item.price || 'N/A'}</Text>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{item.quantity || 0} left</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text style={styles.paginationButtonText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.paginationText}>{`Page ${currentPage} of ${totalPages}`}</Text>
      <TouchableOpacity
        style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.paginationButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.subtitle}>What do you want to eat?</Text>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#666"
          onChangeText={debouncedSearch}
        />
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>

      <View style={styles.categories}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => {
              setSelectedCategory(category.id);
              setCurrentPage(1);
              loadRecipes(1);
            }}
          >
            <FontAwesome name={category.icon} size={24} color="#FFF" />
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.specialHeader}>
        <Text style={styles.specialTitle}>Today's special</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.recipesGrid}
        ListFooterComponent={renderPagination}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#F47B0A" />
          ) : (
            <Text style={styles.noRecipesText}>No recipes found. Try a different category or search term.</Text>
          )
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="home" size={24} color="#F47B0A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="heart" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="search" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="user" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '600',
    color: '#333',
  },
  name: {
    fontSize: 30,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 20,
    borderRadius: 10,
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#F47B0A',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#F47B0A',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: 80,
    height: 80,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#D35400',
  },
  categoryLabel: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 12,
  },
  specialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  specialTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    color: '#F47B0A',
    fontSize: 16,
  },
  recipesGrid: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  recipeCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  recipeInfo: {
    padding: 10,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  recipeSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F47B0A',
  },
  quantityBadge: {
    backgroundColor: '#F47B0A',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 12,
    color: '#FFF',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  navItem: {
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  paginationButton: {
    backgroundColor: '#F47B0A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  paginationButtonDisabled: {
    backgroundColor: '#ccc',
  },
  paginationButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationText: {
    fontSize: 14,
    color: '#666',
  },
  noRecipesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

