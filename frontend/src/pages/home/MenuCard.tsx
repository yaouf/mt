import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

// TODO: is this something old?? and horizontalscrollmenu is the new one??

interface MenuItem {
  id: number;
  title: string;
}

const menuItems: MenuItem[] = [
  { id: 1, title: 'FILTER' },
  { id: 2, title: 'ALL' },
  { id: 3, title: 'NEWS' },
  { id: 4, title: 'SPORTS' },
  { id: 5, title: 'ARTS & CULTURE' },
  { id: 6, title: 'SCIENCE & RESEARCH' },
  { id: 7, title: 'OPINIONS' },
  { id: 8, title: 'PROJECTS' },
  { id: 9, title: 'POST-MAGAZINE' },
  { id: 10, title: 'MULTIMEDIA' }
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
