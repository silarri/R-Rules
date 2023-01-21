import React from 'react';
import {
    ToolbarAndroid, AppRegistry,
    StyleSheet, View, Alert,
} from 'react-native';
import {
    Container, Button, Text,
    Icon
} from 'native-base';


// Calendar
import RNCalendarEvents from 'react-native-calendar-events';

// UI
import FBLoginButton from "./components/FBLoginButton"

// DB
const Realm = require('realm');
import * as Schemas from "../realmSchemas/schema";
export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disable: true
        }
    }

    static navigationOptions = {
        title: 'Login',
        headerLeft: null,
    };

    async componentDidMount() {
        console.log("HOME componentDidMount");
        // Prepare headers
        this.props.navigation.setParams({
            headerMode: 'float',
        });
        try {
            // Check permissions
            console.log("SOLICITAR PERMISO CALNDARIO");
            let calendar = await RNCalendarEvents.authorizeEventStore();
            console.log("SOLICITADO: " + calendar);

            //console.log("ANTES DE GEOLOCALIZACIÓN");
            let location = await navigator.geolocation.requestAuthorization();
            //console.log("DESPUÉS DE GEOLOCALIZACIÓN: " + location);

            if (location === 'authorized' && calendar === 'authorized') {
                let user = Schemas.retrieveUser();
                if (user !== null) {
                    // Navigate to home
                    this.props.navigation.navigate('Home');
                }   
            } else {
                // No permissions, cannot continue

            }
    
            
        } catch (error) {
            
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Container style={styles.facebook}>
                    <FBLoginButton navigation={this.props.navigation} />
                </Container>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    facebook: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30%',
        marginBottom: '40%',
    }
});