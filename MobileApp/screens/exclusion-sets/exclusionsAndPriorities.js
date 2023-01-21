import React from 'react';
import { Container } from 'native-base';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { withNavigationFocus ,NavigationActions } from 'react-navigation';

import NavFooter from '../components/navFooter';
import TabListExclusionSets from '../components/TabListExclusionSets';


/**
 * ExclusionsAndPrioritiesScreen: displays the list of exclusion-sets created by the user.
 * You can add new exclusion-sets by clicking on the "+" button, edit an existing 
 * exclusion-set by clicking on it and delete a exclusion-set by swiping to the left.
 */
class ExclusionsAndPrioritiesScreen extends React.Component {
   
   constructor(props){
      super(props)
   }

   static navigationOptions = {
      title: 'Exclusion sets',
   };

   onPressButton(){
      item = "Define_Exclusion_Set";

      const navigateAction = NavigationActions.navigate({
         routeName: item
      });
      this.props.navigation.dispatch(navigateAction);
   }

   render() {
      return (
         <Container style = {styles.container}>
            <TabListExclusionSets navigation={this.props.navigation}/>
            <TouchableOpacity onPress={() => this.onPressButton()} style={styles.fab}>
                    <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
            <NavFooter navigation={this.props.navigation} tab={"ExclusionSets"} />
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

export default withNavigationFocus(ExclusionsAndPrioritiesScreen);