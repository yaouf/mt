import React, { useEffect, useState, useRef } from 'react';
import { View, Button } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { StackScreenProps, useGestureHandlerRef } from '@react-navigation/stack';
import { useNavigationState } from '@react-navigation/native';

type ComponentParams = {
 Home: undefined;
 Article: { articleUrl: string }; // Parameter for the Article screen
};


type ArticleProps = StackScreenProps<ComponentParams, 'Article'>;

/**
* When click on article, will redirect to this native article component
* instead of opening in webview
*
* Will integrate into webview redirect and add smooth transitions
*
* @returns native Article component
*/
function Article({ route, navigation }: ArticleProps) {
  const { articleUrl } = route.params;

  // Define the function to determine whether to load the request or not
  const shouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const url = event.url || '';

  if (url === "https://www.browndailyherald.com/") {
    // Do not load the URL, go to Home
    navigation.navigate('Home')
    return false;
  }
  // check if new url is an article, redirects to another article component
  else if ((url.includes('/article/')) && (url !== articleUrl)) {
    navigation.push('Article', { articleUrl: url });
    return false;
  }
  else {
    return true;
  }
  };

  return (
    <View style={styles.container}>
      <WebView source={{ uri: articleUrl }}
      style={styles.webview}
      onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
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
