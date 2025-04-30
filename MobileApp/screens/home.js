import React from 'react';
import {
    StyleSheet, 
    AppRegistry
} from 'react-native';
import {
    Container,
} from 'native-base';

// EMs
import * as Communication from "../em/fetch";

// DB
import * as Schemas from "../realmSchemas/schema";
let realm = Schemas.myRealm;
// Notifications
import * as Notifications from '../event/notification';
import * as Fetch from '../em/fetch';
// UI
import NavFooter from "./components/navFooter";
import TabList from "./components/TabList";
// Data
import activities from "../em/demo";


  
export default class HomeScreen extends React.Component {
    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            defaults: [],
        }
    }

    static navigationOptions = {
        title: 'Home',
        headerLeft: null,
    };

    componentWillMount() {
        
        // Demo data 
        console.disableYellowBox = true;
        //Schemas.deleteAllActivities();
        /*
        if(Schemas.currentToken() != null){
            Schemas.deleteAllActivities();
            
            activities.default.forEach(element => {
                Schemas.storeActivity(element);
            }); 
            activities.saved.forEach(element => {
                Schemas.storeActivity(element);
            }); 
            activities.historic.forEach(element => {
                Schemas.storeActivity(element);
            });  
            
        }
        */
        //Notifications.activityUpdate();
        //Fetch.testConnection();
        
        
        this.loadData();
    }

    componentWillReceiveProps() {
        this.loadData();
    }

    componentDidMount() {
        console.log('HOME: componentDidMount')
        Communication.testConnection();
        this.loadData();
        console.log('HOME: App started!')
    }

    loadData() {
        console.log("load data");
        let user = Schemas.retrieveUser();
        if (user != null) {
            let token = user.token;
            let actvt = Schemas.filterActivities(token);
            //let actvt = realm.objects('Activity');
            // Defaults & end date ≥ today
            let now = new Date().toISOString();
            let defaults = actvt.filtered(
                'rating = 0 AND discarded = false AND ' + 
                'state = "default" AND (ending >= $0 or ending == nil)', now
            );         

            this.setState({
                defaults: defaults,
                token: token,
            });
        }

    }

    render() {
        return (
            <Container style={styles.container}>
                <TabList navigation={this.props.navigation} data={this.state.defaults} />
                <NavFooter navigation={this.props.navigation} tab={"Default"} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
});
