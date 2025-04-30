import React from 'react';
import {
    StyleSheet, ScrollView
} from 'react-native';
import {
    Container, Text, Item, Form, Input, View
} from 'native-base';


// UI
import NavFooter from "../components/navFooter";


// Communication
import TabListCRforTR from '../components/TabListCRforTR';

/**
 * EditTriggeringRuleScreen: shows or edits an existing triggering-rule.
 * Sends createScreen=false to the TabListCRforTR to let it know that it has to work
 * with an existing triggering-rule.
 */
export default class EditTriggeringRuleScreen extends React.Component {

    constructor(props){
        super(props);

    }

    componentDidMount(){
        //this.storeData()
    }

   
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.triggeringRule.name,
        };
    };


    render() {
        return (
           <Container style = {styles.container}>
                <TabListCRforTR navigation={this.props.navigation} createScreen={false}></TabListCRforTR>      
                <NavFooter navigation={this.props.navigation} tab={"EditTriggeringRule"} />
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