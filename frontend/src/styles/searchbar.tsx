import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const searchBarStyles = StyleSheet.create({
    searchButton: {
        left: (290/375) * screenWidth,
        right: (5/375) * screenWidth,
        width: screenWidth - ((290/375) * screenWidth),
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 10,
        zIndex: 1, // places above WebView
      },
      text: {
        fontSize: 12,
        color: 'black', 
      },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: (10/375) * screenWidth,
        paddingVertical: (6/812) * screenHeight,
        left: (10/375) * screenWidth,
        width: screenWidth - ((20/375) * screenWidth),
        zIndex: 1,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
      },
    searchCancel: {
        color:'black',
        fontSize: 30,
        zIndex: 2
      },
    searchInput: {
      flex: 1,
      marginRight: (10/375) * screenWidth,
      borderBottomWidth: 1,
      borderColor: "whitesmoke",
      paddingVertical: (7/812) * screenHeight,
      paddingHorizontal: (5/375) * screenHeight,
      borderRadius: 10,
    },
});