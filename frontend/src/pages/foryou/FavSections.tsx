import { ScrollView, Text, View } from "react-native";
import SectionHeader from "src/components/SectionHeader";
import SmallCard from "src/components/cards/SmallCard";
import { FYstyles } from "src/styles/foryou";
import { Article } from "src/types/types";

type FavSectionsProps = {
  title: string;
  data: Article[];
};

function FavSections({ title, data }: FavSectionsProps) {
  const handleSeeMorePress = () => {
    // Navigation that is to be performed on 'See more' press button
    console.log("See more pressed!");
  };

  return (
    <View>
      {/* <Divider style={styles.divider} /> */}
      {/*Arts and Section Header*/}
      <SectionHeader title={title} onSeeMorePress={handleSeeMorePress} />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={FYstyles.hStack}>
            {data.map((article, index) => (
              <SmallCard key={index} article={article} /> // Ensure SmallCard expects a prop named 'article'
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default FavSections;
