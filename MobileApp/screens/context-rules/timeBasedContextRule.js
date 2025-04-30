import React from 'react';
import {
    StyleSheet,  TouchableOpacity, Alert
} from 'react-native';
import {
     Text, Item, View, Input
} from 'native-base';

import { NavigationActions } from 'react-navigation';

import DateTimePicker from 'react-native-modal-datetime-picker';

// DB
import * as Schemas from "../../realmSchemas/schema";

/**
 * TimeBasedContextRule: displays the fields for creating a time-based context rule.
 * It is used by addContextRule.js and it has not the type field define here.
 */
export default class TimeBasedContextRule extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: "",
            selectedStartTime: '__:__',
            selectedEndTime: '__:__',
            formatStartTime: '',
            formatEndTime: '',
            visiblePickerStart: false,
            visblePickerEnd: false
        }
    }

    onChangeName(value){
        this.setState({
            name: value
        })
    }

    showPickerStart = () => {
        this.setState({
            visiblePickerStart: true
        })
    }
    
    showPickerEnd = () => {
        this.setState({
            visiblePickerEnd: true
        })
    }

    hidePickerStart = () => {
        this.setState({
            visiblePickerStart: false
        })
    }
    
    hidePickerEnd = () => {
        this.setState({
            visiblePickerEnd: false
        })
    }

    handlePickerStart = (time) => {
        this.hidePickerStart();
        hours = time.getHours();
        minutes = time.getMinutes();
        if (hours<=9) hours = '0' + hours;
        if (minutes<=9) minutes = '0' + minutes;
        this.setState({
            formatStartTime: time,
            selectedStartTime: hours + ':' + minutes
        })
    }

    handlePickerEnd = (time) => {
        this.hidePickerEnd()
        hours = time.getHours();
        minutes = time.getMinutes();
        if (hours<=9) hours = '0' + hours;
        if (minutes<=9) minutes = '0' + minutes;
        this.setState({
            formatEndTime: time,
            selectedEndTime: hours + ':' + minutes
        })
    }

    onPressSaveButton = () => {
        n = this.state.name;
        startTime = this.state.selectedStartTime;
        endTime = this.state.selectedEndTime;

        // To compare hours
        t1 = startTime.split(":");
        t2 = endTime.split(":");

        // String to number to compare hours
        t1[0] = Number(t1[0]);
        t1[1] = Number(t1[1]);
        t2[0] = Number(t2[0]);
        t2[1] = Number(t2[1]);
        
        let n2 = n;

        if(n == "" || startTime == "__:__" || endTime == '__:__'){
            // Some field is invalid
            Alert.alert("Warning","All fields must be completed");
        }else if(n.includes(" ")){
            Alert.alert("Warning","Name field can't contain spaces.");
        }
        else if(n2.replace(/[^0-9]/g,"").length == n.length){
            Alert.alert("Warning", "Name field must contain at least one letter.")
        }else if(!(/[a-zA-Z]/).test(n[0])){
            Alert.alert("Warning", "First character of name field must be a letter.")
        }
        else if(this.state.formatStartTime >= this.state.formatEndTime){
            // EndTime is smaller or equal than StartTime
            Alert.alert("Warning","End Time must be greater than Start Time");
        }else{

            let existByName = Schemas.existsByNameContextRule(n);
            if(existByName){
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
                Schemas.storeTimeBasedContextRule(n, startTime, endTime);

                //CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Context_rules')}]);
            }
        }
    }

    render(){
        return(
            <View >
                <Text style={styles.txt}>Name:</Text>
                    <Item underline style={styles.refresh}>
                        {this.state.name == "" ? 
                            <Input  placeholder="Insert name"
                                maxLength={30}
                                onChangeText={this.onChangeName.bind(this)} />
                        :
                        <Input  value={this.state.name}
                                maxLength={30}
                                onChangeText={this.onChangeName.bind(this)} />}
                        
                    </Item>
                <Item underline style={[styles.refresh, { flex: 1, flexDirection: 'row' }]}> 
                    <Text style={[styles.txtTime, {flex: 0.4}]}>Start time:</Text>
                    <TouchableOpacity style= {{flex: 0.59}}
                        onPress={this.showPickerStart} >
                        <View style={styles.pickDate}>
                            <Text style={styles.pickDateText}>
                                {this.state.selectedStartTime}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Item>
                <Item underline style={[styles.refresh, { flex: 1, flexDirection: 'row' }]}> 
                    <Text style={[styles.txtTime, {flex: 0.4}]}>End time:</Text>
                    <TouchableOpacity style= {{flex: 0.59}}
                        onPress={this.showPickerEnd} >
                        <View style={styles.pickDate}>
                            <Text style={styles.pickDateText}>
                                {this.state.selectedEndTime}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Item>
                <DateTimePicker
                    mode='time'
                    isVisible={this.state.visiblePickerStart}
                    onCancel={this.hidePickerStart}
                    onConfirm={this.handlePickerStart}/>
                <DateTimePicker
                    mode='time'
                    isVisible={this.state.visiblePickerEnd}
                    onCancel={this.hidePickerEnd}
                    onConfirm={this.handlePickerEnd}/>
                <View
                    style={[styles.refresh, {alignSelf:'flex-end'}]}>
                    <TouchableOpacity 
                        onPress={this.onPressSaveButton} >
                        <View style={styles.save}>
                            <Text style={styles.saveText}>
                                Save
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    txt: {
        marginTop: '5%',
        marginBottom: '3%',
        marginLeft: '6%',
        fontSize: 18,
        color: 'black'
    },
    txtTime: {
        marginTop: '5%',
        marginBottom: '5%',
        fontSize: 18,
        color: 'black'
    },
    refresh: {
        marginLeft: '6%',
        marginRight: '6%',
        justifyContent: 'flex-start',
    },
    refreshButton: {
        marginLeft: '10%',
        marginRight: '6%',
        justifyContent: 'flex-end',
    },
    pickDate: {
        marginTop: 15,
        marginBottom: 15,
        paddingTop: 7,
        paddingBottom: 7,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d3d3d3'
    },
    pickDateText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 18
    },
    save: {
        marginTop: 25,
        marginBottom: 25,
        width: 100,
        height: 40,
        marginRight: '6%',
        marginBottom: '10%',
        backgroundColor: '#03A9F4',
        elevation: 8,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    saveText: {
        fontSize: 18,
        color: 'white'
    }
 });