import React from 'react';
import {
    StyleSheet, Text
} from 'react-native';
import {
    Button, Icon,
    Footer, FooterTab
} from 'native-base';

class TopSpace extends React.Component {

    render() {
        return (
            <Text style={styles.header}></Text>
        );
    }

}

const styles = StyleSheet.create({

    header: {
        height: '3%',
        backgroundColor: '#002984',     // Dark
    }

});

export default TopSpace