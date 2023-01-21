import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Container } from 'native-base';
import { withNavigationFocus, NavigationActions } from 'react-navigation';

import NavFooter from '../components/navFooter';
import TabListCRules from '../components/TabListCRules';


/**
 * ContextRulesScreen: displays the list of context-rules created by the user.
 * You can add new context-rules by clicking on the "+" button, edit an existing 
 * context-rule by clicking on it and delete a context-rule by swiping to the left.
 */
export default class ContextRulesScreen extends React.Component {

   constructor(props){
      super(props);
      console.log("Constructor");
   }

   static navigationOptions = {
      title: 'Context rules',
  };


   onPressButton(){
      item = "Define_context_rule";
      const navigateAction = NavigationActions.navigate({
         routeName: item
     });
     this.props.navigation.dispatch(navigateAction);
   }

   
   render() {
      return (
         <Container style={styles.container}>
            <TabListCRules navigation={this.props.navigation} />
            <TouchableOpacity onPress={() => this.onPressButton()} style={styles.fab}>
               <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
            <NavFooter navigation={this.props.navigation} tab={"ContextRules"} />
   </Container>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#fff',
  },
  fab: {
   position: 'absolute',
   width: 56,
   height: 56,
   alignItems: 'center',
   justifyContent: 'center',
   right: 20,
   bottom: 80,
   backgroundColor: '#03A9F4',
   borderRadius: 30,
   elevation: 8
   },
   fabIcon: {
      fontSize: 40,
      color: 'white'
   }
});

