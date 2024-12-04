import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface RecipeCardProps {
  title: string;
  cuisine: string;
  price: number;
  image: string;
  remaining?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  cuisine,
  price,
  image,
  remaining = 4,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.cuisine}>{cuisine}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>Rs {price}</Text>
          <Text style={styles.remaining}>{remaining} Left</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  remaining: {
    fontSize: 14,
    color: '#FF6B6B',
  },
});

export default RecipeCard;