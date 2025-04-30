import * as Schemas from "../realmSchemas/schema";

export function getRecommendationsWithExclusionSets(recommendations){
    console.log("Recommendations: " + recommendations);
    // Get stored exclusionSets
    var exclusionSets = Schemas.retrieveExclusionSetsSortByPos();

    if(exclusionSets == null){
        // If there are not exclusion sets, we return all recommendations
        return recommendations;
    }else{
        let result = [];
        let notIncluded = [];
        let discarded = [];

        // We get the recommendation that has priority in each exclusion set and recommendations 
        // that are not included in any exclusion set and elements discarded in each exclusion set
        exclusionSets.forEach(set => {
            let exclusionSetResult = checkExclusionSet(set.recommendationType, recommendations, discarded);
            result.push(exclusionSetResult[0]);
            notIncluded = notIncluded.concat(exclusionSetResult[1]);
            discarded = discarded.concat(exclusionSetResult[2]);
        });
        console.log("Result: " + result);
        console.log("NotIncluded: " + notIncluded);
        console.log("Discarded: " + discarded);

        if(result.length == 0){
            // If any of the recommendations are in any exclusion set we return all recommendations
            return recommendations;
        }else{
            result = [...new Set(result)];
            if(notIncluded.length == 0){
                // If all recommendations are included in at least one exclusion set we return result
                return aux;
            }else{
                // If there are recommendations that are not included in exclusion sets we add to the result
                // We get the notIncluded elements that aren't discarded by any exclusion set
                let aux =  getNotIncluded(discarded, notIncluded);
                
                // We get the elements in aux that are not included in result 
                aux = getNotIncluded(result, aux);

                // We concat the result types with the calculated in aux
                return result.concat(aux);
            }
        }
    }
}


/** 
 * Returns the recommendation that has priority in the exclusion set, recommendations 
 * that are not included in the exclusion set and the recommendations that were discarded by exclusion set
*/
function checkExclusionSet(e, recommendations, discarded){
    console.log("checkExclusionSet: " + e);
    var result = "";
    var notIncluded = [];
    var eCopy = [];
    let found = false;
    for(var i = 0; i < e.length; i++){

        // We transform type recommendation with first letter lower case and without spaces
        // (easier to work with exclusion set later)
        let r = e[i].charAt(0).toLowerCase() + e[i].slice(1);
        r = r.replace(/\s/g, '');
        eCopy.push(r);

        if(recommendations.includes(r)){
            if(!found && !discarded.includes(r)){
                result = r;
                found = true;
            }else{
                discarded.push(r);
            }
        }
    }
    notIncluded = getNotIncluded(eCopy, recommendations);
    return [result, notIncluded, discarded];
}

/** 
 * Returns recommendations with priority and the not included in one array
*/
function getNotIncluded(result, notIncluded){
    console.log("getNotIncluded");
    let res = [];
    res = notIncluded.filter(function(e){ return result.indexOf(e) == -1});
    res = [...new Set(res)];
    return res;
}