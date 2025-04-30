import React from 'react';
import {
    StyleSheet, View,
    TextInput, FlatList,
} from 'react-native';
import {
    Header, Body, Container,
    ListItem, Content, Form, 
    Picker, Text, CheckBox
} from 'native-base';

// UI
import NavFooter from "./components/navFooter";
// Settings -> share options
import share from '../settings/activities';
// Database
import * as Schemas from '../realmSchemas/schema';
let realm = Schemas.myRealm;
export default class SettingsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            checkbox: share,
            settings: null,
            order: 'default',
        };
    }

    static navigationOptions = {
        title: 'Settings',
    };

    componentWillMount() {
        let token = this.state.token;
        // Get current user
        if (this.state.token == null) {
            token = Schemas.currentToken();
            this.setState({ token: token });
        }

        // load data from db if possible
        let set = realm.objects('Setting');
        // Update state.checkbox
        let cb = this.state.checkbox;
        cb.forEach(element => {
            let property = set.filtered(
                'userId = "' + token + '" AND type="SETTINGS" AND key = "' + element.key + '"'
            );
            // Property is an array of one item or zero
            if (property.length > 0) {
                element.value = property[0].value;
            }
        });
        // load order
        let order = Schemas.retrieveOrder(token);
        // Update state
        this.setState({
            token: token,
            checkbox: cb,
            settings: set,
            order: order,
        });
    }

    // Select one
    onPressCb(item) {
        let cb = this.state.checkbox;
        let token = this.state.token;
        let settings = this.state.settings;
        let property = settings.filtered(
            'userId = "' + token + '" AND type="SETTINGS" AND key = "' + item.key + '"'
        );

        // Update DB
        realm.write(() => {
            if (property.length > 0) {
                // Update
                property[0].value = !item.value;     // Negate current value
            } else {
                // Insert
                realm.create('Setting', {
                    userId: token,
                    type: "SETTINGS",
                    key: item.key,
                    value: !item.value, // Negate current value
                });
            }
        });

        // Update UI
        cb.forEach(element => {
            if (element.key == item.key) {
                element.value = !element.value;
            }
        });
        this.setState({ checkbox: cb });
    }

    onValueChange(value) {
        // UI
        this.setState({
            order: value
        });
        // DB
        Schemas.modifyOrder(this.state.token, value);
    }

    render() {
        return (
            <Container style={styles.container}>
                <Text style={styles.sectionTitle}>Kind of activities to show</Text>
                <Content>
                    <FlatList
                        data={this.state.checkbox}
                        extraData={this.state}
                        renderItem={({item }) =>
                            <ListItem>
                                <CheckBox
                                    checked={item.value}
                                    onPress={() => this.onPressCb(item)}
                                />
                                <Body>
                                    <Text>{item.key}</Text>
                                </Body>
                            </ListItem>
                        }
                    />
                </Content>
                <Text style={styles.orderTitle}>Order activities by</Text>
                <Form>
                    <Picker
                        mode="dropdown"
                        selectedValue={this.state.order}
                        onValueChange={this.onValueChange.bind(this)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Arrival time" value="default" />
                        <Picker.Item label="Title" value="title" />
                        <Picker.Item label="Stars" value="stars" />
                        <Picker.Item label="Ending time" value="time" />
                        <Picker.Item label="Distance" value="distance" />
                        <Picker.Item label="Type" value="type" />
                    </Picker>             
                </Form>
                <NavFooter navigation={this.props.navigation} tab={"Settings"} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    section: {
        flex: 1,
        marginTop: '5%',
    },
    sectionTitle: {
        marginBottom: '3%',
        marginLeft: '6%',
        color: 'black',
        justifyContent: 'flex-start',
        fontSize: 18,
    },
    orderTitle: {
        marginTop: '5%',
        marginBottom: '3%',
        marginLeft: '6%',
        color: 'black',
        fontSize: 18,
    },
    picker: {
        marginLeft: '6%',
    }
});