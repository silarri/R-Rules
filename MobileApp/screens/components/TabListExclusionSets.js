import React from 'react';
import * as Communication from '../../em/fetch';

import {
    StyleSheet, Text, View,
    ListView, FlatList, Alert, TouchableOpacity
} from 'react-native';

import {
    SwipeRow,
    Button, Item
} from 'native-base';

import { withNavigationFocus, NavigationActions } from 'react-navigation';

// DB
import * as Schemas from "../../realmSchemas/schema";

import Icon from '../../node_modules/react-native-vector-icons/FontAwesome';

class TabListExclusionSets extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            exclusionSets: []
        }
    }

    // Load context rules from DB
    loadData() {
        console.log("loadData");
        
        // Retrive Context Rules Stored
        let exclusionSets = Schemas.retrieveExclusionSetsSortByPos();

        // Convert realm result object to javascript array
        if(exclusionSets != null){
            exclusionSets = Object.keys(exclusionSets).map(key => exclusionSets[key]);
            this.setState({
                exclusionSets: exclusionSets,
            });
        }
        console.log(this.state.exclusionSets);
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
        console.log("Im in");
        this.loadData();
      }
    }

    // Click on ListItem
    onPressExclusionSet(item) {
        console.log("onPressExclusionSet");
        this.props.navigation.navigate('Edit_Exclusion_Set', {exclusionSet: item});
    }

    // Delete activity from DB
    onDeleteExclusionSet(item,index) {
        console.log("onDeleteExclusionSet");
        let n = item.name;
        // Delete from DB
        let copy = this.state.exclusionSets;
        copy.splice(index, 1);

        this.setState({
            exclusionSets:copy
        });

        Schemas.deleteExclusionSetById(item.id);
        
        // Notify user
        Alert.alert(n,'Deleted');
    }

    
    onUpExclusionSet(item){
        let i = item.pos;
        console.log("onUpExclusionSet: " +  i);
        if(i > 1){
            console.log("UPDATE EXCLUSION SETS");
            let upExclusionSet = Schemas.retrieveExclusionSetByPos(i - 1);
            console.log("UpExclusionSet: " + upExclusionSet);
            Schemas.updateExclusionSetPos(item.id, i -1);
            Schemas.updateExclusionSetPos(upExclusionSet.id, i);
            this.loadData();
        }
    }

    onDownExclusionSet(item){
        let i = item.pos;
        console.log("onDownExclusionSet: " + i);
        if(i < this.state.exclusionSets.length){
            console.log("UPDATE EXCLUSION SETS");
            let upExclusionSet = Schemas.retrieveExclusionSetByPos(i + 1);
            console.log("UpExclusionSet: " + upExclusionSet);
            Schemas.updateExclusionSetPos(item.id, i + 1);
            Schemas.updateExclusionSetPos(upExclusionSet.id, i);
            this.loadData();
        }
    }


    render() {
        return (
            <FlatList
                ListHeaderComponent = {
                    <Item>
                        <Text style={styles.txtUp}>In case of contradictions between exclusion sets, the exclusion sets are considered in the order in which they are listed. You can order exclusion sets using the up and down arrow buttons.</Text>
                    </Item>
                }
                data={this.state.exclusionSets}
                extraData={this.state}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item , index}) =>
                    <SwipeRow
                        disableRightSwipe
                        rightOpenValue={-75}
                        body={
                            <View style={{flex: 1, flexDirection : 'row',alignItems:'center', justifyContent:'space-between'}}>
                                <Text 
                                    style={{ paddingLeft: 15 }}
                                    onPress={() => this.onPressExclusionSet(item)}
                                >
                                    <Text style={styles.bold}> {item.name } </Text>
                                </Text>
                                <View style={{ flexDirection:'row', width:80, justifyContent:'space-around'}}>
                                    <TouchableOpacity
                                        onPress={() => this.onUpExclusionSet(item)}>
                                        <Icon name="arrow-circle-o-up" size={33}></Icon>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => this.onDownExclusionSet(item)}>
                                        <Icon name="arrow-circle-o-down" size={33}></Icon>
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                        }
                        right={
                            <Button danger onPress={() => this.onDeleteExclusionSet(item, index)}>
                                <Icon active name="trash" size={24}/>
                            </Button>
                        }
                    />
                }
            />
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
    txtUp: {
        marginTop: '2%',
        marginBottom: '2%',
        marginHorizontal: '5%',
        fontSize: 16,
        color: 'dimgrey'
    },
});

module.exports = withNavigationFocus(TabListExclusionSets);