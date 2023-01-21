import React from 'react';
import {
    StyleSheet, View, 
} from 'react-native';
import {
    Container, Button, Text,
} from 'native-base';
// UI
import NavFooter from "./components/navFooter";

// DB
import * as Schemas from "../realmSchemas/schema";

// Notifications
import * as Notifications from '../event/notification';

export default class ContextScreen extends React.Component {

    // Constructor
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: 'Context',
    };
    // Click on Footer
    onPressFooter(data) {
        this.props.navigation.navigate(data);
    }

    // Click on InfoBtn
    onInfobtn(item){
        info = Schemas.retrieveContext(item);
        alert(info.json);
    }

    onUserbtn(){
        info = Schemas.retrieveUser();
        alert(JSON.stringify(info));
    }

    onNotification() {
        Notifications.localScheduledTest();
    }

    render() {
        return (
            <Container style={styles.container}>
                <View style={styles.context}>
                    <Button
                        style={styles.btn}
                        onPress={() => this.onUserbtn()}>
                        <Text>Facebook User</Text>
                    </Button>

                    <Button
                        style={styles.btn}
                        onPress={() => this.onInfobtn('LOCATION')}>
                        <Text>Location</Text>
                    </Button>

                    <Button
                        style={styles.btn}
                        disabled={true}
                        onPress={() => this.onInfobtn('FBPosition')}>
                        <Text>Facebook Location</Text>
                    </Button>

                    <Button
                        style={styles.btn} 
                        onPress={() => this.onInfobtn('WEATHER')}>
                        <Text>Weather</Text>
                    </Button>

                    <Button
                        style={styles.btn} 
                        onPress={() => this.onInfobtn('CALENDARS')}>
                        <Text>Calendars</Text>
                    </Button>

                    <Button
                        style={styles.btn} 
                        onPress={() => this.onInfobtn('EVENTS')}>
                        <Text>Events</Text>
                    </Button>

                    <Button
                        style={styles.btn} 
                        onPress={() => this.onNotification()}>
                        <Text>Notification</Text>
                    </Button>

                </View>
                <NavFooter navigation={this.props.navigation} tab={"Context"}/>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderBottomColor: 'black',
    },
    toolbar: {
        height: '8%',
        backgroundColor: '#3F51B5', // Primary color
    },
    context: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30%',
        marginBottom: '40%',
    },
    btn: {
        
    }
});