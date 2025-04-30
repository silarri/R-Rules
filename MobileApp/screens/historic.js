import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import {
    Container,
} from 'native-base';
const Realm = require('realm');

// EMs
// import * as EMfetch from "../em/fetch";

// DB
import * as Schemas from "../realmSchemas/schema";
// UI
import NavFooter from "./components/navFooter";
import TabList from "./components/TabList";
// Data
// import activities from "../em/demo";
export default class HistoricScreen extends React.Component {
    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            historic: [],
        }
    }

    static navigationOptions = {
        title: 'Historic',
    };

    componentWillMount() {
        this.loadData()
    }

    loadData() {
        let user = Schemas.retrieveUser();
        if (user != null) {
            let token = user.token;
            let actvt = Schemas.filterActivities(token);
            //let actvt = realm.objects('Activity');

            // Historic; end date < today and
            // distance > 100 km
            let now = new Date().toISOString();

            //console.log(now);

            // Filters activities that have finished or have been rated
            let historic = actvt.filtered(
                'state = "default" AND discarded = false ' +
                'AND (ending < $0 OR rating > 0)', now
            );


            this.setState({
                historic: historic,
                token: token,
            });
        }

    }

    render() {
        return (
            <Container style={styles.container}>
                <TabList navigation={this.props.navigation} data={this.state.historic}/>
                <NavFooter navigation={this.props.navigation} tab={"Historic"} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
});
