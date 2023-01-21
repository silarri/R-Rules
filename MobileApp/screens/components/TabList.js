import React from 'react';
import * as Communication from '../../em/fetch';

import {
    StyleSheet, Text, View,
    ListView, FlatList, Alert
} from 'react-native';

import {
    SwipeRow,
    Button, Icon
} from 'native-base';

// DB
import * as Schemas from "../../realmSchemas/schema";

export default class TabList extends React.Component {

    constructor(props) {
        super(props);
    }
    
    // Click on ListItem
    onPressActivity(item) {
        // Set clicked true
        Schemas.markActivityAs(item, 'CLICKED', true);
        // Send feedback
        Communication.fetchFeedback(item);
        // Save activity selected
        this.props.navigation.navigate('Activity', {activity: item});
    }

    // Delete activity from DB
    onDeleteActivity(item) {
        let title = item.title;
        Alert.alert(title, "Is going to be deleted.",
        [{text: 'Cancel', style:'cancel'},
        {text: 'For now', onPress: () => Schemas.deleteActivityById(item.id)},
        {text: 'Forever', onPress: () => {
            // Set discarded true
            Schemas.markActivityAs(item, 'DISCARDED', true);
            // Send feedback
            Communication.fetchFeedback(item);}}
        ], { cancelable: true });
    }

    // Save activity
    onSaveActivity(item) {
        // Set saved true
        Schemas.markActivityAs(item, 'SAVED', true);
        // Send feedback
        Communication.fetchFeedback(item);
        // Notify user
        let title = item.title;
        Alert.alert(title, 'Saved');
    }

    onRemoveActivity(item) {
        // Set saved false
        Schemas.markActivityAs(item, 'SAVED', false);
        // Send feedback
        Communication.fetchFeedback(item);
        // Notify user
        let title = item.title;
        Alert.alert(title, 'Removed from saved');
    }

    render() {
        return (
            <FlatList
                data={this.props.data}
                extraData={this.state}
                keyExtractor={item => item.id}
                renderItem={({ item }) =>
                    <SwipeRow
                        leftOpenValue={75}
                        rightOpenValue={-75}
                        left={
                            (item.state != 'saved') ?
                            <Button success onPress={() => this.onSaveActivity(item)} >
                                <Icon active name="star" />
                            </Button> :
                            <Button primary onPress={() => this.onRemoveActivity(item)} >
                                <Icon active name="remove" />
                            </Button> 
                        }
                        body={
                            <View >
                                <Text 
                                    style={{ paddingLeft: 15 }}
                                    onPress={() => this.onPressActivity(item)}
                                >
                                    <Text style={styles.bold}> {item.title } </Text>
                                    <Text> #{item.type} </Text>
                                </Text>
                            </View>
                        }
                        right={
                            <Button danger onPress={() => this.onDeleteActivity(item)}>
                                <Icon active name="trash" />
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
    }
});

module.exports = TabList;