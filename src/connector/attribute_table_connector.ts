
import { JimuMapView } from "jimu-arcgis";
import { appActions } from "jimu-core";

type spatialRelationshipType = "intersects" | "contains" | "crosses" | "disjoint" | "envelope-intersects" | "index-intersects" | "overlaps" | "touches" | "within" | "relation"

type layerOpenType = {
    geometry:any,
    typeSelected:spatialRelationshipType,
    where?:string,
    graphicsFound?:any,
    valueBuffer?:any
}

type initObjType = {
    results:any[],
    allCheckedLayers?:any[],
    isLayerChecked?:boolean,
    checkedLayers?:string[],
    numberOfAttributes?:{[key:string]:string},
    layerOpen?:layerOpenType,
    createTable?:true
}

type selectedLayerType = {id:string,attributes:any[]}

class AttributeTableConnector {

    static activeView:JimuMapView = null;
    static self:any = null;

    allCheckedLayers?:any[];
    checkedLayers?:string[];
    numberOfAttributes?:{[key:string]:string};
    createTable:boolean;
    layerOpen:layerOpenType;
    isLayerChecked:boolean


    constructor(activeView:JimuMapView,self:any){
        AttributeTableConnector.activeView = activeView;
        AttributeTableConnector.self = self;
    }

    init(obj:initObjType){  

        const results = obj.results;
        const allCheckedLayers = obj.allCheckedLayers;
        let createTable = true;
        let isLayerChecked = false;
        let checkedLayers = null;
        let numberOfAttributes = null;
        let layerOpen = null;
        if (obj.hasOwnProperty("createTable")){
            createTable = obj.createTable;
        }
        if (obj.hasOwnProperty("isLayerChecked")){
            isLayerChecked = obj.isLayerChecked 
        }
        if (obj.hasOwnProperty("checkedLayers")){
            checkedLayers = obj.checkedLayers 
        }
        if (obj.hasOwnProperty("numberOfAttributes")){
            numberOfAttributes = obj.numberOfAttributes 
        }
        if (obj.hasOwnProperty("layerOpen")){
            layerOpen = obj.layerOpen 
        }
        this.createTable = createTable;
        this.isLayerChecked = isLayerChecked;
        this.setAllCheckedLayers(allCheckedLayers,results);
        this.setCheckedLayers(allCheckedLayers,checkedLayers);
        // this.setAllCheckedLayers(allCheckedLayers);
        this.setNumberOfAttributes(results,numberOfAttributes);
        this.setLayerOpen(layerOpen);
    }

    isArray = (val)=>Array.isArray(val);

    isObject = (val)=>Object.keys(val).length > 0 && !Array.isArray(val);

    loopLayerGetIds = (layer:any[])=>{
        let idsArray = [];
        if (layer.length){
            idsArray = layer.reduce((newArray,item)=>{
                if (item.id){
                    newArray.push(item.id)
                }
                return newArray;
            },[])
        }
        return idsArray;
    }



    setCheckedLayers = (currentAllChechedLayers:any,checkedLayers?:string[],)=>{
        let allCheckedLayers = currentAllChechedLayers;
        if (!allCheckedLayers){
            allCheckedLayers = this.allCheckedLayers;
        }
        if (checkedLayers){
            this.checkedLayers = checkedLayers;
            return;
        }
        let checkedLayersArr = [];
        if (allCheckedLayers){
            if (this.isObject(allCheckedLayers)){
                checkedLayersArr.push(allCheckedLayers.id);
                this.checkedLayers = checkedLayersArr;
                return;
            }
            if (this.isArray(allCheckedLayers)){
                if (checkedLayersArr.length){
                    checkedLayersArr = [...checkedLayersArr,...this.loopLayerGetIds(allCheckedLayers)];
                    this.checkedLayers = checkedLayersArr;
                    return;
                }else{
                    checkedLayers = this.loopLayerGetIds(allCheckedLayers);
                    this.checkedLayers = checkedLayers;
                    return;
                }
            }
        }
    }

    setAllCheckedLayersFromResults = (results:any[])=>{
        if (results?.length > 0){
            const allCheckedLayers = results.reduce((newArray,items:any[])=>{
                if (items?.length > 0){
                    newArray.push(items[0]?.layer)
                }
                return newArray;
            },[])
            this.allCheckedLayers = allCheckedLayers;
            return;
        }
        throw "Pass results after query"

    }

    setAllCheckedLayers = (allCheckedLayers:any,results:any[])=>{
        if (allCheckedLayers){
            if (this.isObject(allCheckedLayers)){
                this.allCheckedLayers = [allCheckedLayers]
            }
            if (this.isArray(allCheckedLayers)){
                this.allCheckedLayers = allCheckedLayers
            }
            return;
        }
        this.setAllCheckedLayersFromResults(results);
 
    }


    getSelectedContentsLayer =(results:any):selectedLayerType[]=>{
        const checkedLayers = this.checkedLayers??[];
        let selectedLayersArray = [];
        if (results?.length > 0){
            selectedLayersArray = results.reduce((newArray,items:any[])=>{
                if (items?.length > 0){
                    let selectedLayerContents = {};
                    let currentLayerId = items[0]?.layer?.id;
                    if (checkedLayers.indexOf(currentLayerId) !== -1){
                        selectedLayerContents["id"] = items[0]?.layer?.id;
                        selectedLayerContents["attributes"] = this.getAttributes(items);
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

    setNumberOfAttributes = (results:any[],numberOfAttributes?:{[key:string]:string},)=>{
        if (numberOfAttributes){
            this.numberOfAttributes = numberOfAttributes;
            return;
        }
        const layersContents = this.getSelectedContentsLayer(results);
        let layerContentsObject = {};
        if (layersContents?.length){
            for (let i=0;i < layersContents.length;i++){
                layerContentsObject = {...layerContentsObject,[layersContents[i]?.id]:layersContents[i]?.attributes?.length??0}
           }
        }
        this.numberOfAttributes = layerContentsObject
    }

    setLayerOpen = (layerOpen?:layerOpenType)=>{
        if (layerOpen){
            this.layerOpen = layerOpen;
            return;
        }
        this.layerOpen = {
            geometry:null,
            typeSelected:"contains",
        }
    }

    getActiveView = ()=>AttributeTableConnector.activeView;
    
    getAllCheckedLayers = ()=> this.allCheckedLayers;

    dispatchingAll = ()=>{
        const self = AttributeTableConnector.self;
        const props = self.props
        if (props && props.hasOwnProperty("dispatch") ){
            const numberOfAttributes = this.numberOfAttributes;
            const layerOpen = this.layerOpen;
            const allCheckedLayers = this.allCheckedLayers;
            const activeView = this.getActiveView();
            if (numberOfAttributes && layerOpen && allCheckedLayers && activeView){
                if (Object.keys(numberOfAttributes).length > 0){
                    props.dispatch(appActions.widgetStatePropChange("value","createTable",true));
                    props.dispatch(appActions.widgetStatePropChange("value","numberOfAttribute",numberOfAttributes));
                    props.dispatch(appActions.widgetStatePropChange("value","layerOpen",layerOpen));
                    props.dispatch(appActions.widgetStatePropChange("value","getAllLayers",this.getAllCheckedLayers));
                    props.dispatch(appActions.widgetStatePropChange("value","getActiveView",this.getActiveView));
                    if (!this.isLayerChecked){
                        props.dispatch(appActions.widgetStatePropChange("value","checkedLayers",this.checkedLayers));
                    }
                    return;
                }
                throw "noItemSelected"
            }
            if (!layerOpen)throw "There is no layer open"
            if (allCheckedLayers)throw "There is no all checked layers make sure to pass layer"
            if (activeView)throw "There is no activeView,pass jimuMapView when map load"
            return;
        }
        throw "Pass parent widget to the AttributeConnector"

    }

    getProps = ()=>{
        const self = AttributeTableConnector.self;
        const props = self.props;
        const numberOfAttributes = this.numberOfAttributes;
        const layerOpen = this.layerOpen;
        const allCheckedLayers = this.allCheckedLayers;
        const activeView = this.getActiveView(); 
        if (props && props.hasOwnProperty("dispatch")){
            if(!layerOpen)throw "There is no layer open"
            if (!allCheckedLayers)throw "There is no all checked layers make sure to pass layer"
            if (!activeView)throw "There is no activeView,pass jimuMapView when map load"
            if (numberOfAttributes && Object.keys(numberOfAttributes)){
                return props;
            }
            return null;
        }
        throw "Pass parent widget to the AttributeConnector"
    }

    dispatchCreateTable = ()=>{
        const props = this.getProps();
        if (props){
            props.dispatch(appActions.widgetStatePropChange("value","createTable",true));
        }
    }

    dispatchChechedLayers = (checkedLayers:string[])=>{
        const props = this.getProps();
        if (props){
            props.dispatch(appActions.widgetStatePropChange("value","checkedLayers",checkedLayers));
            props.dispatch(appActions.widgetStatePropChange("value","createTable",true));
        }
    }

    dispatchFilterValue = (filterValue:number)=>{
        const props = this.getProps();
        if (props){
            props.dispatch(appActions.widgetStatePropChange("value","filterValue", filterValue));
            props.dispatch(appActions.widgetStatePropChange("value","createTable",true));
        }
    }
}

export default AttributeTableConnector;