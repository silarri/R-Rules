import React from 'react';
import {
    StyleSheet, View, FlatList, ScrollView
} from 'react-native';
import {
    Body, Container,
    ListItem, Item,
    Text, CheckBox,
    Input, Label,
    Icon
} from 'native-base';
// UI
import NavFooter from "./components/navFooter";

// Se ha elimnado el botón de cerrar sesión debido a los problemas con el login
// Si se soluciona -> Añadir en la parte de abajo de esta vista
//import FBLoginButton from "./components/FBLoginButton"

// Data
// Settings -> share options
import share from '../settings/share';
// Database
const Realm = require('realm');
import * as Schemas from '../realmSchemas/schema';
let realm = Schemas.myRealm;
export default class ProfileScreen extends React.Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            checkbox: share,
            refresh: '3',
            refresh_error: false,
            distance: '3',
            distance_error: false,
            location: true,
        }
    }

    static navigationOptions = {
        title: 'Profile',
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
                'userId = "' + token + '" AND type="PROFILE" AND key = "' + element.key + '"'
            );
            // Property is an array of one item or zero
            if (property.length > 0) {
                element.value = property[0].value;
            }
        });
        // Check location
        let location = Schemas.retrieveValueSetting(token, "PROFILE", "Location");
        // Load Communication rate & distance (Km)
        // Comunication rate
        let mm = Schemas.retrieveValueParameter(token, "PROFILE", "RATE");
        if (mm == null) mm = '3';
        // Distante
        let km = Schemas.retrieveValueParameter(token, "PROFILE", "DISTANCE");
        if (km == null) km = '5';
        // Update state
        this.setState({
            token: token,
            checkbox: cb,
            refresh: mm,
            distance: km,
            location: location,
        });
    }

    // Select one
    onPressCb(item) {
        let cb = this.state.checkbox;
        let token = this.state.token;
        let settings = realm.objects('Setting');
        let location = this.state.location;
        // Update DB
        realm.write(() => {
            let property = settings.filtered(
                'userId = "' + token + '" AND type="PROFILE" AND key = "' + item.key + '"'
            );
            if (property.length > 0) {
                // Update
                property[0].value = !item.value;     // Negate current value
            } else {
                // Insert
                realm.create('Setting', {
                    userId: token,
                    type: "PROFILE",
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
        // Check if item.key to show/hide accurate location
        if (item.key == 'Location') {
            location = item.value;
        }
        this.setState({ checkbox: cb, location: location });
    }

    // Update refresh rate
    onChangeRefresh(value) {
        let token = this.state.token;
        // Value to Integer
        let number = parseInt(value);
        if (Number.isInteger(number)) {
            // OK. Update value, hide error, show ok input
            error = false; 
            // Update database
            Schemas.storeParameter(token, "PROFILE", "RATE", value);
        } else {
            // Show error, hide OK input
            error = true;
        }
        // Update UI
        this.setState({ 
            refresh: value,
            refresh_error: error,
        });
    }

    // Update refresh rate
    onChangeDistance(value) {
        let token = this.state.token;
        // Value to Integer
        let number = parseInt(value);
        if (Number.isInteger(number)) {
            // OK. Update value, hide error, show ok input
            error = false; 
            // Update database
            Schemas.storeParameter(token, "PROFILE", "DISTANCE", value);
        } else {
            // Show error, hide OK input
            error = true;
        }
        // Update UI
        this.setState({ 
            distance: value,
            distance_error: error,
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <ScrollView>
                    <View>
                        <Text style={styles.sectionTitle}>Share with EMs</Text>
                        <FlatList
                            data={this.state.checkbox}
                            extraData={this.state}
                            renderItem={({ item }) => 
                            !(item.key == 'Accurate Location' && !this.state.location) &&
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
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.sectionTitle}>Communication rate with EMs</Text>
                        { !this.state.refresh_error &&
                        <Item inlineLabel style={styles.refresh}>
                            <Label>Minutes</Label>
                            <Input 
                                placeholder={this.state.refresh}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeRefresh.bind(this)}
                            />
                        </Item>
                        }
                        { this.state.refresh_error &&
                        <Item inlineLabel error style={styles.refresh}>
                            <Label>Minutes</Label>
                            <Input 
                                placeholder={this.state.refresh}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeRefresh.bind(this)}
                            />
                            <Icon name='close-circle' />
                        </Item>
                        }
                    </View> 
                    <View style={styles.view}>
                        <Text style={styles.sectionTitle}>Discover EMs nearer than</Text>    
                        { !this.state.distance_error &&
                        <Item inlineLabel style={styles.refresh}>
                            <Label>Km</Label>
                            <Input 
                                placeholder={this.state.distance}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeDistance.bind(this)}
                            />
                        </Item>
                        }
                        { this.state.distance_error &&
                        <Item inlineLabel error style={styles.refresh}>
                            <Label>Km</Label>
                            <Input 
                                placeholder={this.state.distance}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeDistance.bind(this)}
                            />
                            <Icon name='close-circle' />
                        </Item>
                        }          
                    </View>      
                </ScrollView>
                <NavFooter navigation={this.props.navigation} tab={"Profile"} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    sectionTitle: {
        marginBottom: '3%',
        marginLeft: '6%',
        color: 'black',
        justifyContent: 'flex-start',
        fontSize: 18,
    },
    refresh: {
        marginLeft: '6%',
        marginRight: '6%',
        justifyContent: 'flex-start',
    },
    fbButton: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%',
        marginBottom: '10%',
    },
    logout: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30%',
        marginBottom: '40%',
    },
    view: {
        marginTop: '5%',
    }
});