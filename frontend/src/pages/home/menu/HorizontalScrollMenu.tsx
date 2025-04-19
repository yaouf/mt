import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext, useEffect, useRef } from 'react';
import { PixelRatio, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { menuStyles } from 'src/styles/sectionMenu';
import { NavProp } from 'src/types/navStacks';
import { setAsync } from 'src/utils/helpers';
import { menuItems } from 'src/utils/setupDevice';
import { MenuContext } from '../HomeStackScreen';
import Header from 'src/components/Header';
import PostHeader from 'src/components/PostHeader';

function HorizontalScrollMenu({ navigation }: NavProp) {
  const { sectionMenu, currSection, setCurrSection, setSectionMenu } = useContext(MenuContext);
  const scrollViewRef = useRef<ScrollView>(null);
  // const itemRef = useRef<View>(null);
  const itemPositions = useRef<{ [key: string]: number }>({});

  if (!sectionMenu) {
    setSectionMenu(menuItems);
    setAsync('sectionMenu', JSON.stringify(menuItems));
  }

  const textSizeMultiplier = PixelRatio.getFontScale();
  console.log('textSizeMultiplier', textSizeMultiplier);
  const calculatedIconSize = 24 * Math.sqrt(textSizeMultiplier);
  console.log('calculatedIconSize', calculatedIconSize);

  useEffect(() => {
    // Need to wait for layout to complete before scrolling
    setTimeout(() => {
      const allButton = currSection === 'all' ? 1 : 0;
      const currentIndex = sectionMenu.findIndex((item) => item.slug === currSection);

      // Calculate approximate position (may need to adjust these values later)
      const itemWidth = 80; // Approximate width of each menu item
      const scrollPosition = (currentIndex + allButton) * itemWidth;

      scrollViewRef.current?.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }, 100);

    currSection == `post-magazine`
      ? navigation.getParent()?.setOptions({ headerTitle: () => <PostHeader /> })
      : navigation.getParent()?.setOptions({ headerTitle: () => <Header /> });
  }, [currSection]);

  useEffect(() => {
    currSection == `post-magazine`
      ? navigation.getParent()?.setOptions({ headerTitle: () => <PostHeader /> })
      : navigation.getParent()?.setOptions({ headerTitle: () => <Header /> });
  });

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
      style={{ borderBottomWidth: 1, borderColor: '#ccc' }}
      accessibilityLabel="Section menu"
      accessibilityHint="Scroll horizontally to view different BDH sections"
    >
      <TouchableOpacity
        key={1}
        style={[menuStyles.menuItem, { paddingLeft: 20 }]}
        onPress={() => navigation.push('SectionPref')}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Filter options"
      >
        <Ionicons name="filter-outline" size={calculatedIconSize} color="black" />
      </TouchableOpacity>

      {currSection === 'all' ? (
        <View
          style={menuStyles.menuItem}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ selected: true }}
          accessibilityLabel="All sections, selected"
        >
          <Text style={menuStyles.menuItemSelected}>all</Text>
        </View>
      ) : (
        <TouchableOpacity
          key={2}
          style={menuStyles.menuItem}
          onPress={() => {
            // TODO: should this also be navigate?
            navigation.navigate('HomeScreen', { slug: 'all' });
            setCurrSection('all');
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="All sections"
          accessibilityHint="Double tap to view all sections"
        >
          <Text style={menuStyles.menuItemText}>all</Text>
        </TouchableOpacity>
      )}

      {sectionMenu && sectionMenu.length > 0 ? (
        sectionMenu.map((menuItem) =>
          menuItem.slug === currSection ? (
            <View
              key={menuItem.id}
              style={menuStyles.menuItem}
              accessible={true}
              accessibilityRole="button"
              accessibilityState={{ selected: true }}
              accessibilityLabel={`${menuItem.title} section, selected`}
            >
              <Text style={menuStyles.menuItemSelected}>{menuItem.title}</Text>
            </View>
          ) : (
            <TouchableOpacity
              key={menuItem.id}
              style={menuStyles.menuItem}
              onPress={() => {
                if (
                  menuItem.title == "Sports" ||
                  menuItem.title == "Arts & Culture" ||
                  menuItem.title == "Science & Research"
                ) {
                  const xPosition = itemPositions.current[menuItem.slug] || 0;
                  scrollViewRef.current?.scrollTo({
                    x: xPosition - 10,
                    animated: true,
                  });
                }
                navigation.navigate("Section", { slug: menuItem.slug });
                setCurrSection(menuItem.slug);
                // itemRef.current?.measureLayout(
                //   scrollViewRef.current as any,
                //   (x, y, width, height) => {
                //     console.log(x);
                //     scrollViewRef.current?.scrollTo({ x, animated: true });
                //   }
                // );
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${menuItem.title} section`}
              accessibilityHint={`Double tap to view ${menuItem.title} section`}
            >
              <Text style={menuStyles.menuItemText}>{menuItem.title}</Text>
            </TouchableOpacity>
          )
        )
      ) : (
        // Render default items if sectionMenu is undefined or empty
        menuItems.map((menuItem) => (
          <TouchableOpacity
            key={menuItem.id}
            style={menuStyles.menuItem}
            onPress={() => {
              if (
                menuItem.title == 'Sports' ||
                menuItem.title == 'Arts & Culture' ||
                menuItem.title == 'Science & Research'
              ) {
                const xPosition = itemPositions.current[menuItem.slug] || 0;
                scrollViewRef.current?.scrollTo({
                  x: xPosition - 10,
                  animated: true,
                });
              }
              navigation.navigate('Section', { slug: menuItem.slug });
              setCurrSection(menuItem.slug);
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${menuItem.title} section`}
            accessibilityHint={`Double tap to view ${menuItem.title} section`}
          >
            <Text style={menuStyles.menuItemText}>{menuItem.title}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

export default HorizontalScrollMenu;
