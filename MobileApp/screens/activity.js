import React from 'react';
import {
    StyleSheet, Text, View, Image
} from 'react-native';
import {
    Container, Button, Content
} from 'native-base';

import StarRating from 'react-native-star-rating';

// UI
import NavFooter from "./components/navFooter";
// DB
import * as Schemas from "../realmSchemas/schema";
// Communication
import * as Communication from "../em/fetch";

export default class ActivityScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: this.props.navigation.state.params.activity,
            starCount: 0
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.activity.title,
        };
    };

    onStarRatingPress(rating) {
        // Update activity rating
        let activity = this.state.activity;
        let realm = Schemas.myRealm;
        // Update realm object
        realm.write(() => {
            activity.rating = rating;
        });

        // Update state
        this.setState({
            activity: activity
        });

        // Send feedback
        Communication.fetchFeedback(activity);
    }

    parseDate(date) {
        let min = date.getMinutes();
        let hh = date.getHours();
        let dd = date.getDate();
        let mm = date.getMonth() + 1;   // Stored beginning with 0
        let yy = date.getFullYear();
        // Format numbers that are less than 10
        if (min < 10) min = '0' + min;
        if (hh < 10) hh = '0' + hh;
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;


        if (min == 0 && hh == 0) {
            return( dd +"/" + mm + "/" + yy);
        } else {
            return( hh + ":" + min + " " + dd +"/" + mm + "/" + yy);
        }
    }

    onMap() {
        this.props.navigation.navigate('Maps', {activity: this.state.activity});
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <Content style={styles.imgView}>
                        <Image
                            style={styles.img}
                            source={{ uri: this.state.activity.img }}
                        />
                    </Content>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={styles.type}>
                            <Text style={styles.typeTxt}>
                                #{this.state.activity.type}
                            </Text>
                        </View>
                        <View style={styles.rating}>
                            <StarRating
                                disabled={false}
                                emptyStar={'ios-star-outline'}
                                fullStar={'ios-star'}
                                halfStar={'ios-star-half'}
                                iconSet={'Ionicons'}
                                maxStars={5}
                                rating={this.state.activity.rating}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                starSize={20}
                            />
                        </View>
                    </View>
                    <Text style={styles.description_title}>Description: </Text>
                    <Text style={styles.description}>
                        {this.state.activity.description}
                    </Text>
                    { // Not show date if never finish
                        this.state.activity.end < (new Date(9999, 12, 31)) &&
                    <Text style={styles.description}>
                        <Text style={styles.bold}> From: </Text>
                        { this.parseDate(this.state.activity.begin)}  
                        <Text style={styles.bold}> To: </Text>
                        { this.parseDate(this.state.activity.end)}
                    </Text>
                    }
                </Content>
                {!(this.state.activity.longitude == 0 && this.state.activity.latitude == 0) &&
                    <Button transparent onPress={_ => this.onMap()} >
                        <Text style={styles.map}>MAP</Text>
                    </Button>
                }
                <NavFooter navigation={this.props.navigation} tab={"Activity"} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    img: {
        width: '100%',
        height: 150,
        borderWidth: 2,
        marginBottom: '4%',
    },
    imgView: {
        height: '35%',
    },
    description: {
        marginTop: 5,
        marginLeft: 8,
        marginRight: 8,
    },
    description_title: {
        fontWeight: 'bold',
        marginTop: 5,
        marginLeft: 8,
        marginRight: 8,
    },
    bold: {
        fontWeight: 'bold'
    },
    type: {
        width: '60%',
        height: 50,
        marginHorizontal: '2%',
    },
    rating: {
        width: '30%',
        height: 50,
        marginHorizontal: '1%',
    },
    typeTxt: {
        fontSize: 18,
        color: 'black'
    },
    map: {
        marginLeft: '45%',
        fontWeight: 'bold',
    }
});