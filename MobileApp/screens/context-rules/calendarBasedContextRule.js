import React from 'react';
import {
    StyleSheet,  TouchableOpacity, Alert,  ScrollView 
} from 'react-native';
import {
     Text, Item, View, Input, CheckBox, Icon
} from 'native-base';

import DateTimePicker from 'react-native-modal-datetime-picker';

// DB
import * as Schemas from "../../realmSchemas/schema";


/**
 * CalendarBasedContextRule: displays the fields for creating a calendar-based context rule.
 * It is used by addContextRule.js and it has not the type field define here.
 */
export default class CalendarBasedContextRule extends React.Component{
    constructor(props){
        super(props);

        // Start values for days of week checkbox
        let daysOfWeek = [{key: "Monday", checked: false}, 
                    {key: "Tuesday",checked: false}, 
                    {key: "Wednesday", checked: false}, 
                    {key: "Thursday", checked: false}, 
                    {key: "Friday", checked: false}, 
                    {key: "Saturday", checked: false}, 
                    {key: "Sunday", checked: false}]

        this.state = {
            name: "",
            checkDays: daysOfWeek,
            selectedStartDate: '__/__/__',
            selectedEndDate: '__/__/__',
            formatStartDate: '',
            formatEndDate: '',
            visiblePickerStart: false,
            visblePickerEnd: false
        }
    }

    onChangeName(value){
        this.setState({
            name: value
        })
    }

    onPressCheckBox(item){
        console.log("onPressCheckBox");
        let days = this.state.checkDays;
        days[item].checked = !days[item].checked;

        this.setState({
            checkDays: days
        })
    }

    showPickerStart = () => {
        console.log("showPickerStart");
        this.setState({
            visiblePickerStart: true
        });
        console.log(this.state.visiblePickerStart);
    }
    
    showPickerEnd = () => {
        this.setState({
            visiblePickerEnd: true
        });
    }

    hidePickerStart = () => {
        this.setState({
            visiblePickerStart: false
        });
    }
    
    hidePickerEnd = () => {
        this.setState({
            visiblePickerEnd: false
        })
    }

    handlePickerStart = (date) => {
        this.hidePickerStart();
        console.log(date);
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        console.log(typeof(date));
        if (day<=9) day = '0' + day;
        if (month<=9) month = '0' + month;
        this.setState({
            formatStartDate: date,
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
    
    onPressSaveButton = () => {
        console.log("onPressSaveButton");
        
        let n = this.state.name;
        let startDate = this.state.selectedStartDate;
        let endDate = this.state.selectedEndDate;
        let daysOfWeek = this.state.checkDays;

        let n2 = n;

        let checked = daysOfWeek.some(element => element.checked);


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
        else if(startDate != "__/__/__" && this.state.formatStartDate >= this.state.formatEndDate){
            // EndTime is smaller or equal than StartTime
            Alert.alert("Warning","End Time must be greater than Start Time");
        }else{

            // Fields are ok
            let existByName = Schemas.existsByNameContextRule(n);
            if(existByName){
                // Check if exist a rule with that name
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
                Schemas.storeCalendarBasedContextRule(n,daysOfWeek, startDate, endDate);

                //CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Context_rules')}]);
            }
        }
        
    }

    renderWeekDay(i){
        return (
            <View style={styles.item}>
                <CheckBox style={{marginRight: '12%'}}checked={this.state.checkDays[i].checked} onPress={() => this.onPressCheckBox(i)}/>
                <Text style={[{fontSize: 18}]}>{this.state.checkDays[i].key}</Text>
            </View>
        )
    }

    render(){
        return(
            <View >
                <ScrollView>
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
                <Text style={[styles.txt]}>Select the days of the week you want:</Text>
                <Item style={{ marginLeft: '5%', marginRight: '5%'}}>
                    <View style={[styles.container]}>
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
                <Text style={[styles.txt, {marginRight:'5%'}]}>You can select a date range if you want (is optional). Press the "x" button to delete your selection.</Text>
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
                </ScrollView>
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
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: '5%'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10%'
    }
 });