const jsonContextArray = require('./contextv2.json');
const jsonContextRulesArray = require('./contextRulesv2.json');
const jsonExclusionSetsArray = require('./exclusionSets.json');
const jsonActivitiesArray = require('./activities.json');


export function getContextExamples(){
    console.log("getContextExamples");

    var data = jsonContextArray.contexts.map(function(item) {
        return item;
    });
    console.log("CONTEXT FIRST DATA: " + JSON.stringify(data[0]));
    return data;
}

export function getContextRulesExamples(){
    console.log("getContextRulesExamples");

    var data = jsonContextRulesArray.CR.map(function(item) {
        return item;
    });
    console.log("CONTEXT RULE FIRST DATA: " + JSON.stringify(data[0]));
    return data;
}

export function getExclusionSetsExamples(){
    console.log("getExclusionSetsExamples");

    var data = jsonExclusionSetsArray.ES.map(function(item) {
        return item;
    });
    console.log("CONTEXT EXCLUSION SET DATA: " + JSON.stringify(data[0]));
    return data;
}

export function getActivitiesExamples(){
    console.log("getActivitiesExamples");

    var data = jsonActivitiesArray.activities.map(function(item) {
        return item;
    });
    console.log("CONTEXT EXCLUSION SET DATA: " + JSON.stringify(data[0]));
    return data;
}