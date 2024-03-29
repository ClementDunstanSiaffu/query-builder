import { JimuMapView } from "jimu-arcgis"

type layerContentsObjectType = {
    id:string,
    attributes:any[]
}

type selectedLayerType = {
    id:string,
    attributes:any[]
}

class Helper {

    setQueryArray = [];
    setOutFields = [];

    getLayerAttributes = (selectedLayerId:string,layerContents:layerContentsObjectType[]):any[]=>{
        let attributes = [];
        if (layerContents?.length > 0){
            const attributesObject = layerContents.find((layerContent:layerContentsObjectType)=>{
                if (layerContent?.id === selectedLayerId){
                    return layerContent?.attributes;
                }
            })
            attributes = attributesObject?.attributes;
        }
    
        return attributes;
    }

    getAttributeKeyArray = (attributes:any):string[]=>{
        let returnedKeys = [];
        if (attributes && Object.keys(attributes).length > 0){
            returnedKeys = Object.keys(attributes);
        }
        return returnedKeys;
    }

    getSelectedContentsLayer =(results:any,checkedLayers:string[]):selectedLayerType[]=>{//step5 from selected items get their layers
        let selectedLayersArray = [];
        if (results?.length > 0){
            selectedLayersArray = results.reduce((newArray,items:any[])=>{
                if (items?.length > 0){
                    let selectedLayerContents = {};
                    let currentLayerId = items[0]?.layer?.id;
                    if (checkedLayers.indexOf(currentLayerId) !== -1){
                        selectedLayerContents["id"] = items[0]?.layer?.id;
                        selectedLayerContents["attributes"] = this.getAttributes(items);//step6 packaging attributes and keeping lon and latit
                        newArray.push(selectedLayerContents)
                    }
                }
                return newArray;
            },[])
        }
        return selectedLayersArray;
    }

    getAttributes = (items:any[]):any[]=>{
        const attributesArray = items.reduce((newArray,item)=>{
            if (item?.attributes){
                if (item.geometry){
                    const geometry = item.geometry;
                    const latitude = geometry?.latitude??geometry?.extent?.center?.latitude;
                    const longitude = geometry?.longitude??geometry?.extent?.center?.longitude;
                    if (longitude && latitude){
                        newArray.push({...item.attributes,location:[latitude,longitude]});
                    }else{
                        newArray.push(item.attributes);
                    }       
                }else{
                    newArray.push(item.attributes);
                }
               
            }
            return newArray;
        },[])
        return attributesArray;
    }

    getNumberOfAttributes = (layersContents:{id:string,attributes:any[]}[])=>{
        let layerContentsObject = {};
        for (let i=0;i < layersContents.length;i++){
             layerContentsObject = {...layerContentsObject,[layersContents[i]?.id]:layersContents[i]?.attributes?.length??0}
        }
        return layerContentsObject;
    }
 
    getClickedLayerStatus = (results:any[],selectedLayer:selectedLayerType[]):boolean=>{
        let status = false;
        let index = -1;
        if (results?.length > 0 && selectedLayer?.length > 0){
            for (let i = 0;i < results.length;i++){
                let layerId = results[i]?.graphic?.layer?.id;
                index = selectedLayer.findIndex((item)=>item.id === layerId);
                if (index != -1){
                    return true;
                }
            }
        }
        return status;
    }

    checkIfLayerWasAdded = (layerId:string,mapLayersItems:any[])=>{
        let index = -1;
        let status = false;
        if (mapLayersItems?.length > 0){
            index = mapLayersItems.findIndex((item)=>item?.id === layerId);
            if (index !== -1){
                status = true;
            }
        }
        return status;
    }


    openTableAttribute = ()=>{
        const ariaExpandedElement = document.querySelector(".sidebar-controller");
        if (ariaExpandedElement.ariaExpanded === "false"){
            //@ts-ignore
            ariaExpandedElement.click();
        }
    }

    closeAttributeTable = ()=>{
        const ariaExpandedElement = document.querySelector(".sidebar-controller");
        if (ariaExpandedElement.ariaExpanded === "true"){
            //@ts-ignore
            ariaExpandedElement.click();
        }
    }

    getNumberOfItemsInField = (field:string,selectedAttributes:any[])=>{
        let numberOfItems = 0;
        if (selectedAttributes?.length > 0){
            let valueArr = [];
            for (let i=0;i< selectedAttributes.length;i++){
                valueArr.push(selectedAttributes[i][field]);
            }
            numberOfItems = valueArr.length;
        }
        return numberOfItems;
    }

    getHighlightedIds = (features:any[])=>{
        const highlightIds = [];
        if (features.length)features.forEach(el=>highlightIds.push(el.attributes.OBJECTID))
        return highlightIds;
    }

    likelyQuery = (attributeQuery,queryValue,value)=>{
        switch(queryValue){
            case "LIKE%":
                return `${attributeQuery} LIKE '%${value}'`;
            case "%LIKE%":
                return `${attributeQuery} LIKE '%${value}%'`;
            case "%LIKE":
                return `${attributeQuery} LIKE '%${value}'`;
            case "NOT LIKE":
                return `${attributeQuery} NOT LIKE '%${value}%'`;  
        }
    }


    querySetConstructor = (query:any,setWhereClause:any[],AndOrSet:any,field:string)=>{
        let currentQuery = query.where;
        // console.log(this.setQueryArray.length < setWhereClause.length-1,"checking")
        if (this.setQueryArray.length < setWhereClause.length-1){
            currentQuery = query.where +  " " + AndOrSet;
        }
        this.setQueryArray.push(currentQuery);
        this.setOutFields.push(`${field}`);
        // console.log(this.setQueryArray,this.setOutFields,"make sure")
        // if(this.setQueryArray.length >= setWhereClause.length){
        //     return {querySetArray:this.setQueryArray,querySetOutfields:this.setOutFields}
        // }
    }

    loopToGetString(stringArr: string[]) {
        let newString = " ";
        if (stringArr.length) {
          newString = JSON.stringify(stringArr[0]);
          newString = newString.replace(/"/g, `'`);
          for (let i = 1; i < stringArr.length; i++) {
            const newStringVal = JSON.stringify(stringArr[i]).replace(/"/g, `'`);
            newString += "," + newStringVal;
          }
        }
        return newString;
      }

    checkParenthesis(val: string) {
        let status = false;
        const brackets = ["(", ")", "[", "]", "{", "}"];
        if (brackets.includes(val.charAt(0))) {
          status = true;
        }
        return status;
    }

    containsAnyLetters = (str) => /[a-zA-Z]/.test(str);

    setQueryConstructor = (queryRequest, firstQuery, secondQueryTarget) => {
        switch (queryRequest) {
          case "LIKE%":
            return `${firstQuery} LIKE '${secondQueryTarget}%'`;
          case "%LIKE":
            return `${firstQuery} LIKE '%${secondQueryTarget}'`;
          case "%LIKE%":
            return `${firstQuery} LIKE '%${secondQueryTarget}%'`;
          case "NOT LIKE":
            return `${firstQuery} NOT LIKE '%${secondQueryTarget}%'`;
          case "is null":
            return `${firstQuery} is null`;
          case "is not null":
            return `${firstQuery} is not null`;
          case "IN":
            if (this.containsAnyLetters(secondQueryTarget)) {
              return `${firstQuery} IN (${
                "'" + secondQueryTarget.join("', '") + "'"
              })`;
            } else {
              if (this.checkParenthesis(secondQueryTarget.join(","))) {
                const stringFiedValue = this.loopToGetString(secondQueryTarget);
                return `${firstQuery} IN (${stringFiedValue})`;
              } else {
                return `${firstQuery} IN (${secondQueryTarget.join(",")})`;
              }
            }
          case "NOT_IN":
            if (this.containsAnyLetters(secondQueryTarget)) {
              return `NOT ${firstQuery} IN (${
                "'" + secondQueryTarget.join("', '") + "'"
              })`;
            } else {
              if (this.checkParenthesis(secondQueryTarget.join(","))) {
                const stringFiedValue = this.loopToGetString(secondQueryTarget);
                return `NOT  ${firstQuery} IN (${stringFiedValue})`;
              } else {
                return `NOT  ${firstQuery} IN (${secondQueryTarget.join(",")})`;
              }
            }
          case "included":
            return `(${firstQuery} > ${secondQueryTarget.firstTxt} AND ${firstQuery} < ${secondQueryTarget.secondTxt})`;
          case "is_not_included":
            return `(${firstQuery} < ${secondQueryTarget.firstTxt} OR ${firstQuery} > ${secondQueryTarget.secondTxt})`;
          default:
            if (this.containsAnyLetters(secondQueryTarget)) {
              return `${firstQuery} ${queryRequest} '${secondQueryTarget}'`;
            } else {
              let queryString = `${firstQuery} ${queryRequest} ${secondQueryTarget}`;
              const brackets = ["(", ")", "[", "]", "{", "}"];
              if (brackets.includes(secondQueryTarget.charAt(0))) {
                const stringFiedValue = JSON.stringify(secondQueryTarget).replace(/"/g, `'`)
                queryString= `${firstQuery} ${queryRequest} (${stringFiedValue})`;
              }else{
                queryString = `${firstQuery} ${queryRequest} '${secondQueryTarget}'`;
              }
              return queryString;
            }
        }
      };

    // tableSetCounts = (tableSetCounts:{id:string,deleted:boolean}[])=>{
    //     let counts = 0
    //     if (tableSetCounts.length){
    //       const copiedTableSetCounts = [...tableSetCounts];
    //       copiedTableSetCounts.filter((item)=>!item.deleted);
    //       counts = copiedTableSetCounts.length
    //     }
    //     return counts;
    //   }

    getQuerySetValue = ()=>({querySetArray:this.setQueryArray,querySetOutfields:this.setOutFields})




}

export default new Helper();