import React from 'react';
import {
    StyleSheet, ScrollView
} from 'react-native';
import {
    Container, Picker, Text, Item, Form,
} from 'native-base';


// UI
import NavFooter from "../components/navFooter";

// Communication
import * as Communication from "../../em/fetch";

import LocationContextRule from './locationContextRule';
import TimeBasedContextRule from './timeBasedContextRule';
import CalendarBasedContextRule from './calendarBasedContextRule';
import WeatherContextRule from './weatherContextRule';
import ServerBasedContextRule from './serverBasedContextRule';


/**
 *  AddContextRuleScreen: defines the screen to add a context rule.
 *  Displays a picker to choose the type of context rule first, 
 *  and then displays the rest of the screen depending on the type selected.
 */
export default class AddContextRuleScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            type: "default",
            visiblePickerStart: false,
            visblePickerEnd: false,
            selectedStartTime: '__:__',
            selectedEndTime: '__:__',
        }
    }

    componentDidMount(){
        //this.storeData()

        this.state
    }

    static navigationOptions = {
        title: 'Define context rule',
    };

    onValueChange(value) {
        // UI
        this.setState({
            type: value
        });
    }

    showScreen(){
        if(this.state.type == "location"){
            return(
                <LocationContextRule navigation={this.props.navigation}/>
            )
        }else if(this.state.type == "time-based"){
            return(
                <TimeBasedContextRule navigation={this.props.navigation}/>
            )
        }else if(this.state.type == "calendar-based"){
            return(
                <CalendarBasedContextRule navigation={this.props.navigation}/>
            )
        }else if(this.state.type == "weather"){
            return(
                <WeatherContextRule navigation={this.props.navigation}/>
            )
        }else if(this.state.type == "server-based"){
            return(
                <ServerBasedContextRule navigation={this.props.navigation}/>
            )
        }
    }


    render() {
        return (
           <Container style = {styles.container}>
                <ScrollView>
                    <Text style={styles.txt}>Type:</Text>
                    <Form>
                        <Item underline style={styles.refresh}>
                            <Picker 
                                mode = 'dropdown'
                                selectedValue = {this.state.type}
                                onValueChange={this.onValueChange.bind(this)}>
                                <Item label="Pick one" value="default" />
                                <Item label="Calendar-Based Trigger" value="calendar-based" /> 
                                <Item label="Location Trigger" value="location" />
                                <Item label="Time-Based Trigger" value="time-based" />  
                                <Item label="Server-Based Trigger" value="server-based" />
                                <Item label="Weather Trigger" value="weather" />  
                            </Picker>
                        </Item>
                    </Form>
                    {this.showScreen()}
                </ScrollView>
                <NavFooter navigation={this.props.navigation} tab={"AddContextRule"} />
           </Container>
        );
     }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#fff'
    },
    txt: {
        marginTop: '5%',
        marginBottom: '3%',
        marginLeft: '6%',
        fontSize: 18,
        color: 'black'
    },
    refresh: {
        marginLeft: '6%',
        marginRight: '6%',
        justifyContent: 'flex-start',
    }
 });