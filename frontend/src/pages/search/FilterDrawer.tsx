import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { varGray1 } from "src/styles/styles";
import { NavProp } from "src/types/navStacks";
import { MaterialIcons } from "@expo/vector-icons";

function FilterDrawer({ navigation }: NavProp) {
  const [filterOption, setFilterOption] = useState("Newest");
  const [searchMode, setSearchMode] = useState("article");

  const toggleSearchMode = () => {
    setSearchMode((prevMode) =>
      prevMode === "article" ? "author" : "article"
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="clear" size={20} accessible={false} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 30,
        }}
      >
        <Text style={{ paddingRight: 10 }}>Search by author instead</Text>

        <Switch
          trackColor={{ true: "#000000", false: "grey" }}
          value={searchMode == "author"}
          onValueChange={() => toggleSearchMode()}
          accessibilityLabel={`Article/author search toggle`}
          accessibilityHint={`Toggle to switch between article and author search`}
          accessibilityRole="switch"
          accessibilityState={{ checked: searchMode == "author" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default FilterDrawer;
