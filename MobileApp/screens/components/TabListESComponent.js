import React from 'react';
import * as Communication from '../../em/fetch';

import { withNavigationFocus ,NavigationActions } from 'react-navigation';

import {
    StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, 
} from 'react-native';

import {
    SwipeRow,
    Button, Icon, Input, Item, Picker
} from 'native-base';

// DB
import * as Schemas from "../../realmSchemas/schema";

export default class TabListESComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name : "",
            recommendationTypes : ["Restaurants","Shops", "Museums", "Places Of Interest", "Accommodation", "ShowsHalls", "EntertainmentEstablishments", "Leisure"],
            recommendationTypesPicker : [],
            recommendationTypesSelected : [],
            edit: false
        }
    }

    componentDidMount(){
        console.log("componentDidMount");
        // Add first row
        if(this.props.createScreen){
            this.addRecommendationTypeRow(0);
            this.showrecommendationTypePickerData();
        }else{
            this.setState({
                name: this.props.navigation.state.params.exclusionSet.name,
            });
            this.showrecommendationTypePickerData();
            this.showExistingRecommendationTypesRows();
        }
    }
    
    onChangeName(name){
        console.log("onChangeName");
        this.setState({
            name: name
        });
    }

    addRecommendationTypeRow(i){
        console.log("addTriggeringRuleRow");
        let copyRecommendationTypeSelected = this.state.recommendationTypesSelected;
        let index = copyRecommendationTypeSelected.length == 0 ? i : copyRecommendationTypeSelected[i].index + 1;

        copyRecommendationTypeSelected.push({"index":index, "selection": "default"});

        this.setState({
            recommendationTypesSelected: copyRecommendationTypeSelected
        })
    }


    showExistingRecommendationTypesRows(){
        console.log("showExistingRecommendationTypesRows");
        let recommendationTypes = this.props.navigation.state.params.exclusionSet.recommendationType;

        let recommendationTypesArray = [];
        let i = 0;
        recommendationTypes.forEach((element) => {
            recommendationTypesArray.push({"index":i, "selection": element})
            i++;
        });


        this.setState({
            recommendationTypesSelected: recommendationTypesArray
        });
    }


    // Function to update contextRules when picker changes 
    addRecommendationTypePickerValues(index, selection) {
        let dataArray = this.state.recommendationTypesSelected;
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
                recommendationTypesSelected: dataArray
            });
        }
    }

    showrecommendationTypePickerData(){
        // Default item
        let recommendationTypes = this.state.recommendationTypes;
        let items = [<Item label="Pick one" value="default" key='-1'/>];

        if(recommendationTypes != null){
            let pickerData = recommendationTypes.map((value, index) => {
                return(
                    <Picker.Item color='black' label={value} value={value} key={value}/>
                )
            });
            items = items.concat(pickerData);
        }
        
        this.setState({
            recommendationTypesPicker: items
        });

        console.log("loadContextRulePickerData: state updated");
    }


    onDeleteRecommendationTypeRow(index){
        console.log("onDeleteRecommendationTypeRow");
        let recommendationTypes = this.state.recommendationTypesSelected;
        recommendationTypes.splice(index,1);

        this.setState(
            { recommendationTypesSelected : recommendationTypes}
        );

    }

    // On press edit button when we are in view triggering rule screen
    onPressEditButton = () => {
        console.log("Edit press");
        this.setState({
            edit: true,
        })
    }

    onPressSaveButton(){
        console.log("onPressSaveButton");
        // On press save button for creating or updating
        n = this.state.name;
        typeOfRecommendation = this.state.recommendationTypesSelected;

        let defaultItem = (element) => element.selection == "default"; 
        let selection = typeOfRecommendation.map((item) => item.selection);
        let unique = new Set(selection);
        console.log("unique");

        if(n == "" || typeOfRecommendation.length == 0 || typeOfRecommendation.some(defaultItem)){
            // Some field is invalid
            Alert.alert("Warning","All fields must be completed");
        }else if(typeOfRecommendation.length < 2){
            Alert.alert("Warning","You must select two or more recommendaion types.");
        }else if(unique.size != typeOfRecommendation.length){
            Alert.alert("Warning","Recommendation types selected can't be repeated.")
        }
        else{
            if(this.props.createScreen){
                // Create new triggering rule
                Schemas.storeExclusionSet(n,typeOfRecommendation);
                Alert.alert("Success!",'Exclusion set saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Recommendation_exclusions_and_priorities')}]);
            }else{
                let id = this.props.navigation.state.params.exclusionSet.id;
                let pos = this.props.navigation.state.params.exclusionSet.pos;
                Schemas.updateExclusionSet(id, n,pos,typeOfRecommendation);
                Alert.alert("Success!",'Exclusion set saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Recommendation_exclusions_and_priorities')}]);
            }
        }
    }


    renderTypeOfRecommendationItem(item,index){
        console.log("renderTypeOfRecommendationItem");
        return(
            <View style={{flex: 1, flexDirection : 'row', alignItems: 'center', justifyContent:'space-between'}}>
                <Picker 
                    mode = 'dropdown'
                    selectedValue = {item.selection}
                    onValueChange={(value) => this.addRecommendationTypePickerValues(item.index, value)}>
                    {this.state.recommendationTypesPicker} 
                </Picker>
                <TouchableOpacity
                    style={{marginLeft: '3%', marginRight:'3%'}}
                    onPress={() => this.onDeleteRecommendationTypeRow(index)}>
                <Icon name='remove-circle'></Icon>
                </TouchableOpacity>
            </View>
        );
    }

    renderTypeOfRecommendationItemView(item,index){
        console.log("renderTypeOfRecommendationItemView");
        return(
            <View style={{flex: 1, flexDirection : 'row', alignItems: 'center', justifyContent:'space-between'}}>
                <Picker 
                    enabled = {false}
                    mode = 'dropdown'
                    selectedValue = {item.selection}
                    onValueChange={(value) => this.addRecommendationTypePickerValues(item.index, value)}>
                    {this.state.recommendationTypesPicker} 
                </Picker>
            </View>
        );
    }


    createOrEdit() {
        return (
            <FlatList style={{marginLeft: '6%', marginRight: '6%'}}
                ListHeaderComponent = {
                    <View>
                        <Text style={styles.txt}>Name:</Text>
                        <Item underline style={styles.general}>
                            {this.state.name == "" ? 
                                <Input 
                                    placeholder="Insert name"
                                    maxLength={30}
                                    onChangeText={this.onChangeName.bind(this)} />
                                :
                                <Input 
                                    value={this.state.name}
                                    maxLength={30}
                                    onChangeText={this.onChangeName.bind(this)} />}
                        </Item>
                        <Text style={styles.description}>Add items pressing "+" button and select recommendation types from highest to lowest priority.</Text>
                    </View>
                }
                data={this.state.recommendationTypesSelected}
                extraData={this.state}
                keyExtractor={item => item.index.toString()}
                renderItem={({ item, index }) => {
                    return(this.renderTypeOfRecommendationItem(item, index))}
                }

                ListFooterComponent = {
                    <View>
                        <Item style={styles.button}>
                            <TouchableOpacity 
                                onPress={() => this.addRecommendationTypeRow(this.state.recommendationTypesSelected.length - 1)}
                                style={styles.fab}>
                                    <Text style={styles.fabIcon}>+</Text>
                            </TouchableOpacity>
                        </Item>
                        <View style={[styles.general, {alignSelf:'flex-end'}]}>
                            <TouchableOpacity 
                                onPress={() =>this.onPressSaveButton()} >
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

    view() {
        return (
            <FlatList style={{marginLeft: '6%', marginRight: '6%'}}
                ListHeaderComponent = {
                    <View>
                        <Text style={styles.txt}>Name:</Text>
                        <Item underline style={styles.general}>
                            {this.state.name == "" ? 
                                <Input 
                                    editable={false}
                                    placeholder="Insert name"
                                    maxLength={30}
                                    onChangeText={this.onChangeName.bind(this)} />
                                :
                                <Input 
                                    editable={false}
                                    value={this.state.name}
                                    maxLength={30}
                                    onChangeText={this.onChangeName.bind(this)} />}
                        </Item>
                        <Text style={styles.description}>List of recommendation types ordered from highest to lowest priority.</Text>
                    </View>
                }
                data={this.state.recommendationTypesSelected}
                extraData={this.state}
                keyExtractor={item => item.index.toString()}
                renderItem={({ item, index }) => {
                    return(this.renderTypeOfRecommendationItemView(item, index))}
                }

                ListFooterComponent = {
                    <View>
                        <View style={[styles.general, {alignSelf:'flex-end'}]}>
                            <TouchableOpacity 
                                onPress={() =>this.onPressEditButton()} >
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

    render(){
        if(this.props.createScreen){
            return this.createOrEdit();
        }else{
            if(this.state.edit){
                return this.createOrEdit();
            }else{
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
    txt:{
        marginTop: '5%',
        marginBottom: '3%',
        fontSize: 18,
        color: 'black'
    },
    general: {
        justifyContent: 'flex-start',
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
    },
    general: {
        justifyContent: 'flex-start',
    },
    button: {
        justifyContent: 'flex-end',
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
});

module.exports = withNavigationFocus(TabListESComponent);