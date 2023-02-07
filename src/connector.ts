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

    getSumOfValues = (field:string,selectedAttributes:any[])=>{
        let numberToAdd = 0;
        if (selectedAttributes?.length > 0){
            for (let i =0;i < selectedAttributes.length;i++){
                const val = selectedAttributes[i][field];
                if (typeof val === "number" && !isNaN(val)){
                    numberToAdd += val;
                }
            }
        }
        return numberToAdd;
    }

    getCheckedHighlightedIds = (currentHighlightIds:string[],objectId:string)=>{
        let copiedCurrentHighlightIds = [...currentHighlightIds];
        if (copiedCurrentHighlightIds.length){
            const index = copiedCurrentHighlightIds.indexOf(objectId);
            if (index === -1){
                copiedCurrentHighlightIds = [...copiedCurrentHighlightIds,objectId]
            }else{
                copiedCurrentHighlightIds.splice(index,1);
            }
        }else{
            copiedCurrentHighlightIds = [...copiedCurrentHighlightIds,objectId]
        }
        return copiedCurrentHighlightIds;
    }

    getValues = (features:any[],field:string)=>{
        const values = [];
        if (features.length){
            features.forEach(feature => {
                const currentValue = feature.attributes[field];
                if (currentValue){
                    values.push(currentValue);
                }
            });
        }
        return values;
    }

    getHighlightedIds = (val:any[],fieldValues:any[])=>{
        let highlightedArray = [];
        if (val?.length && fieldValues?.length){
            const copiedFieldValues = [...fieldValues];
            for (let i = 0;i < val.length;i++){
                const item = copiedFieldValues.find((item)=>{
                    if (item.value === val[i]){
                        return item
                    }
                    
                });
                if (item){
                    highlightedArray.push(item.objectId)
                    // highlightedArray.push(`${item.objectId}`)
                } 
            }
        }
        return highlightedArray;
    }

    getObjectIds = (val:any[],fieldValues:any[])=>{
        let highlightedArray = [];
        if (val?.length && fieldValues?.length){
            const copiedFieldValues = [...fieldValues];
            for (let i = 0;i < val.length;i++){
                const item = copiedFieldValues.find((item)=>{
                    if (`${item.objectId}` === val[i]){
                        return item
                    }
                    
                });
                if (item){
                    highlightedArray.push(item.objectId)
                    // highlightedArray.push(val[i])
                } 
            }
        }
        return highlightedArray;
    }

    activateLayerOnTheMap = (id:string,jimuLayerViews:any)=>{
        const keys = Object.keys(jimuLayerViews);
        if (keys.length > 0){
            keys.forEach((key)=>{
                if (id === jimuLayerViews[key]?.layer?.id){
                    if(jimuLayerViews[key].layer?.hasOwnProperty("visible")){
                        jimuLayerViews[key].layer.visible = true;
                    }
                    if (jimuLayerViews[key].hasOwnProperty("view")){
                        if (jimuLayerViews[key].view?.hasOwnProperty("visible")){
                            jimuLayerViews[key].view.visible = true;
                        }
                    }
                }
            })
        } 
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

}

export default new Helper();