import React from 'react';
import * as Communication from '../../em/fetch';

import {
    StyleSheet, Text, View,
    ListView, FlatList, Alert, TouchableOpacity
} from 'react-native';

import {
    SwipeRow,
    Button, Icon, Input, Item, Picker, Form, CheckBox
} from 'native-base';

// DB
import * as Schemas from "../../realmSchemas/schema";

import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp";

export default class TabListCRforTR extends React.Component {
    constructor(props) {
        super(props);

        // denyContextRules just for showing existing rules when editing/viewing
        this.state = {
            name: "",
            contextRules: [],
            typeOfRecommendation: "default",
            allContextRules: [],
            edit: false,
            denyContextRules: []
        }
        
    }

    componentDidMount(){
        console.log("componentDidMount");

        // Going to create a new triggering rule
        if(this.props.createScreen){
            this.addContextRuleRow(0);
            this.loadContextRulePickerData();
        }else{
            // Going to view or edit an existing triggering rule
            this.setState(
                {
                    name: this.props.navigation.state.params.triggeringRule.name,
                    typeOfRecommendation: this.props.navigation.state.params.triggeringRule.recommendationType
                }
            )
            this.loadContextRulePickerData();
            // Load rows with associated context rules
            this.showContextRuleRow();
        }
    }

    // Load all context rules items for picker options
    loadContextRulePickerData(){
        console.log("loadContextRulePickerData");
        let contextRules = Schemas.retrieveContextRules();

        // Default item
        let items = [<Item label="Pick one" value="default" key='-1'/>];

        if(contextRules != null){
            let pickerData = contextRules.map((value, index) => {
                return(
                    <Picker.Item color='black' label={value.name + ' #' + value.type} value={value.id} key={value.id.toString()}/>
                )
            });
            items = items.concat(pickerData);
        }
        
        this.setState({
            allContextRules: items
        });

        console.log("loadContextRulePickerData: state updated");
    }

    
    // Change triggering recommendation name
    onChangeName(value){
        this.setState({
            name: value
        })
    }

    
    // Add context rule row (checkbox + picker + remove button)
    addContextRuleRow = (i) => {
        console.log("addContextRuleRow");
        let contextRuleCopy = this.state.contextRules;
        
        // The new row will index = have maxIndex + 1
        let index = contextRuleCopy.length == 0 ? 0 : contextRuleCopy[i].index + 1;

        contextRuleCopy.push({
            'checked':false,
            'selection': "default",
            'index':index});

        this.setState({
            contextRules: contextRuleCopy
        });
    }


    // Load rows with associated context rules
    showContextRuleRow(){
        let contextRules = this.props.navigation.state.params.triggeringRule.contextRules;
        let denyRules = this.props.navigation.state.params.triggeringRule.denyContextRule;
        let contextRulesAux = [];
        let i = 0;
        contextRules.forEach((element) => {
            contextRulesAux.push({"index": i, "selection": element.id, "checked": denyRules[i]});
            i++;
        });

        this.setState({
            contextRules: contextRulesAux
        })
    }


    // Function to update contextRules when checkbox changes
    addCheckboxValues(index){

        let dataArray = this.state.contextRules;
        let checkBool = false;
        if (dataArray.length !== 0){
            dataArray.forEach(element => {
                // Check if exists
                if (element.index === index ){
                    element.checked = !element.checked;
                    checkBool = true;
                }
            });
        }
        // If exists, update -> ( It must exist always )
        if (checkBool){
            this.setState({
                contextRules: dataArray
            });
        }
    }


    // Function to update contextRules when picker changes 
    addContextRulePickerValues(index, selection) {
        let dataArray = this.state.contextRules;
        let checkBool = false;
        if (dataArray.length !== 0){
            // Check if exists
            dataArray.forEach(element => {
                if (element.index === index ){
                    element.selection = selection;
                    checkBool = true;
                }
            });
        }
        // If exists, update -> ( It must exist always )
        if (checkBool){
            this.setState({
                contextRules: dataArray
            });
        }
       
    }


    // Delete context rule row from triggering rule
    onDeleteContextRule(index) {
        let contextRulesCopy = this.state.contextRules;
        contextRulesCopy.splice(index, 1);
        this.setState({
            contextRules: contextRulesCopy
        });
    }


    // Type of recommendation picker
    onChangeTypeOfRecommendation(value) {
        // UI
        this.setState({
            typeOfRecommendation: value
        });
    }

    // On press edit button when we are in view triggering rule screen
    onPressEditButton = () => {
        console.log("Edit press");
        this.setState({
            edit: true,
        })
    }

    // On press save button for creating or updating
    onPressSaveButton = () => {

        let n = this.state.name;
        let contextRules = this.state.contextRules;
        let type = this.state.typeOfRecommendation;

        let n2 = n;

        let selection = contextRules.map((item) => item.selection);
        let unique = new Set(selection);
        
        if(n == "" || type == "default" || contextRules.length == 0){
            // Some field is invalid
            Alert.alert("Warning","All fields must be completed");
        }else if(n.includes(" ")){
            Alert.alert("Warning","Name field can't contain spaces.");
        }else if(n2.replace(/[^0-9]/g,"").length == n.length){
            Alert.alert("Warning", "Name field must contain at least one letter.")
        }else if(!(/[a-zA-Z]/).test(n[0])){
            Alert.alert("Warning", "First character of name field must be a letter.")
        }
        else if(contextRules.length < 2){
            Alert.alert("Warning","You must select at least 2 context rules");
        }else if(contextRules.length != unique.size){
            Alert.alert("Warning", "Recommendation types selected can't be repeated.");
        }
        else{
                // Create new triggering rule
                if(this.props.createScreen){

                    let existByName = Schemas.existsByNameTriggeringRule(n);
                    if(existByName){
                        Alert.alert("Warning", "There is already a triggering rule with that name. You must choose another one.");
                    }else{
                        Schemas.storeTriggeringRule(n,this.state.contextRules,type);

                        CreateSiddhiApp.createSiddhiApp();

                        Alert.alert('Success!', 'Triggering rule saved', [{ text: "OK", 
                            onPress: () => this.props.navigation.navigate('Recommendation_triggering_rules')}]);
                    }
                }else{
                    // Update existing triggering rule
                    let id = this.props.navigation.state.params.triggeringRule.id;
                    let existByName = Schemas.existsByNameTriggeringRuleAndId(id,n);
                    if(existByName){
                        Alert.alert("Warning", "There is already a triggering rule with that name. You must choose another one.");
                    }else{
                        
                        Schemas.updateTriggeringRule(id,n,contextRules, type);

                        CreateSiddhiApp.createSiddhiApp();

                        Alert.alert('Success!','Triggering rule updated');
                        this.setState({
                            edit: false,
                        });
                    }
                }
            }
        }
    


    // Each context rule row from flatlist when you create a new triggering rule or you edit a existing one
    renderFlatListItem(item, index){
        return(
            <View style={{flex: 1, flexDirection : 'row', alignItems: 'center', justifyContent:'space-between'}}>
                <CheckBox 
                    checked = {item.checked}
                    onPress={() => this.addCheckboxValues(item.index)}></CheckBox>
                <Picker style={{marginLeft: '6%'}}
                    mode = 'dropdown'
                    selectedValue = {item.selection}
                    onValueChange={(value) => this.addContextRulePickerValues(item.index, value)}>
                    {this.state.allContextRules} 
                </Picker>
                <TouchableOpacity
                    style={{marginLeft: '3%', marginRight:'3%'}}
                    onPress={() => this.onDeleteContextRule(index)}>
                    <Icon name='remove-circle'></Icon>
                </TouchableOpacity>
            </View>
        )
    }

    // Each context rule row from flatlist when you view a triggering rule
    renderFlatListItemView(item){
        return(
            <View style={{flex: 1, flexDirection : 'row', alignItems: 'center', justifyContent:'space-between'}}>
                <CheckBox 
                    disabled={!this.state.edit}
                    checked = {item.checked}
                    onPress={() => this.addCheckboxValues(item.index)}></CheckBox>
                <Picker 
                    enabled={this.state.edit}
                    style={{marginLeft: '6%'}}
                    mode = 'dropdown'
                    selectedValue = {item.selection}
                    onValueChange={(value) => this.addContextRulePickerValues(item.index, value)}>
                    {this.state.allContextRules} 
                </Picker>
            </View>
        )
    }

    // Each context rule row from flatlist when you edit a triggering rule
    renderFlatListItemEdit(item, index){
        return(
            <View style={{flex: 1, flexDirection : 'row', alignItems: 'center', justifyContent:'space-between'}}>
                <CheckBox 
                    disabled={!this.state.edit}
                    checked = {item.checked}
                    onPress={() => this.addCheckboxValues(item.index)}></CheckBox>
                <Picker 
                    enabled={this.state.edit}
                    style={{marginLeft: '6%'}}
                    mode = 'dropdown'
                    selectedValue = {item.selection}
                    onValueChange={(value) => this.addContextRulePickerValues(item.index, value)}>
                    {this.state.allContextRules} 
                </Picker>
                <TouchableOpacity
                    style={{marginLeft: '3%', marginRight:'3%'}}
                    onPress={() => this.onDeleteContextRule(index)}>
                        <Icon name='remove-circle'></Icon>
                </TouchableOpacity>
            </View>
        )
    }


    // Create or Edit Screen
    createOrEdit() {
        return (
            <FlatList style={{marginLeft: '6%', marginRight: '6%'}}
                ListHeaderComponent ={
                    <View>
                        <Text style={styles.txt}>Name: </Text>
                        <Item underline style={styles.general}>
                            {this.state.name == "" ? 
                                <Input placeholder="Insert name"
                                    maxLength={30}
                                    onChangeText={this.onChangeName.bind(this)} />
                                :
                                <Input value={this.state.name}
                                    maxLength={30}
                                    onChangeText={this.onChangeName.bind(this)} />}
                        </Item>
                        <Text style={styles.description}>
                            Add the context rules that must be satisfied. Check the box on the left if you want to deny the rule. </Text>
                        <View style={{flex: 1, flexDirection : 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, color: 'black'}}>Not</Text>
                            <Text style={{fontSize: 18, color: 'black', marginLeft: '5%'}}>Context rules</Text>
                        </View>
                    </View>   
                }
                data={this.state.contextRules}
                extraData={this.state}
                keyExtractor={(item) => item.index.toString()}
                renderItem={({ item, index }) => {
                        return(this.renderFlatListItem(item, index));
                    }  
                }
                ListFooterComponent={
                    <View>
                        <Item style={styles.button}>
                            <TouchableOpacity 
                                onPress={() => this.addContextRuleRow(this.state.contextRules.length - 1)} 
                                style={styles.fab}>
                                    <Text style={styles.fabIcon}>+</Text>
                            </TouchableOpacity>
                        </Item>
                        <View>
                            <Text style={styles.txt}>Type of recommendation:</Text>
                                <Item underline style={styles.general}>
                                    <Picker 
                                        mode = 'dropdown'
                                        selectedValue = {this.state.typeOfRecommendation}
                                        onValueChange={this.onChangeTypeOfRecommendation.bind(this)}>
                                        <Item label="Pick one" value="default" />
                                        <Item label="Restaurants" value="restaurants" />
                                        <Item label="Shops" value="shops" /> 
                                        <Item label="Museums" value="museums" /> 
                                        <Item label="Places of interest" value="placesOfInterest" />
                                        <Item label="Accommodation" value="accommodation" /> 
                                        <Item label="ShowsHalls" value="showsHalls" /> 
                                        <Item label="EntertainmentEstablishments" value="entertainmentEstablishments" />   
                                        <Item label="Leisure" value="leisure" />  
                                        <Item label="ChangeRoom" value="changeRoom" />  
                                    </Picker>
                                </Item>
                        </View>
                        <View style={[styles.general, {alignSelf:'flex-end'}]}>
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
                }
            />
        );
    }


    // View Screen
    view() {
        return (
            <FlatList style={{marginLeft: '6%', marginRight: '6%'}}
                ListHeaderComponent ={
                    <View>
                        <Text style={styles.txt}>Name: </Text>
                        <Item underline style={styles.general}>
                                <Input editable={false}
                                    placeholder={this.state.name}
                                    placeholderTextColor='dimgrey'
                                    maxLength={30}
                                    onChangeText={this.onChangeName.bind(this)} />
                        </Item>
                        <Text style={styles.description}>
                            List of context rules that must be satisfied. Rule is denied if the box on the left is checked. </Text>
                        <View style={{flex: 1, flexDirection : 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, color: 'black'}}>Not</Text>
                            <Text style={{fontSize: 18, color: 'black', marginLeft: '5%'}}>Context rules</Text>
                        </View>
                    </View>   
                }
                data={this.state.contextRules}
                extraData={this.state}
                keyExtractor={(item) => item.index.toString()}
                renderItem={({ item }) => {
                        return(this.renderFlatListItemView(item));
                    }  
                }
                ListFooterComponent={
                    <View>
                        <View>
                            <Text style={styles.txt}>Type of recommendation:</Text>
                                <Item underline style={styles.general}>
                                    <Picker 
                                        enabled={false}
                                        mode = 'dropdown'
                                        selectedValue = {this.state.typeOfRecommendation}
                                        onValueChange={this.onChangeTypeOfRecommendation.bind(this)}>
                                        <Item color='black' label="Pick one" value="default" />
                                        <Item color='black' label="Restaurants" value="restaurants" />
                                        <Item color='black' label="Shops" value="shops" /> 
                                        <Item color='black' label="Museums" value="museum" /> 
                                        <Item color='black' label="Places of interest" value="placesOfInterest" />  
                                        <Item label="Accommodation" value="accommodation" /> 
                                        <Item label="ShowsHalls" value="showsHalls" />
                                        <Item color='black' label="EntertainmentEstablishments" value="entertainmentEstablishments" />   
                                        <Item color='black' label="Leisure" value="leisure" />    
                                    </Picker>
                                </Item>
                        </View>
                        <View style={[styles.general, {alignSelf:'flex-end'}]}>
                            <TouchableOpacity 
                                onPress={this.onPressEditButton} >
                                <View style={styles.save}>
                                    <Text style={styles.saveText}>
                                        Edit
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />
        );
    }

    
    // render
    render(){
        if(this.props.createScreen){
            // Create
            return this.createOrEdit();
        }else{
            if(this.state.edit){
                // Edit
                return this.createOrEdit();
            }else{
                // View
                return this.view();
            }
        }
    }
}



const styles = StyleSheet.create({
    italic: {
        fontStyle: 'italic'
    },
    bold: {
        fontWeight: 'bold'
    },
    fab: {
        marginTop: '6%',
        marginBottom: '6%',
        width: 56,
        height: 56,
        alignItems: 'center',
        backgroundColor: '#03A9F4',
        borderRadius: 30,
        elevation: 2
    },
    fabIcon: {
        fontSize: 40,
        color: 'white'
    },
    textInput: {
        height: 40,
        borderColor: 'black', 
        borderWidth: 1,
        margin: 20
    },
    txt: {
        marginTop: '5%',
        marginBottom: '3%',
        fontSize: 18,
        color: 'black'
    },
    general: {
        justifyContent: 'flex-start',
    },
    button: {
        justifyContent: 'flex-end',
    },
    description: {
        marginTop: '7%',
        fontSize: 16,
        marginBottom: '7%'
    },
    save: {
        marginTop: 25,
        marginBottom: 25,
        width: 100,
        height: 40,
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

module.exports = TabListCRforTR;