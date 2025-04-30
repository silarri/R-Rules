import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, ListItem, Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import * as Schemas from "../../realmSchemas/schema"; 


// Drawer navigation options
const options = [
    {key: "Home", icon: "home"}, 
    {key: "Profile", icon: "person"}, 
    {key: "Settings", icon: "settings"},
    {key: "Recommendation triggering rules"},
    {key: "Recommendation exclusions and priorities"},
    {key: "Context rules"},
];

const optionsNotLogin = [ { key: "You must be logged in", icon: "sad"} ];

export default class CustomDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            screen: null,
            isLogin: false
        }
    }

    
    componentWillReceiveProps(){
        console.log("CustomDrawer componentDidMOunt")
        let user = Schemas.retrieveUser();
        if (user != null) {
          this.setState({ isLogin: true });
        }

        let routes = this.props.navigation.state.routes[0].routes;
        let route = routes[routes.length - 1].routeName;
        if (route !== this.state.screen) {
            // Avoid updating state when not necessary
            this.setState({
                screen: routes[routes.length - 1].routeName,
            });
        }
    }

    oPressSection(item) {
        // Parse the item in case its key has spaces
        if(item == options[3].key || item == options[4].key || options[5].key){
            // Replace all spaces ("match globally" expression )
            item = item.replace(/ /g, "_");
        }

        const navigateAction = NavigationActions.navigate({
            routeName: item
        });
        this.props.navigation.dispatch(navigateAction);
    }

    render() {
        // TODO: Login disabled
        return (
            this.state.isLogin ? options.map((item) => {
                if (item.key == this.state.screen) {
                    return(
                        <View key={item.key} >
                            <ListItem>
                                <Icon name={item.icon} style={styles.iconSelected}/>
                                <Text onPress={() => this.oPressSection(item.key)} >{ item.key }</Text>
                            </ListItem>
                        </View>
                    );
                } else {
                    return(
                        <View key={item.key} >
                            <ListItem>
                                <Icon name={item.icon} style={styles.icon}/>
                                <Text onPress={() => this.oPressSection(item.key)} >{ item.key }</Text> 
                            </ListItem>
                        </View>
                    );
                }
            }) : optionsNotLogin.map((item) => {
                return(
                    <View key={item.key} >
                        <ListItem>
                            <Icon name={item.icon} style={styles.iconSelected}/>
                            <Text >{ item.key }</Text> 
                        </ListItem>
                    </View>
                );
            })
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 20,
        paddingRight: 5,
        color: '#808080',
    },
    iconSelected: {
        fontSize: 20,
        paddingRight: 5,
    }
});
