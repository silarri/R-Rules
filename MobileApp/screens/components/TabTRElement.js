import React from 'react';
import * as Communication from '../../em/fetch';

import {
    StyleSheet, Text, View,
    ListView, FlatList, Alert, Switch
} from 'react-native';

import {
    SwipeRow,
    Button, Icon
} from 'native-base';

// DB
import * as Schemas from "../../realmSchemas/schema";
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp";

export default class TabTRElement extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            item: this.props.data,
            switchValue: this.props.data.switchState
        }
    }

    // Click on ListItem
    onPressActivity(item) {
        this.props.navigation.navigate('Edit_Triggering_Rule', {triggeringRule: item});
    }

    // Delete activity from DB
    onDeleteItem(item) {
        let n = item.name;
        // Delete from DB
        Schemas.deleteTriggeringRuleById(item.id);

        // We update new siddhi app
        CreateSiddhiApp.createSiddhiApp();
        
        // Notify user
        Alert.alert('Success!', n + ' deleted');
        // Reload screen to see changes
        this.props.navigation.navigate('Recommendation_triggering_rules', {triggeringRule: item});
        
    }

    onSwitchChange(switchValue){
        console.log("SWITCH VALUE: " + switchValue);
        const newValue = !this.state.switchValue;
        this.setState({
           switchValue: newValue 
        });
        Schemas.updateStateTriggeringRule(this.state.item.id, newValue);

        // We update new siddhi app
        CreateSiddhiApp.createSiddhiApp();

        console.log("SWITCH VALUE CHANGED");
    }

    render(){
        return(
            <SwipeRow
                rightOpenValue={-75}
                body={
                    <View style={{flexDirection : 'row'}}>
                        <Switch style={{marginLeft: 10}}
                            value={this.state.switchValue}
                            onValueChange= {(switchValue) => this.onSwitchChange(switchValue)}></Switch>
                        <Text 
                            style={{ paddingLeft: 15 }}
                            onPress={() => this.onPressActivity(this.state.item)}
                        >
                            <Text style={styles.bold}> {this.state.item.name } </Text>
                            <Text> #{this.state.item.recommendationType} </Text>
                        </Text>
                    </View>
                }
                right={
                    <Button danger onPress={() => this.onDeleteItem(this.state.item)}>
                        <Icon active name="trash" />
                    </Button>
                }
            />
        )
    }
}

const styles = StyleSheet.create({
    italic: {
        fontStyle: 'italic'
    },
    bold: {
        fontWeight: 'bold'
    }
});
