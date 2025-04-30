import React from 'react';
import * as Communication from '../../em/fetch';

import {
    StyleSheet, Text, View,
    ListView, FlatList, Alert, TouchableOpacity
} from 'react-native';

import {
    SwipeRow,
    Button, Icon, Container, Item
} from 'native-base';

import { withNavigationFocus, NavigationActions } from 'react-navigation';
import Modal from 'react-native-modal';

// DB
import * as Schemas from "../../realmSchemas/schema";
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp";

class TabListCRules extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            contextRules: [],
            modal : false,
            triggeringRulesBeforeDelete: []
        }
    }

    // Load context rules from DB
    loadData() {
        // Retrive Context Rules Stored
        console.log("Load data");
        let contextRules = Schemas.retrieveContextRules();

        // Convert realm result object to javascript array
        if(contextRules != null){
            contextRules = Object.keys(contextRules).map(key => contextRules[key]);
            this.setState({
                contextRules: contextRules,
            });
        }
    }
    
    componentDidMount(){
        console.log("componentDidMount");
        this.loadData();
    }

    // Load data when navigator is not reset
    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate");
      if (prevProps.isFocused !== this.props.isFocused) {
        // Use the `this.props.isFocused` boolean
        this.loadData();
      }
    }

    // Click on ListItem
    onPressContextRule(item) {
        console.log("Context rule press");
        console.log(item.name);
        console.log(item.daysOfWeek);
        if(item.type == 'Location'){
            this.props.navigation.navigate('Edit_Location_Context_Rule', {contextRule: item});
        }else if(item.type == 'Time-Based'){
            this.props.navigation.navigate('Edit_Time_Based_Context_Rule', {contextRule: item});
        }else if(item.type=='Calendar-Based'){
            this.props.navigation.navigate('Edit_Calendar_Based_Context_Rule', {contextRule: item});
        }else if(item.type=='Weather'){
            this.props.navigation.navigate('Edit_Weather_Context_Rule', {contextRule: item});
        }else if(item.type=='Server-Based'){
            this.props.navigation.navigate('Edit_Server_Based_Context_Rule', {contextRule: item});
        }
    }

    onPressOkButton(){
        this.setState({
            modal: false,
            triggeringRulesBeforeDelete: []
        })
    }

    // Delete activity from DB
    onDeleteContextRule(item,index) {
        let triggeringRules = item.triggeringRules;
        if(triggeringRules.length > 0){
            // Displaying information modal
            this.setState({modal: true, triggeringRulesBeforeDelete: triggeringRules})
        }else{
            let n = item.name;
            // Delete from DB
            let copy = this.state.contextRules;
            copy.splice(index, 1);

            this.setState({
                data:copy
            });

            Schemas.deleteContextRuleById(item.id);

            CreateSiddhiApp.createSiddhiApp();
            
            // Notify user
            Alert.alert(n,'Deleted');
        }

    }


    
    render() {
        return (
            <Container>
            <FlatList
                data={this.state.contextRules}
                extraData={this.state}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item , index}) =>
                    <SwipeRow
                        disableRightSwipe
                        rightOpenValue={-75}
                        body={
                            <View >
                                <Text 
                                    style={{ paddingLeft: 15 }}
                                    onPress={() => this.onPressContextRule(item)}
                                >
                                    <Text style={styles.bold}> {item.name } </Text>
                                    <Text> #{item.type} </Text>
                                </Text>
                            </View>
                        }
                        right={
                            <Button danger onPress={() => this.onDeleteContextRule(item, index)}>
                                <Icon active name="trash" />
                            </Button>
                        }
                    />
                }
            />
            <Modal style={styles.modal}
                isVisible={this.state.modal}>
                <View style={styles.modalTextView}>
                    <Text style={styles.txtBig}>Warning:</Text>
                    <Text style={styles.txt}>You can't delete this context rule because it is used in the following triggering rules:</Text>
                    <Item style={styles.item}>
                        <Text style={[styles.txtItem, {marginLeft:'4%'}]}>Name</Text>
                        <Text style={styles.txtItem}> #Type of recommendation</Text>
                    </Item>
                </View>
                <View style={styles.modalView}>
                    <FlatList 
                        data={this.state.triggeringRulesBeforeDelete}
                        extraData={this.state}
                        keyExtractor={item => item.id.toString()}
                        renderItem={ ({item}) => 
                            <Item style={styles.modalItem}>
                                    <Text style={[styles.bold, styles.modalText]}> {item.name } </Text>
                                    <Text> #{item.recommendationType} </Text>
                            </Item>
                        }
                />  
                </View>
                <View style={[styles.general, {alignSelf:'flex-end'}]}>
                    <TouchableOpacity 
                        onPress={() =>this.onPressOkButton()} >
                        <View style={styles.save}>
                            <Text style={styles.saveText}>
                                Ok
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    italic: {
        fontStyle: 'italic'
    },
    bold: {
        fontWeight: 'bold'
    },
    modalTextView:{
        marginTop: '6%',
    },
    txtBig:{
        fontSize: 20,
        color:'black',
        fontWeight: 'bold',
        marginHorizontal:'4%',
    },
    txt:{
        marginTop: '5%',
        fontSize: 16,
        color:'black',
        marginHorizontal:'4%',
    },
    modal: {
        height: 200,
        backgroundColor:'white',
        flex:1
    },
    save: {
        marginTop: 25,
        marginLeft:'10%',
        marginBottom: '10%',
        width: 100,
        height: 40,
        backgroundColor: '#03A9F4',
        elevation: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveText: {
        fontSize: 18,
        color: 'white'
    },
    general: {
        justifyContent: 'flex-start',
        
    },
    modalView:{
        justifyContent: 'center',
        flex:1
    },
    modalItem:{
        height: 44,
    },
    modalText:{
        marginLeft: '3%',
    },
    item:{
        flexDirection : 'row', 
        alignItems: 'center',
    },
    txtItem : {
        fontSize: 14,
        color:'black',
        marginTop: '5%',
        marginBottom: '5%',
    }
});

module.exports = withNavigationFocus(TabListCRules);