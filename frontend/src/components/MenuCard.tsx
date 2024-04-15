import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

interface MenuItem {
  id: number;
  title: string;
}

const menuItems: MenuItem[] = [
  { id: 1, title: 'ALL' },
  { id: 2, title: 'NEWS' },
  { id: 3, title: 'SPORTS' },
  { id: 4, title: 'ARTS & CULTURE' },
  { id: 5, title: 'SCIENCE & RESEARCH' },
  { id: 6, title: 'OPINIONS' },
  { id: 7, title: 'PROJECTS' },
  { id: 8, title: 'POST-MAGAZINE' },
  { id: 9, title: 'MULTIMEDIA' },
];

const HorizontalScrollMenu = () => {
  const handleMenuItemPress = (item: MenuItem) => {
    console.log('Selected item:', item);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item)}
          >
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    top: 75,
    zIndex: 1
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 0,
    backgroundColor: 'white',
    marginHorizontal: 0,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default HorizontalScrollMenu;
