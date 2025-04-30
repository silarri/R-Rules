import React from 'react';
import {
    StyleSheet, 
} from 'react-native';
import {
    Container,
} from 'native-base';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

// DB
import * as Schemas from '../realmSchemas/schema';

export default class MapsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            longitude: this.props.navigation.state.params.activity.longitude,
            latitude: this.props.navigation.state.params.activity.latitude,
            title: this.props.navigation.state.params.activity.title,
            marker: {
                "longitude": this.props.navigation.state.params.activity.longitude,
                "latitude": this.props.navigation.state.params.activity.latitude,
            },
            location: {
                "longitude": this.props.navigation.state.params.activity.longitude,
                "latitude": this.props.navigation.state.params.activity.latitude,
                "latitudeDelta": 0.03,
                "longitudeDelta": 0.03
            },
            you: {
                longitude: 0,
                latitude: 0,
            }
        };
    }

    componentWillMount() {
        let location = JSON.parse(Schemas.retrieveContext("LOCATION").json);

        this.setState({
            you: {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude
            }
        }); 
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.activity.title,
        };
    };

    render() {
        return (
            <Container style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={this.state.location}
                >
                    <Marker
                        coordinate={this.state.marker}
                        title={this.state.title}
                    />
                    <Marker
                        pinColor={'green'}
                        coordinate={this.state.you}
                        title={"You are here!"}
                    />
                </MapView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});