import React from 'react';
import {
    StyleSheet,  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import {
     Text, Item, View, Input,Container, CheckBox, Icon
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
export default class EditCalendarBasedContextRuleScreen extends React.Component{
    constructor(props){
        super(props);

        let days = this.loadDays();
        this.state = {
            contextRule: this.props.navigation.state.params.contextRule,
            name: this.props.navigation.state.params.contextRule.name,
            checkDays: days,
            selectedStartDate: this.props.navigation.state.params.contextRule.startDate,
            selectedEndDate: this.props.navigation.state.params.contextRule.endDate,
            edit: false,
            visiblePickerStart: false,
            visblePickerEnd: false
        }
    }

    // Transform realm data to javascript array (for editing array)
    loadDays(){
        let days = this.props.navigation.state.params.contextRule.daysOfWeek;
        days = days.map(element => ( {"key": element.key, "checked":element.checked}));
        return days;
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

    onPressCheckBox(item){
        let days = this.state.checkDays;
        days[item].checked = !days[item].checked;

        this.setState({
            checkDays: days
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

    handlePickerStart = (date) => {
        this.hidePickerStart();
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        if (day<=9) day = '0' + day;
        if (month<=9) month = '0' + month;
        this.setState({
            selectedStartDate:  day + '/' + month + '/' + year
        })
    }

    handlePickerEnd = (date) => {
        this.hidePickerEnd()
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        if (day<=9) day = '0' + day;
        if (month<=9) month = '0' + month;
        this.setState({
            formatEndDate: date,
            selectedEndDate: day + '/' + month + '/' + year
        })
    }

    onDeleteDate(type) {
        console.log("onDeleteDate");
        if(type == 'start'){
            console.log('start');
            this.setState({
                formatStartDate: '',
                selectedStartDate: "__/__/__"
            })
        }else{
            this.setState({
                formatEndDate: '',
                selectedEndDate: "__/__/__"
            })
        }
    }

    onPressEditButton = () => {
        this.setState({
            edit: true,
        })
    }


    onPressSaveButton = () => {
        let id= this.state.contextRule.id;
        let n = this.state.name;
        let startDate = this.state.selectedStartDate;
        let endDate = this.state.selectedEndDate;
        let daysOfWeek = this.state.checkDays;

        let n2 = n;

        let checked = daysOfWeek.some(element => element.checked);

        // To compare hours
        let d1 = startDate.split("/");
        let d2 = endDate.split("/");

        // String to number to compare hours
        d1[0] = Number(d1[0]);
        d1[1] = Number(d1[1]);
        d1[2] = Number(d1[2]);
        d2[0] = Number(d2[0]);
        d2[1] = Number(d2[1]);
        d2[2] = Number(d2[2]);

        let yearSmaller = d1[2] > d2[2];
        let monthSmaller = d1[2] == d2[2] && d1[1] > d2 [1];
        let daySmaller = d1[2] == d2[2] && d1[1] == d2 [1] && d1[0] >= d2[0];


        // Check if all fields are ok
        if(n == ""){
            // Some field is invalid
            Alert.alert("Warning","Name can't be empty");

        }else if(n.includes(" ")){
            // Name can't contain spaces
            Alert.alert("Warning","Name field can't contain spaces.");

        }
        else if(n2.replace(/[^0-9]/g,"").length == n.length){
            // Name must contain one letter
            Alert.alert("Warning", "Name field must contain at least one letter.")

        }else if(!(/[a-zA-Z]/).test(n[0])){
            // First character of name must be a letter (siddhi fail)
            Alert.alert("Warning", "First character of name field must be a letter.")

        }else if(!checked){
            // User has not selected any day of the week
            Alert.alert("Warning", "You must select at least one day of the week.")

        }else if((startDate == "__/__/__" && endDate != "__/__/__") || (endDate == "__/__/__" && startDate!="__/__/__")){
            // User has to select two dates or none
            Alert.alert("Warning", "If you select dates, you must select both the start date and the end date.")
        }
        else if(yearSmaller || monthSmaller || daySmaller){
            // EndTDate is smaller or equal than StartDate
            Alert.alert("Warning","End Time must be greater than Start Time");
        }else{

            // Fields are ok
            let existByName = Schemas.existsByNameContextRuleAndId(id,n);
            if(existByName){
                // Check if exist a rule with that name
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
                Schemas.updateCalendarBasedContextRule(id,n,daysOfWeek, startDate, endDate);

                CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule updated');
                this.setState({
                    edit: false,
                });
            }
        }
    }

    renderWeekDay(i){
        return (
            <View style={styles.item}>
                <CheckBox style={{marginRight: '12%'}} disabled={!this.state.edit}
                    checked={this.state.checkDays[i].checked} onPress={() => this.onPressCheckBox(i)}/>
                <Text style={{fontSize: 18}}>{this.state.checkDays[i].key}</Text>
            </View>
        )
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

                    <Text style={[styles.txt]}>Days of week selected:</Text>
                    <Item style={{ marginLeft: '5%', marginRight: '5%'}}>
                        <View style={[styles.containerDays]}>
                            <View style={{flex: 0.5}}>
                                {this.renderWeekDay(0)}
                                {this.renderWeekDay(1)}
                                {this.renderWeekDay(2)}
                                {this.renderWeekDay(3)}
                            </View>
                            <View style={{flex: 0.5}}>
                                {this.renderWeekDay(4)}
                                {this.renderWeekDay(5)}
                                {this.renderWeekDay(6)}
                            </View>
                        </View>       
                    </Item>

                    <Item underline style={[styles.refresh, { flex: 1, flexDirection: 'row' }]}> 
                        <Text style={[styles.txtTime, {flex: 0.4}]}>Start time:</Text>
                        <Item  style={ {flex: 0.59, marginBottom: 10}}>
                            <Input  style={{fontSize:18}}
                                    editable={false}
                                    textAlign='center'
                                    placeholderTextColor='dimgrey'
                                    placeholder={this.state.selectedStartDate}/>
                        </Item>
                    </Item>

                    <Item underline style={[styles.refresh, { flex: 1, flexDirection: 'row' }]}> 
                        <Text style={[styles.txtTime, {flex: 0.4}]}>End time:</Text>
                        <Item  style={ {flex: 0.59,marginBottom: 10}}>
                            <Input  style={{fontSize:18}}
                                    editable={false}
                                    textAlign='center'
                                    placeholderTextColor='dimgrey'
                                    placeholder={this.state.selectedEndDate}/>
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
                     <Text style={styles.txtUp}>You can edit the context-rule.</Text>
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
                    <Text style={[styles.txt]}>Select the days of the week you want:</Text>
                    <Item style={{ marginLeft: '5%', marginRight: '5%'}}>
                        <View style={[styles.containerDays]}>
                            <View style={{flex: 0.5}}>
                                    {this.renderWeekDay(0)}
                                    {this.renderWeekDay(1)}
                                    {this.renderWeekDay(2)}
                                    {this.renderWeekDay(3)}
                                </View>
                                <View style={{flex: 0.5}}>
                                    {this.renderWeekDay(4)}
                                    {this.renderWeekDay(5)}
                                    {this.renderWeekDay(6)}
                                </View>
                        </View>       
                    </Item>
                    <Text style={[styles.txt, {marginRight:'5%'}]}>You can select a date range if you want (is optional). Press de "x" button to delete your selection.</Text>
                    <View style={[styles.refresh, { flex: 1, flexDirection: 'row'}]}> 
                        <Text style={[styles.txtTime, {flex: 0.4, marginLeft: '2%'}]}>Start date:</Text>
                        <TouchableOpacity style= {{flex: 0.59}}
                            onPress={this.showPickerStart} >
                            <View style={styles.pickDate}>
                                <Text style={styles.pickDateText}>
                                    {this.state.selectedStartDate}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{marginLeft: '5%', marginRight:'2%', alignSelf: 'center'}}
                            onPress={() => this.onDeleteDate('start')}>
                            <Icon name='close-circle'></Icon>
                        </TouchableOpacity>
                    </View>
                    <Item>
                        <View style={[styles.refresh, { flex: 1, flexDirection: 'row'}]}> 
                            <Text style={[styles.txtTime, {flex: 0.4, marginLeft: '2%'}]}>End date:</Text>
                            <TouchableOpacity style= {{flex: 0.59}}
                                onPress={this.showPickerEnd} >
                                <View style={styles.pickDate}>
                                    <Text style={styles.pickDateText}>
                                        {this.state.selectedEndDate}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{marginLeft: '5%', marginRight:'2%', alignSelf: 'center'}}
                                onPress={() => this.onDeleteDate('end')}>
                                <Icon name='close-circle'></Icon>
                            </TouchableOpacity>
                        </View>
                    </Item>

                    <DateTimePicker
                        mode='date'
                        isVisible={this.state.visiblePickerStart}
                        onCancel={this.hidePickerStart}
                        onConfirm={this.handlePickerStart}/>
                    <DateTimePicker
                        mode='date'
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
    },
    containerDays: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: '5%',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10%'
    }
 });