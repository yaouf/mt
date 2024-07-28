import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, View } from "react-native";
import SectionHeader from "src/components/SectionHeader";
import SmallCard from "src/components/cards/SmallCard";
import { fyp } from "src/styles/pages";
import { layout } from "src/styles/styles";
import { Article } from "src/types/data";

type FavSectionsProps = {
  title: string;
  data: Article[];
  navigation: StackNavigationProp<any, any>;
};

function FavSections({ title, data, navigation }: FavSectionsProps) {
  const handleSeeMorePress = () => {
    // Navigation that is to be performed on 'See more' press button
    console.log("See more pressed!");
  };

  return (
    <View>
      <SectionHeader title={title} onSeeMorePress={handleSeeMorePress} />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={layout.hStack}>
            {data.map((article, i) => (
              <View style={fyp.horzScrollCard} key={`fyp-fav-${i}`}>
                <SmallCard
                  article={article}
                  specialWidth="100%"
                  navigation={navigation}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default FavSections;
