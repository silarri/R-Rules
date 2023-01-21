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
export default class SavedScreen extends React.Component {
    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            saved: [],
        }
    }

    static navigationOptions = {
        title: 'Favorites',
    };

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        let user = Schemas.retrieveUser();
        if (user != null) {
            let token = user.token;
            let actvt = Schemas.filterActivities(token);

            // Saved
            let saved = actvt.filtered('state = "saved" AND discarded = false');

            this.setState({
                saved: saved,
                token: token,
            });
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <TabList navigation={this.props.navigation} data={this.state.saved} />
                <NavFooter navigation={this.props.navigation} tab={"Saved"} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
});
