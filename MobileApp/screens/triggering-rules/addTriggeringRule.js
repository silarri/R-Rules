import React from 'react';
import {
    StyleSheet, ScrollView
} from 'react-native';
import {
    Container, Text, Item, Form, Input, View
} from 'native-base';


// UI
import NavFooter from "../components/navFooter";

// Triggering rule info
import TabListCRforTR from '../components/TabListCRforTR';

/**
 * AddTriggeringRuleScreen: adds a new triggering rule.
 * Sends createScreen=true to the TabListCRforTR to let it know that a new triggering rule
 * is to be created.
 */
export default class AddTriggeringRuleScreen extends React.Component {

    constructor(props){
        super(props);

    }

    componentDidMount(){
        //this.storeData()
    }

   


    static navigationOptions = {
        title: 'Define triggering rule',
    };


    render() {
        return (
           <Container style = {styles.container}>
                <TabListCRforTR navigation={this.props.navigation} createScreen={true}></TabListCRforTR>      
                <NavFooter navigation={this.props.navigation} tab={"AddTriggeringRule"} />
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
    },
    description: {
        marginTop: '7%',
        marginLeft: '6%',
        marginRight: '6%',
    },
 });