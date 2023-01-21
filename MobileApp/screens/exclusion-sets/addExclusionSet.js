import React from 'react';
import {
    StyleSheet, ScrollView
} from 'react-native';
import {
    Container, Picker, Text, Item, Form,
} from 'native-base';


// UI
import NavFooter from "../components/navFooter";


// Communication
import TabListESComponent from '../components/TabListESComponent';

/**
 * AddExclusionSetScreen: adds a new exclusion set.
 * Sends createScreen=true to the TabListESComponent to let it know that a new exclusion 
 * set is to be created.
 */
export default class AddExclusionSetScreen extends React.Component {

    constructor(props){
        super(props);
    }

    static navigationOptions = {
        title: 'Define exclusion set',
    };

    render() {
        return (
           <Container style = {styles.container}>
               <TabListESComponent navigation={this.props.navigation} createScreen={true}></TabListESComponent>
                <NavFooter navigation={this.props.navigation} tab={"AddExclusionSet"} />
           </Container>
        );
     }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#fff'
    },
    txt: {
        marginTop: '5%',
        marginBottom: '3%',
        marginLeft: '6%',
        fontSize: 18,
        color: 'black'
    },
    refresh: {
        marginLeft: '6%',
        marginRight: '6%',
        justifyContent: 'flex-start',
    }
 });