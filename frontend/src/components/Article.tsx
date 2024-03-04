import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { StackScreenProps } from '@react-navigation/stack';

type YourParamListType = {
 Home: undefined; // No additional parameters for the Home screen
 Article: { articleUrl: string }; // Parameter for the Article screen
};

type ArticleProps = StackScreenProps<YourParamListType, 'Article'>;

/**
* When click on article, will redirect to this native article component
* instead of opening in webview
*
* Will integrate into webview redirect and add smooth transitions
*
* @returns native Article component
*/
function Article({ route }: ArticleProps) {
 const { articleUrl } = route.params;

 return (
   <View style={styles.container}>
     <WebView
     source={{ uri: articleUrl }}
     style={styles.webview}
     />
   </View>
 );
}

const styles = {
 container: {
   flex: 1,
 },
 webview: {
   flex: 1,
 },
};

export default Article;
