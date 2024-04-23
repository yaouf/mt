import React from "react";
import { View, Text } from "react-native";
// import {
//   NativeBaseProvider,
//   Text,
//   extendTheme,
//   VStack,
//   HStack,
//   ScrollView,
//   Divider,
//   Switch,
//   Container,
// } from "native-base";
// import SmallCard from "../../components/cards/SmallCard";
// import ImageCard from "../../components/cards/ImageCard";
// import LargeCard from "../../components/cards/LargeCard";
// import HorizontalCard from "../../components/cards/HorizontalCard";
// import { dummyData } from "../../dummyData";
import { StyleSheet } from "react-native";
// import SectionHeader from "../../components/SectionHeader";

/**
 * for you page!!
 *
 * @returns for you screen
 */

function ForYouScreen() {
  const handleSeeMorePress = () => {
    // Navigation that is to be performed on 'See more' press button
    console.log("See more pressed!");
  };

  const renderArticles = () => {
    // return dummyData.map((item, index) => (
    //   <SmallCard key={index} article={article.article} />
    // ));
    // <SmallCard article={dummyData[0].article}></SmallCard>;
  };

  return (
    <View>
      <Text>for you!!</Text>
    </View>
    // <NativeBaseProvider>
    //   <VStack>
    //     <ScrollView contentContainerStyle={{}}>
    //       {/*Recommended Text */}
    //       <Text
    //         bold
    //         mx="3"
    //         my="2"
    //         style={{
    //           marginLeft: 16,
    //           width: 308,
    //           fontSize: 14,
    //           paddingBottom: 10,
    //         }}
    //       >
    //         Recommended stories, your favorite sections, and more.
    //       </Text>
    //       <Divider style={styles.divider} />

    //       {/*Arts and Section Header*/}
    //       <SectionHeader
    //         title="Arts & Culture"
    //         onSeeMorePress={handleSeeMorePress}
    //       />
    //       <View>
    //         <ScrollView
    //           horizontal
    //           showsHorizontalScrollIndicator={false}
    //           style={{ marginLeft: 16 }}
    //         >
    //           <HStack space={3}>
    //             {dummyData.map((article, index) => (
    //               <SmallCard key={index} article={article} /> // Ensure SmallCard expects a prop named 'article'
    //             ))}
    //           </HStack>
    //         </ScrollView>
    //       </View>

    //       {/*Back from the Archive*/}
    //       <View style={styles.section_container}>
    //         <Divider style={styles.divider_two} />
    //         <Text style={styles.miniTitle}>back from the archive</Text>
    //         <Text style={styles.featuredStoryText}>
    //           A featured story from this day 10 years ago{" "}
    //         </Text>
    //         <View style={styles.largeCard}>
    //           <LargeCard article={dummyData[1]}></LargeCard>
    //         </View>
    //       </View>

    //       {/*Stay Updated*/}
    //       <View style={styles.section_container}>
    //         <Divider style={styles.divider_three} />
    //         <Text style={styles.miniTitle}>stay updated</Text>
    //         {/*Author Name + Toggle*/}
    //         <View style={styles.stayUpdatedSubSection}>
    //           <HStack alignItems="center">
    //             <Container style={{ width: 300 }}>
    //               <Text style={styles.stayUpdatedText}>
    //                 {""}
    //                 Lorem ipsum dolor sit amet consectetur eleifend enim
    //                 elementum et at faucibus..
    //               </Text>
    //             </Container>
    //             <Switch size="sm" style={{ marginRight: 32 }} />
    //           </HStack>
    //         </View>
    //         {/*Section Name + Toggle*/}
    //         <View style={styles.stayUpdatedSubSection}>
    //           <HStack alignItems="center">
    //             <Container style={{ width: 300 }}>
    //               <Text style={styles.stayUpdatedText}>
    //                 {""}
    //                 Lorem ipsum dolor sit amet consectetur eleifend enim
    //                 elementum et at faucibus..
    //               </Text>
    //             </Container>
    //             <Switch size="sm" style={{ marginRight: 32 }} />
    //           </HStack>
    //         </View>
    //         {/*Breaking News + Toggle*/}
    //         <View style={styles.stayUpdatedSubSectionTwo}>
    //           <HStack alignItems="center">
    //             <Container style={{ width: 300 }}>
    //               <Text style={styles.stayUpdatedText}>
    //                 {""}
    //                 Lorem ipsum dolor sit amet consectetur eleifend enim
    //                 elementum et at faucibus..
    //               </Text>
    //             </Container>
    //             <Switch size="sm" style={{ marginRight: 3 }} />
    //           </HStack>
    //         </View>
    //       </View>
    //       {/*Trending*/}
    //       <View style={styles.section_container}>
    //         <Divider style={styles.divider_three} />
    //         <Text style={styles.miniTitle}>Trending</Text>
    //         <VStack style={{ marginLeft: 16, paddingBottom: 16 }}>
    //           <Container>
    //             <HorizontalCard article={dummyData[0]}></HorizontalCard>
    //           </Container>
    //           <Container>
    //             <HorizontalCard article={dummyData[1]}></HorizontalCard>
    //           </Container>
    //           <Container>
    //             <HorizontalCard article={dummyData[0]}></HorizontalCard>
    //           </Container>
    //         </VStack>
    //       </View>
    //       {/*Recommended*/}
    //       <View style={styles.section_container}>
    //         <Divider style={styles.divider_three} />
    //         <Text style={styles.miniTitle}>Recommended</Text>
    //         <VStack style={{ marginLeft: 16, paddingBottom: 16 }}>
    //           <HStack space={3}>
    //             <SmallCard article={dummyData[0]}> </SmallCard>
    //             <SmallCard article={dummyData[1]}> </SmallCard>
    //           </HStack>
    //           <HStack
    //             space={3}
    //             style={{ paddingTop: 12, paddingBottom: 27.61 }}
    //           >
    //             <SmallCard article={dummyData[2]}> </SmallCard>
    //             <SmallCard article={dummyData[3]}> </SmallCard>
    //           </HStack>
    //         </VStack>
    //       </View>

    //       {/*Today's Picks*/}
    //       <View style={styles.section_container}>
    //         <Divider style={styles.divider_three} />
    //         <Text style={styles.miniTitle}>Today's Picks</Text>
    //         <ScrollView
    //           horizontal
    //           showsHorizontalScrollIndicator={false}
    //           style={{ marginLeft: 16 }}
    //         >
    //           <HStack space={3} style={{ paddingBottom: 36.37 }}>
    //             {dummyData.map((article, index) => (
    //               <ImageCard key={index} article={article} /> // Ensure SmallCard expects a prop named 'article'
    //             ))}
    //           </HStack>
    //         </ScrollView>
    //       </View>
    //     </ScrollView>
    //   </VStack>
    // </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  section_container: {
    paddingTop: 16,
  },
  container: {
    padding: 10,
  },
  recommendedText: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 18,
  },
  divider: {
    backgroundColor: "black",
    height: 1,
    width: 393,
    marginLeft: 12,
    marginRight: 12,
  },
  divider_two: {
    backgroundColor: "#1C1B1F",
    width: 393,
    height: 1,
    marginLeft: 12,
    marginBottom: 7.3,
    marginRight: 12,
  },
  divider_three: {
    backgroundColor: "#1C1B1F",
    width: 393,
    height: 2,
    marginLeft: 12,
    marginBottom: 8.06,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  miniTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: 16,
    marginBottom: 16,
  },
  featuredStoryText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 16,
  },
  seeMoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e64e5", // Replace with your theme color or as per Figma design
  },
  largeCard: {
    marginLeft: 16,
    marginBottom: 31.94,
  },
  cardContainer: {
    // paddingLeft: 16, // Horizontal padding for horizontal ScrollView
  },
  stayUpdatedSubSection: {
    marginLeft: 32,
    alignItems: "baseline",
    marginTop: 16,
  },
  stayUpdatedSubSectionTwo: {
    marginLeft: 32,
    alignItems: "baseline",
    marginTop: 16,
    marginBottom: 39.44,
  },
  stayUpdatedText: {
    paddingRight: 64,
    fontSize: 12,
  },
});

export default ForYouScreen;
