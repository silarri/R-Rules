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
import TabListESComponent from '../components/TabListESComponent';

/**
 * EditExclusionSetScreen: shows or edits an existing exclusion set.
 * Sends createScreen=false to the TabListESComponent to let it know that it has to work
 * with an existing exclusion set.
 */
export default class EditExclusionSetScreen extends React.Component {

    constructor(props){
        super(props);

    }

    componentDidMount(){
        //this.storeData()
    }

   
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.exclusionSet.name,
        };
    };


    render() {
        return (
           <Container style = {styles.container}>
                <TabListESComponent navigation={this.props.navigation} createScreen={false}></TabListESComponent>      
                <NavFooter navigation={this.props.navigation} tab={"EditExclusionSet"} />
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