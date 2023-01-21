import React from 'react';
import {
    StyleSheet,  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import {
     Text, Item, View, Input,Container
} from 'native-base';


import DateTimePicker from 'react-native-modal-datetime-picker';

import NavFooter from "../components/navFooter";

// DB
import * as Schemas from "../../realmSchemas/schema";
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp";


/**
 * EditTimeBasedContextRuleScreen: allows you to view or edit the information in a time-based 
 * context rule.
 * First you view the information. If you want to edit the rule, you can press the edit button.
 */
export default class EditTimeBasedContextRuleScreen extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            contextRule: this.props.navigation.state.params.contextRule,
            name: this.props.navigation.state.params.contextRule.name,
            startTime: this.props.navigation.state.params.contextRule.startTime,
            endTime: this.props.navigation.state.params.contextRule.endTime,
            edit: false,
            visiblePickerStart:  false,
            visiblePickerEnd: false, 
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.contextRule.name,
        };
    };

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
        this.hidePickerStart()
        console.log('Time: ' + time);
        hours = time.getHours();
        minutes = time.getMinutes();
        if (hours<=9) hours = '0' + hours;
        if (minutes<=9) minutes = '0' + minutes;
        this.setState({
            startTime: hours + ':' + minutes
        })
    }

    handlePickerEnd = (time) => {
        this.hidePickerEnd()
        console.log('Time: ' + time);
        hours = time.getHours();
        minutes = time.getMinutes();
        if (hours<=9) hours = '0' + hours;
        if (minutes<=9) minutes = '0' + minutes;
        this.setState({
            endTime: hours + ':' + minutes
        })
    }

    onPressEditButton = () => {
        console.log("Edit press");
        this.setState({
            edit: true,
        })
    }

    onPressSaveButton = () => {
        let id= this.state.contextRule.id;
        let n = this.state.name;
        let startTime = this.state.startTime;
        let endTime = this.state.endTime;

        // To compare hours
        t1 = startTime.split(":");
        t2 = endTime.split(":");

        // String to number to compare hours
        t1[0] = Number(t1[0]);
        t1[1] = Number(t1[1]);
        t2[0] = Number(t2[0]);
        t2[1] = Number(t2[1]);
        
        let n2 = n;

        if(n == ""){
            // Some field is invalid
            Alert.alert("Warning", "All fields must be completed");
        }else if(n.includes(" ")){
            Alert.alert("Warning","Name field can't contain spaces.");
        }
        else if(n2.replace(/[^0-9]/g,"").length == n.length){
            Alert.alert("Warning", "Name field must contain at least one letter.")
        }else if(!(/[a-zA-Z]/).test(n[0])){
            Alert.alert("Warning", "First character of name field must be a letter.")
        }
        else if(t1[0] > t2[0] || (t1[0] == t2[0] && t1[1] > t2[1])){
            // EndTime is smaller or equal than StartTime
            Alert.alert("Warning","End Time must be greater than Start Time");
        }else{
            // Check if already exists a context rule with that name
            let existByName = Schemas.existsByNameContextRuleAndId(id,n);
            if(existByName){
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
            
                Schemas.updateTimeBasedContextRule(id,n,startTime,endTime);

                CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule updated');
                this.setState({
                    edit: false,
                });
            }
        }
    }

    // View context rule info
    viewScreen(){
        return(
            <Container style={styles.container}>
                 <ScrollView>
                    <Text style={styles.txtUp}>You are viewing the information of the context rule. </Text>
                    <Text style={styles.txt}>Type:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={false}
                                placeholderTextColor='dimgrey'
                                placeholder={this.state.contextRule.type}/>
                    </Item>
                    <Text style={styles.txt}>Name:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={false}
                                placeholderTextColor='dimgrey'
                                placeholder={this.state.name}/>
                    </Item>

                    <Item underline style={[styles.refresh, { flex: 1, flexDirection: 'row' }]}> 
                        <Text style={[styles.txtTime, {flex: 0.4}]}>Start time:</Text>
                        <Item underline style={{flex: 0.59, marginBottom: 10}}>
                            <Input style={{fontSize:18}}
                                    editable={false}
                                    textAlign='center'
                                    placeholderTextColor='dimgrey'
                                    placeholder={this.state.startTime}/>
                        </Item>
                    </Item>

                    <Item underline style={[styles.refresh, { flex: 1, flexDirection: 'row' }]}> 
                        <Text style={[styles.txtTime, {flex: 0.4}]}>End time:</Text>
                        <Item underline style={{flex: 0.59,marginBottom: 10}}>
                            <Input style={{fontSize:18}}
                                    editable={false}
                                    textAlign='center'
                                    placeholderTextColor='dimgrey'
                                    placeholder={this.state.endTime}/>
                        </Item>
                    </Item>

                    <View style={[styles.refresh, {alignSelf:'flex-end'}]}>
                        <TouchableOpacity 
                            onPress={this.onPressEditButton} >
                            <View style={styles.save}>
                                <Text style={styles.saveText}>
                                    Edit
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <NavFooter navigation={this.props.navigation} tab={"AddContextRule"} />
           </Container>
        )
    }

    // Edit context rule info
    editScreen(){
        return(
            <Container style={styles.container}>
                 <ScrollView>
                    <Text style={styles.txt}>Type:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={false}
                                placeholderTextColor='#000000'
                                placeholder={this.state.contextRule.type}
                                onChangeText={this.onChangeName.bind(this)} />
                    </Item>
                    <Text style={styles.txt}>Name:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={true}
                                maxLength={30}
                                value={this.state.name}
                                onChangeText={this.onChangeName.bind(this)} />
                    </Item>

                    <Item underline style={[styles.refresh, { flex: 1, flexDirection: 'row' }]}> 
                        <Text style={[styles.txtTime, {flex: 0.4}]}>Start time:</Text>
                        <TouchableOpacity style= {{flex: 0.59}}
                            onPress={this.showPickerStart} >
                            <View style={styles.pickDate}>
                                <Text style={styles.pickDateText}>
                                    {this.state.startTime}
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
                                    {this.state.endTime}
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

                    <View style={[styles.refresh, {alignSelf:'flex-end'}]}>
                        <TouchableOpacity 
                            onPress={this.onPressSaveButton} >
                            <View style={styles.save}>
                                <Text style={styles.saveText}>
                                    Save
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <NavFooter navigation={this.props.navigation} tab={"AddContextRule"} />
           </Container>
        )
    }

    render(){
        return(
            !this.state.edit ? this.viewScreen()
            : this.editScreen()
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    txtUp: {
        marginTop: '2%',
        marginHorizontal: '6%',
        fontSize: 16,
        color: 'dimgrey'
    },
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