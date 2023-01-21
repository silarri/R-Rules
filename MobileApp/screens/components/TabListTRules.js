import React from 'react';
import * as Communication from '../../em/fetch';

import {
    StyleSheet, FlatList
} from 'react-native';


import { withNavigationFocus, NavigationActions } from 'react-navigation';

import TabTRElement from './TabTRElement';

// DB
import * as Schemas from "../../realmSchemas/schema";



export default class TabListTRules extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            triggeringRules: [],
            update: false
        }
    }

    componentDidMount(){
        console.log("componentDidMOunt");
        this.loadData();
    }
  
    
    componentDidUpdate(prevProps) {
       console.log("componentDidUpdate");
     if (prevProps.isFocused !== this.props.isFocused || this.state.update ) {
        this.setState({update: false});
       // Use the `this.props.isFocused` boolean
       // Call any action
       console.log("Im in");
       this.loadData();
     }
   }

   loadData() {
        // Retrive Triggering Rules Stored
        console.log("Load data");

        let triggeringRules = Schemas.retrieveTriggeringRules();

    
        
        this.setState({
        triggeringRules: triggeringRules
        })
    }
    

    render() {
        return (
            <FlatList
                data={this.state.triggeringRules}
                extraData={this.state}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {
                        return(
                            <TabTRElement navigation={this.props.navigation} data={item}/>
                        )
                    }
                }
            />
        );
    }
}


module.exports = withNavigationFocus(TabListTRules);