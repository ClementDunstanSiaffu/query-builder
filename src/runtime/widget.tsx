/** @jsx jsx */
import { React, AllWidgetProps, jsx, appActions } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import { CloseOutlined } from "jimu-icons/outlined/editor/close";
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus'
import "../style.css";
import { Select, Option, Alert, Button, Icon } from "jimu-ui";
import defaultMessages from "./translations/default";
import { IMConfig } from "../config";
import Query from "esri/rest/support/Query";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Table from "./components/Table";
import helper from "../connector";
import Polygon from "esri/geometry/Polygon";
import AttributeTableConnector from "../connector/attribute_table_connector";
import geometryEngine from "esri/geometry/geometryEngine";
import AddSetTable from "./components/AddSetTable";

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>,any> {
  
  graphicLayerFound = new GraphicsLayer({ listMode: "hide", visible: true });
  graphicLayerSelected = new GraphicsLayer({ listMode: "hide", visible: true });

  static activeV = null;
  static jimuLayerViewz = null;
  static attribute_table_data = null;
  static initialZoom = 0;

  attributeTableConnector = null;
  queryArray = [];
  outfields = [];
  currentLayerView = null;
  setQueryArray = [];
  setOutFields = [];
  setQueryString = null;
 
  constructor(props) {
    super(props);
    this.init();
    this.activeViewChangeHandler = this.activeViewChangeHandler.bind(this);
    //Layer
    this.onChangeSelectLayer = this.onChangeSelectLayer.bind(this);
    this.getQueryAttribute = this.getQueryAttribute.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.sendQuery = this.sendQuery.bind(this);
    this.sendQuerySet = this.sendQuerySet.bind(this);
    // this.runbothQueries= this.runbothQueries.bind(this);
    this.thirdQuery = this.thirdQuery.bind(this);
    this.dropdownItemClick = this.dropdownItemClick.bind(this);
    this.chooseAndOr = this.chooseAndOr.bind(this);
    this.chooseAndOrSet = this.chooseAndOrSet.bind(this);
    this.closeDrop = this.closeDrop.bind(this);
    this.openDrop = this.openDrop.bind(this);
    this.closeDropOnclickOutside = this.closeDropOnclickOutside.bind(this);
    this.onmouseLeave = this.onmouseLeave.bind(this);
    this.getAllCheckedLayers = this.getAllCheckedLayers.bind(this);
    this.getAllJimuLayerViews = this.getAllJimuLayerViews.bind(this);
    this.connector_function = this.connector_function.bind(this);
    this.functionCounterIsChecked = this.functionCounterIsChecked.bind(this);
    this.getQueryAttributeSet = this.getQueryAttributeSet.bind(this);
    this.getQuerySet = this.getQuerySet.bind(this);
    this.onChangeCheckBoxSet = this.onChangeCheckBoxSet.bind(this);
  }

  init = () => {
    this.state = {
      jimuMapView: null,
      layerContents: [],
      checkedLayer_: [],
      resultLayerList: [],
      isLayerSelected: false,
      resultsLayerSelected: [],
      currentTargetText: null,
      geometry: null,
      typeSelected: null,
      listServices: [],
      currentFirstQuery: "",
      currentFirstQueryType: null,
      dropdownValueQuery: "valore",
      firstTextIncludedHandler: "0",
      secondTextIncludedHandler: "0",
      tables: [],
      isChecked: false,
      counterIsChecked: [],
      checkedToQuery: [],
      tableCounter: 0,
      tableCounterSet: 0,
      whereClauses: [],
      tablesSetId: null,
      whereClauseSet: [],
      tablesSet: [],
      tablesId: null,
      isOpen: false,
      AndOr: "AND",
      AndOrSet: "AND",
      opened: false,
      autOpen: true,
      mouseleave: false,
      dropDowns: {},
      dropDownsSet: {},
      highlightIds: [],
      selectedField: null,
      otherQueriesValue: {},
      dropId: null,
      dropIdSet: null,
      higlightSelected: [],
      itemNotFound: null,
      currentSelectedId: " ",
      isAttributeTableClosed: false,
      widgetStateClosedChecked: false,
      widgetStateOpenedChecked: false,
      showAddSelect: true,
      SetBlock: [],
    };
  };

  nls = (id: string) => {
    return this.props.intl? this.props.intl.formatMessage({id: id,defaultMessage: defaultMessages[id],}): id;
  };

  activeViewChangeHandler(jmv: JimuMapView) {
    if (jmv) {
      jmv.view.map.add(this.graphicLayerFound);
      jmv.view.map.add(this.graphicLayerSelected);
      const resultLayerList = [];
      jmv.view.map.allLayers.forEach((f, index) => {
        if (f.type === "feature") {
          jmv.view.whenLayerView(f).then((layerView) => {
            const query = new Query();
            query.where = "1=1";
            query.outFields = ["*"];
            layerView.filter = { where: query.where };
          });
          resultLayerList.push({
            element: f,
            label: f.title,
            value: index,
            layerID: f.id,
            urlServiceServer: f.url,
          });
        }
      });
      Widget.activeV = jmv;
      Widget.jimuLayerViewz = jmv?.jimuLayerViews;
      this.setState({ resultLayerList: resultLayerList, jimuMapView: jmv });
      this.attributeTableConnector = new AttributeTableConnector(jmv, this);
      Widget.initialZoom = jmv.view.zoom;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLayerSelected !== prevProps.isLayerSelected) {
    }
    if (this.state.whereClauses !== prevProps.whereClauses) {
    }
  }

  componentWillUnmount(): void {}
  /**==============================================
   * EVENT CLICK SELECT
   ==============================================*/

  removeValueFromObject(obj){
    let newWhereClause = obj;
    if (obj?.ifInOrNotInQueryValue){
      newWhereClause = {
        id:obj.id,
        attributeQuery:obj.attributeQuery,
        attributeQueryType:obj.attributeQueryType,
        queryValue:obj.queryValue,
        ifInOrNotInQueryValue:obj.ifInOrNotInQueryValue
      }
    }else{
      newWhereClause = {
        id:obj.id,
        attributeQuery:obj.attributeQuery,
        attributeQueryType:obj.attributeQueryType,
        queryValue:obj.queryValue,
      }
    }
    return newWhereClause;
  }

  async getQueryAttribute(e) {
    let currentWhereClause;
    if (!this.state.whereClauses.length) {
      let whereClause = {
        id: e.currentTarget.attributes[1].value,
        attributeQuery: e.currentTarget.name,
        attributeQueryType: e.currentTarget.attributes.datatype.value,
        queryValue: "=",
      };
      currentWhereClause = whereClause;
      this.setState({ whereClauses: [whereClause] });
    }
    if (this.state.whereClauses.length) {
      const queryIndex = this.state.whereClauses
        .map((obj) => obj.id)
        .indexOf(e.currentTarget.attributes[1].value);
      if (queryIndex !== -1) {
        const updateState = this.state.whereClauses.map((obj) => {
          if (obj.id === e.currentTarget.attributes[1].value) {
            obj = {
              ...obj,
              attributeQuery: e.currentTarget.name,
              attributeQueryType: e.currentTarget.attributes.datatype.value,
            };
            obj = this.removeValueFromObject(obj)
            let filteredWhereClauses = this.state.whereClauses.filter(
              (a) => a.id !== obj.id
            );
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            currentWhereClause = obj;
            return this.setState({whereClauses: filteredWhereClauses});
          }
          return { obj };
        });
      } else {
        let whereClause = {
          id: e.currentTarget.attributes[1].value,
          attributeQuery: e.currentTarget.name,
          attributeQueryType: e.currentTarget.attributes.datatype.value,
        };
        // whereClause = this.removeValueFromObject(whereClause)
        currentWhereClause = whereClause;
        this.setState({whereClauses: [...this.state.whereClauses, whereClause],});
        this.state.whereClauses.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
        });
      }
    }
    this.setState({ selectedField: e.currentTarget.name },()=>{
      if (currentWhereClause)this.manipulateFieldQuery(currentWhereClause.queryValue,currentWhereClause.id,"single")
    });
  }

  async getQueryAttributeSet(e) {
    let currentWhereClause;
    if (!this.state.whereClauseSet.length) {
      let whereClauseSet = {
        id: e.currentTarget.attributes[1].value,
        attributeQuery: e.currentTarget.name,
        attributeQueryType: e.currentTarget.attributes.datatype.value,
        queryValue: "=",
      };
      currentWhereClause = whereClauseSet;
      this.setState({whereClauseSet: [whereClauseSet]});
    }
    if (this.state.whereClauseSet.length) {
      const queryIndex = this.state.whereClauseSet
        .map((obj) => obj.id)
        .indexOf(e.currentTarget.attributes[1].value);
      if (queryIndex !== -1) {
        const updateState = this.state.whereClauseSet.map((obj) => {
          if (obj.id === e.currentTarget.attributes[1].value) {
            obj = {
              ...obj,
              attributeQuery: e.currentTarget.name,
              attributeQueryType: e.currentTarget.attributes.datatype.value,
            };
            obj = this.removeValueFromObject(obj)
            let filteredWhereClauseSet = this.state.whereClauseSet.filter(
              (a) => a.id !== obj.id
            );
            filteredWhereClauseSet.push(obj);
            filteredWhereClauseSet.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            currentWhereClause = obj;
            return this.setState({whereClauseSet: filteredWhereClauseSet,});
          }
          return { obj };
        });
      } else {
        let whereClauseSet = {
          id: e.currentTarget.attributes[1].value,
          attributeQuery: e.currentTarget.name,
          attributeQueryType: e.currentTarget.attributes.datatype.value,
        };
        currentWhereClause = whereClauseSet;
        this.setState({whereClauseSet: [...this.state.whereClauseSet, whereClauseSet],});
        this.state.whereClauseSet.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
        });
      }
    }
    this.setState({ selectedField: e.currentTarget.name },()=>{
      this.manipulateFieldQuery(currentWhereClause.queryValue,currentWhereClause.id,"set")
    });
  }

  // for called on drop select list
  async getQuery(e, type = "single") {
    const clickedQueryTableId = e.currentTarget.attributes[1].value;
    const currentTargetName = e.currentTarget.name;
    this.manipulateFieldQuery(currentTargetName,clickedQueryTableId,type)
  }

  async manipulateFieldQuery(currentTargetName:string,clickedQueryTableId:string,type:string){
    let queryIndex = -1;
    let currentClickedQueryAttribute = " ";
    let newWhereSetClause;
    const keytype = type === "single" ? "whereClauses" : "whereClauseSet";
    if (this.state[keytype].length) {
      queryIndex = this.state[keytype].map((obj) => obj.id).indexOf(clickedQueryTableId);
      if (queryIndex !== -1) {
        const updateState = this.state[keytype].map((obj) => {
          if (obj.id === clickedQueryTableId) {
            currentClickedQueryAttribute = obj.attributeQuery;
            // obj = this.removeValueFromObject(obj)
            obj = { ...obj, queryValue:currentTargetName };
            let filteredWhereClauses = this.state[keytype].filter((a) => a.id !== obj.id);
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;});
            newWhereSetClause = filteredWhereClauses;
            return this.setState({[keytype]: filteredWhereClauses,});
          }
          return { obj };
        });
      }
    }
    if (currentTargetName === "IN" || currentTargetName === "NOT_IN") {
      if (this.state.jimuMapView) {
        this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
          if (f.title === this.state.currentTargetText) {
            this.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
              const query = new Query();
              query.where = `${currentClickedQueryAttribute} is not null`;
              query.outFields = [`${currentClickedQueryAttribute}`];
              const results = f.queryFeatures(query);
              results.then((result) => {
                const detailThirdQuery = [];
                result.features.forEach((el) => {
                  detailThirdQuery.push({
                    label: el.attributes[currentClickedQueryAttribute],
                    value: el.attributes[currentClickedQueryAttribute],
                  });
                });
                if (queryIndex !== -1) {
                  if (typeof detailThirdQuery[0].value !== "number") {
                    detailThirdQuery.sort((a, b) =>
                      a.label < b.label ? -1 : a.label > b.label ? 1 : 0
                    );
                  } else {
                    detailThirdQuery.sort((a, b) =>
                      a.value - b.value < 0 ? -1 : a.value === b.value ? 0 : 1
                    );
                  }
                  const updateState = this.state[keytype].map((obj) => {
                    if (obj.id === clickedQueryTableId ) {
                      // obj = this.removeValueFromObject(obj)
                      obj = { ...obj, ifInOrNotInQueryValue: detailThirdQuery };
                      let filteredWhereClauses = this.state[keytype].filter(
                        (a) => a.id !== obj.id
                      );
                      filteredWhereClauses.push(obj);
                      filteredWhereClauses.sort(function (a, b) {
                        return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
                      });
                      return this.setState({
                        [keytype]: filteredWhereClauses,
                      });
                    }
                    return { obj };
                  });
                }
              });
            });
          }
        });
      }
    }
    if (keytype === "whereClauseSet"){
      if (newWhereSetClause?.length){
        const currentNewWhereSetClause = newWhereSetClause.find((item)=>item.id === clickedQueryTableId);
        this.addCurrentWherClauseBlock(clickedQueryTableId,currentNewWhereSetClause)
      }
    }
  }

  async getQuerySet(e, type = "single") {
    const clickedQueryTableId = e.currentTarget.attributes[1].value;
    const currentTargetName = e.currentTarget.name;
    this.manipulateFieldQuery(currentTargetName,clickedQueryTableId,"set")
  }

  //TODO la sendQuery andrà risistemata quando si aggiungerà oltre all'espressione anche il set di espressioni
  // perché ora per l'AND fa il ciclo for su ogni where inserita nell'array ma dopo sarà necessario scomporre per creare le espressioni

  // step1
  async sendQuery() {
    this.queryArray = [];
    this.outfields = [];
    const checkedQuery = [
      "is null",
      "is not null",
      "IN",
      "NOT_IN",
      "included",
      "is_not_included",
    ];
    const likelyQuery = ["LIKE%", "%LIKE", "%LIKE%", "NOT LIKE"];
    if (this.state.whereClauses.length) {
      if (this.state.AndOr === "AND") {
        this.state.whereClauses.forEach((el, id) => {
          let attributeQuery = el.attributeQuery;
          let queryValue = el.queryValue;
          let value;
          if (queryValue === "is null" || queryValue === "is not null") {
            value = el.value?.txt ?? "";
          } else if (queryValue === "IN" || queryValue === "NOT_IN") {
            value = [];
            el.checkedList.forEach((el) => value.push(el.checkValue));
          } else if (
            queryValue === "included" ||
            queryValue === "is_not_included"
          ) {
            value = {
              firstTxt: el.firstTxt.value,
              secondTxt: el.secondTxt.value,
            };
          } else if (!checkedQuery.includes(queryValue)) {
            value = el.value?.txt ?? "";
          }
          if (this.state.jimuMapView) {
            this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
              if (f.title === this.state.currentTargetText) {
                this.state.jimuMapView.view
                  .whenLayerView(f)
                  .then((layerView) => {
                    this.queryConstructor(
                      //step 2 start querying
                      layerView,
                      attributeQuery,
                      queryValue,
                      value,
                      this.state.AndOr,
                      this.connector_function,
                      f
                    );
                  });
              }
            });
          }
        });
      } else {
        let normalizedWhereToSendQuery: any = [];
        this.state.whereClauses.forEach((el, id) => {
          const query = new Query();
          let attributeQuery = el.attributeQuery;
          let queryValue = el.queryValue;
          let value;
          if (queryValue === "is null" || queryValue === "is not null") {
            let queryIn = `${attributeQuery} ${queryValue}`;
            query.where = queryIn;
            normalizedWhereToSendQuery.push(queryIn);
          }
          if (queryValue === "IN" || queryValue === "NOT_IN") {
            value = [];
            if (queryValue === "IN" && el.checkedList.length) {
              el.checkedList.forEach((el) => value.push(el.checkValue));
            } else if (
              queryValue === "NOT_IN" &&
              this.state.counterIsChecked.length
            ) {
              this.state.counterIsChecked.forEach((el) =>
                value.push(el.checkValue)
              );
            }
            if (this.containsAnyLetters(value)) {
              let queryIn = `${attributeQuery} IN (${
                "'" + value.join("', '") + "'"
              })`;
              query.where = queryIn;
              normalizedWhereToSendQuery.push(queryIn);
            } else {
              let queryIn = `${attributeQuery} IN (${value.join(",")})`;
              query.where = queryIn;
              normalizedWhereToSendQuery.push(queryIn);
            }
          }
          if (queryValue === "included" || queryValue === "is_not_included") {
            let queryIn;
            queryValue === "included"
              ? (queryIn = `${attributeQuery} > ${el.firstTxt.value} AND ${attributeQuery} < ${el.secondTxt.value}`)
              : (queryIn = `${attributeQuery} < ${el.firstTxt.value} OR ${attributeQuery} > ${el.secondTxt.value}`);
            query.where = queryIn;
            normalizedWhereToSendQuery.push(queryIn);
          } else if (!checkedQuery.includes(queryValue)) {
            value = el.value?.txt ?? "";
            if (likelyQuery.includes(queryValue)) {
              query.where = helper.likelyQuery(
                attributeQuery,
                queryValue,
                value
              );
            } else {
              if (this.containsAnyLetters(value)) {
                let queryInput = `${attributeQuery} ${queryValue} '${value}'`;
                query.where = queryInput;
                normalizedWhereToSendQuery.push(queryInput);
              } else {
                let queryInput = `${attributeQuery} ${queryValue} ${value}`;
                query.where = queryInput;
                normalizedWhereToSendQuery.push(queryInput);
              }
            }
          }
          if (this.state.jimuMapView) {
            this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
              if (f.title === this.state.currentTargetText) {
                this.state.jimuMapView.view
                  .whenLayerView(f)
                  .then((layerView) => {
                    this.connector_function({
                      layerView,
                      query,
                      queryRequest: "OR",
                      layer: f,
                      AndOr: this.state.AndOr,
                      field: attributeQuery,
                      source: "singleQuery",
                    });
                  });
              }
            });
          }
        });
      }
    }else if (this.state.SetBlock.length){
      if (this.state.jimuMapView) {
        this.queryArray = [];
        this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
          if (f.title === this.state.currentTargetText) {
            this.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
              this.connector_function({
                layerView,
                query: new Query(),
                queryRequest: null,
                layer: f,
                AndOr: this.state.AndOr,
                field: null,
                source: "setQuery",
              });
            });
          }
        });
      }
    }else{
      this.attributeTableConnector.closeTable();
      this.setState({isAttributeTableClosed: true});
      this.returnToOriginalExtent()
    }
  }


setQueryConstructor = (queryRequest,firstQuery,secondQueryTarget)=>{
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
              return `${firstQuery} ${queryRequest} ${secondQueryTarget}`;
          }
    }
  }

  sendQuerySet() {
    const checkedQuery = [
      "is null",
      "is not null",
      "IN",
      "NOT_IN",
      "included",
      "is_not_included",
    ];
    const likelyQuery = ["LIKE%", "%LIKE", "%LIKE%", "NOT LIKE"];
    let setQueryString = null;
    let outFields = [];
    if (this.state.SetBlock.length){
      this.state.SetBlock.forEach((block,i)=>{
        const blockId = block?.blockId;
        const whereClauseSet = block[`${blockId}`];
        const AndOrSet = block?.AndOrSet;
        if (AndOrSet === "AND"){
          if (whereClauseSet?.length){
            whereClauseSet.forEach((el,j) => {
              let attributeQuery = el.attributeQuery;
              let queryValue = el.queryValue;
              let value;
              if (queryValue === "is null" || queryValue === "is not null") {
                value = el.value?.txt ?? "";
              } else if (queryValue === "IN" || queryValue === "NOT_IN") {
                value = [];
                el.checkedListSet.forEach((el) => value.push(el.checkValue));
              } else if (
                queryValue === "included" ||
                queryValue === "is_not_included"
              ) {
                value = {
                  firstTxt: el.firstTxt.value,
                  secondTxt: el.secondTxt.value,
                };
              } else if (!checkedQuery.includes(queryValue)) {
                value = el.value?.txt ?? "";
              }
              if (setQueryString){
                setQueryString += this.setQueryConstructor(queryValue,attributeQuery,value);
              }else{
                setQueryString = this.setQueryConstructor(queryValue,attributeQuery,value)
              }
              if (j < whereClauseSet.length-1)setQueryString += "  " +  AndOrSet + "  ";
              outFields.push(`${attributeQuery}`);
            });
          }
        }else{
          let normalizedWhereToSendQuery: any = [];
          if (whereClauseSet?.length){
            whereClauseSet.forEach((el,j) => {
              let attributeQuery = el.attributeQuery;
              let queryValue = el.queryValue;
              let value;
              if (queryValue === "IN" || queryValue === "NOT_IN") {
                value = [];
                if (queryValue === "IN" && el.checkedListSet.length) {
                  el.checkedListSet.forEach((el) => value.push(el.checkValue));
                } else if (
                  queryValue === "NOT_IN" &&
                  this.state.counterIsChecked.length
                ) {
                  this.state.counterIsChecked.forEach((el) =>
                    value.push(el.checkValue)
                  );
                }
              }
              if (queryValue === "included" || queryValue === "is_not_included") {
                value = {
                  firstTxt: el.firstTxt.value,
                  secondTxt: el.secondTxt.value,
                };
              } else if (!checkedQuery.includes(queryValue)) {
                  value = el.value?.txt ?? "";
              }
              if (setQueryString){
                setQueryString += this.setQueryConstructor(queryValue,attributeQuery,value);
              }else{
                setQueryString = this.setQueryConstructor(queryValue,attributeQuery,value)
              }
              if (j < whereClauseSet.length-1)setQueryString += "  " +  AndOrSet + "  ";
              outFields.push(`${attributeQuery}`);
            });
          }
        }
        if (i === 0 && this.state.SetBlock.length >= 2 )setQueryString = "(" + setQueryString;
        
        if (i < this.state.SetBlock.length-1)setQueryString += " ) " + this.state.AndOr + " ( ";
        
        if (this.state.SetBlock.length >= 2 && i === this.state.SetBlock.length-1)setQueryString = setQueryString + ")"
        
      })
    }
    return {setQueryString,outFields}
  }

  async thirdQuery(e) {
    const currentQueryTest = e.currentTarget.textContent;
    this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
      if (f.title === this.state.currentTargetText) {
        this.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
          this.inQueryConstructor(
            layerView,
            this.state.currentFirstQuery,
            this.state.currentSecondQuery,
            currentQueryTest
          );
        });
      }
    });
  }

  async onChangeSelectLayer(e) {
    this.graphicLayerFound.removeAll();
    if (this.state.jimuMapView) {
      this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
        if (f.title === e.currentTarget.innerText) {
          this.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
            this.setState({
              resultsLayerSelected: f,
              currentTargetText: e.currentTarget.innerText,
              currentSelectedId: e.currentTarget.value,
            });
            this.props.dispatch(
              appActions.widgetStatePropChange("value", "checkedLayers", [f.id])
            );
          });
        }
      });
    }
  }

  addTable = () => {
    const currentId = this.state.tableCounter;
    this.setState({
      tables: [...this.state.tables, { id: this.state.tableCounter }],
      tableCounter: this.state.tableCounter + 1,
      dropDowns: { ...this.state.dropDowns, [currentId]: false },
    });
    if (this.state.tables.length > 0) {
      this.setState({ showAddSelect: false });
    }
    if (this.state.tablesSet.length > 0) {
      this.setState({ showAddSelect: false });
    }
  };

  addTwoTable = (ev) => {
    let newblock=this.state.SetBlock.map((el)=>{
      if(ev.target.id==el.blockId){
        let id = el.tableCounterSet;
        const currentId = this.state.tableCounterSet;
        return {
          ...el,
          tablesSet:[...el.tablesSet, { id: id }],
          tableCounterSet: this.state.tableCounterSet + 1,
          dropDownsSet: { ...el.dropDownsSet, [currentId]: false }
        }
      }
      return el;
    });
    if(this.state.tables.length > 0){
      this.setState({showAddSelect:false});
    }
    this.setState({ SetBlock: newblock });
  };

  addBlock = ()=>{
    console.log('llllllllllllllllllllllllllll',this.state.SetBlock)
    let idOne = this.state.SetBlock.tableCounterSet??0;
    let idTwo = idOne + 1;
    const currentId = idOne;
    const nextCurrentId = idTwo;
    let newBlock=[...this.state.SetBlock];
    newBlock.push({
      blockId:this.state.SetBlock.length,
      [`${this.state.SetBlock.length}`]:[],
      tablesSet:[ { id: idOne }, { id: idTwo }],
      tableCounterSet: this.state.tableCounterSet + 2,
      dropDownsSet: {
        ...this.state.dropDownsSet,
        [`${currentId}-${this.state.SetBlock.length}`]:false,
        [`${nextCurrentId}-${this.state.SetBlock.length}`]:false 
      },
      AndOrSet:this.state.AndOrSet
    })
    this.setState({
      SetBlock:newBlock,    
      dropDownsSet: {
        ...this.state.dropDownsSet,
        [`${currentId}-${this.state.SetBlock.length}`]:false,
        [`${nextCurrentId}-${this.state.SetBlock.length}`]:false 
      },
    });

    if(this.state.tables.length > 0)this.setState({showAddSelect:false});

  }

  deleteTable = (id) => {
    const copiedTable = [...this.state.tables];
    const newTables = copiedTable.filter((el) => el.id !== id);
    this.setState({ tableCounter: this.state.tableCounter - 1 });
    const copiedWhereClauses = [...this.state.whereClauses];
    const deletedWhereClauses = copiedWhereClauses.filter(
      (el) => el.id !== id.toString()
    );
    this.setState({
      tables: newTables,
      whereClauses: deletedWhereClauses,
      tableCounter: this.state.tableCounter - 1,
    });
    if (this.state.tables.length === 0) {
      this.setState({
        whereClauses: [],
      });
    }

    if (this.state.tables.length == 2 && this.state.tablesSet.length == 0) {
      this.setState({ showAddSelect: true });
    }
    if (this.state.tables.length == 1 && this.state.tablesSet.length > 0) {
      this.setState({ showAddSelect: true });
    }
  };

  deleteBlock = (blockData) => {
    let copiedBlock = [...this.state.SetBlock];
    const {el:blockDetails,innerEl }=blockData; 
    copiedBlock= copiedBlock.map((el)=>{
      if(el.blockId==blockDetails.blockId){
        let {tablesSet} =blockDetails; 
        let newTableSetcounter=blockDetails.tableCounterSet;
        if (tablesSet.length > 0){
          newTableSetcounter=newTableSetcounter - 1
          el.tableCounterSet = newTableSetcounter;
          this.setState({tableCounterSet:newTableSetcounter});
        }
        tablesSet = tablesSet.filter(e => e.id != innerEl.id);
        el.tablesSet=tablesSet;
        return el;        
      }
      return el;
    });
    const copiedWhereclauseSet = [...this.state.whereClauseSet];
    // const index = copiedBlock.findIndex((item)=>item.blockId === el.blockId);
    // if (index !== -1){
    //   copiedBlock.splice(index,1);
    //   this.setState({SetBlock:copiedBlock});
    // }
    this.setState({SetBlock:copiedBlock});
    if (copiedWhereclauseSet?.length){
      copiedWhereclauseSet.filter((item)=>(item.id).split("-")[1] === 'blockId');
      this.setState({whereClauseSet:copiedWhereclauseSet});
    }
  };

  deleteBlockAll = (blockData) => {
    const {el:blockDetails }=blockData; 
    let copiedBlock = [...this.state.SetBlock];
    copiedBlock = copiedBlock.filter(e => e.blockId != blockDetails.blockId);
    const copiedWhereclauseSet = [...this.state.whereClauseSet];
    // const index = copiedBlock.findIndex((item)=>item.blockId === el.blockId);
    // if (index !== -1){
    //   copiedBlock.splice(index,1);
    //   this.setState({SetBlock:copiedBlock});
    // }
    this.setState({SetBlock:copiedBlock});
    if (copiedWhereclauseSet?.length){
      copiedWhereclauseSet.filter((item)=>(item.id).split("-")[1] === 'blockId');
      this.setState({whereClauseSet:copiedWhereclauseSet});
    }
  };

  textInputHandler = (e,queryType="single") => {
    let txt = e.target.value;
    let currentTableId = e.target.attributes[0].value;
    this.queryTextConstructor(txt, currentTableId,queryType);
  };

  textFirstIncludedHandler = (e,queryType="single") => {
    let txt = e.target.value;
    let currentTableId = e.target.attributes[0].value;
    let input = "first";
    this.queryTextIncludedConstructor(txt, currentTableId, input,queryType);
  };

  textSecondIncludedHandler = (e,queryType="single") => {
    let txt = e.target.value;
    let currentTableId = e.target.attributes[0].value;
    let input = "second";
    this.queryTextIncludedConstructor(txt, currentTableId, input,queryType);
  };
  univocoSelectHandler = (e,queryType="single") => {
    let txt = e.currentTarget.textContent;
    let currentTableId = e.currentTarget.attributes[2].value;
    this.queryTextConstructor(txt, currentTableId,queryType);
  };

  containsAnyLetters = (str) => /[a-zA-Z]/.test(str);
  
  queryTextConstructor = (txt, currentTableId,queryType) => {
    let queryIndex;
    let newWhereSetClause;
    const keyType = queryType === "single" ? "whereClauses":"whereClauseSet";
    if (this.state[keyType].length) {
      queryIndex = this.state[keyType].map((obj) => obj.id).indexOf(currentTableId);
      if (queryIndex !== -1) {
        const updateState = this.state[keyType].map((obj) => {
          if (obj.id === currentTableId) {
            obj = { ...obj, value: { txt: txt } };
            let filteredWhereClauses = this.state[keyType].filter((a) => a.id !== obj.id);
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            newWhereSetClause = filteredWhereClauses;
            return this.setState({[keyType]: filteredWhereClauses,});
          }
          return { obj };
        });
      }
      if (newWhereSetClause?.length){
        const currentNewWhereSetClause = newWhereSetClause.find((item)=>item.id === currentTableId);
        this.addCurrentWherClauseBlock(currentTableId,currentNewWhereSetClause)
      }
    }
  };

  queryTextIncludedConstructor = (txt, currentTableId, input,queryType) => {
    let queryIndex;
    let newWhereSetClause;
    const keyType = queryType === "single" ? "whereClauses":"whereClauseSet";
    if (this.state[keyType].length) {
      queryIndex = this.state[keyType]
        .map((obj) => obj.id)
        .indexOf(currentTableId);
      if (queryIndex !== -1) {
        const updateState = this.state[keyType].map((obj) => {
          if (obj.id === currentTableId) {
            input === "first"
              ? (obj = { ...obj, firstTxt: { value: txt } })
              : (obj = { ...obj, secondTxt: { value: txt } });
            let filteredWhereClauses = this.state[keyType].filter(
              (a) => a.id !== obj.id
            );
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;});
            newWhereSetClause = filteredWhereClauses;
            return this.setState({[keyType]: filteredWhereClauses,});
          }
          return { obj };
        });
      }
      if (newWhereSetClause?.length){
        const currentNewWhereSetClause = newWhereSetClause.find((item)=>item.id === currentTableId);
        this.addCurrentWherClauseBlock(currentTableId,currentNewWhereSetClause)
      }
    }
  };

  dropdownItemClick = (e,type="single") => {
    let clickedQueryTableId = e.currentTarget.attributes[2].value;
    let clickedValue = e.currentTarget.value;
    let currentClickedQueryAttribute;
    let newWhereSetClause;
    let currentNewWhereSetClause;
    const keytype = type === "single" ? "whereClauses" : "whereClauseSet";
    let queryIndex;
    queryIndex = this.state[keytype].map((obj) => obj.id).indexOf(clickedQueryTableId);
    if (queryIndex !== -1) {
      const updateState = this.state[keytype].map((obj) => {
        if (obj.id === clickedQueryTableId) {
          obj = { ...obj, dropdownValueQuery: clickedValue };
          let filteredWhereClauses = this.state[keytype].filter(
            (a) => a.id !== obj.id
          );
          filteredWhereClauses.push(obj);
          filteredWhereClauses.sort(function (a, b) {
            return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
          });
          currentNewWhereSetClause = obj;
          // newWhereSetClause = filteredWhereClauses
          return this.setState({[keytype]: filteredWhereClauses,});
        }
        return { obj };
      });
    }
    if (e.currentTarget.value === "univoco") {
      if (queryIndex !== -1) {
        const updateState = this.state[keytype].map((obj) => {
          if (obj.id === clickedQueryTableId) {
            currentClickedQueryAttribute = obj.attributeQuery;
            if (this.state.jimuMapView) {
              this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
                if (f.title === this.state.currentTargetText) {
                  this.state.jimuMapView.view
                    .whenLayerView(f)
                    .then((layerView) => {
                      const query = new Query();
                      query.where = `${currentClickedQueryAttribute} is not null`;
                      query.outFields = [`${currentClickedQueryAttribute}`];
                      layerView.filter = {where: query.where,};
                      const results = f.queryFeatures(query);
                      results.then((result) => {
                        const detailThirdQuery = [];
                        result.features.forEach((el) => {
                          detailThirdQuery.push({
                            value: Object.values(el.attributes),
                            label: Object.values(el.attributes),
                          });
                        });
                        if (queryIndex !== -1) {
                          const updateState = this.state[keytype].map(
                            (obj) => {
                              if (obj.id === clickedQueryTableId) {
                                obj = {
                                  ...obj,
                                  ifInOrNotInQueryValue: detailThirdQuery,
                                  dropdownValueQuery: clickedValue,
                                };
                                currentNewWhereSetClause = obj;
                                let filteredWhereClauses =
                                  this.state[keytype].filter(
                                    (a) => a.id !== obj.id
                                  );
                                filteredWhereClauses.push(obj);
                                filteredWhereClauses.sort(function (a, b) {
                                  return a.id < b.id
                                    ? -1
                                    : a.id == b.id
                                    ? 0
                                    : 1;
                                });
                                // newWhereSetClause = filteredWhereClauses
                                return this.setState({[keytype]: filteredWhereClauses,});
                              }
                              return { obj };
                            }
                          );
                        }
                      });
                    });
                }
              });
            }
          }
        });
      }
    }
    this.setState({ dropdownValueQuery: e.target.value },()=>{

    });
    if (keytype === "whereClauseSet"){
      if (currentNewWhereSetClause)this.addCurrentWherClauseBlock(clickedQueryTableId,currentNewWhereSetClause)
    }
  };

  dropDown = (id) => {
    this.setState({ autOpen: true });
    let queryIndex;
    queryIndex = this.state.whereClauses
      .map((obj) => obj.id)
      .indexOf(id.toString());
    if (queryIndex !== -1) {
      const updateState = this.state.whereClauses.map((obj) => {
        if (obj.id === queryIndex.toString()) {
          if (!obj.isOpen) {
            obj = { ...obj, isOpen: true };
            let filteredWhereClauses = this.state.whereClauses.filter(
              (a) => a.id !== obj.id
            );
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            return this.setState({
              whereClauses: filteredWhereClauses,
            });
          } else {
            obj = { ...obj, isOpen: false };
            let filteredWhereClauses = this.state.whereClauses.filter(
              (a) => a.id !== obj.id
            );
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            return this.setState({
              whereClauses: filteredWhereClauses,
            });
          }
        }
        return { obj };
      });
    }
  };

  dropDownSet = (id) => {
    this.setState({ autOpen: true });
    let queryIndex;
    queryIndex = this.state.whereClauseSet
      .map((obj) => obj.id)
      .indexOf(id.toString());
    if (queryIndex !== -1) {
      const updateState = this.state.whereClauseSet.map((obj) => {
        if (obj.id === queryIndex.toString()) {
          if (!obj.isOpen) {
            obj = { ...obj, isOpen: true };
            let filteredWhereClauseSet = this.state.whereClauseSet.filter(
              (a) => a.id !== obj.id
            );
            Set.push(obj);
            filteredWhereClauseSet.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            return this.setState({
              whereClauseSet: filteredWhereClauseSet,
            });
          } else {
            obj = { ...obj, isOpen: false };
            let filteredWhereClauseSet = this.state.whereClauseSet.filter(
              (a) => a.id !== obj.id
            );
            filteredWhereClauseSet.push(obj);
            filteredWhereClauseSet.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            return this.setState({
              whereClauseSet: filteredWhereClauseSet,
            });
          }
        }
        return { obj };
      });
    }
  };

  handleCheckBox = (event) => {
    this.setState({
      isChecked: event.target.checked,
    });
  };

  onChangeCheckBox = (event) => {
    let currentId = event.target.attributes.id.value;
    let objectId = event.target.attributes.value.value;
    let queryIndex;
    if (event.target.checked) {
      queryIndex = this.state.whereClauses
        .map((obj) => obj.id)
        .indexOf(currentId);
      if (queryIndex !== -1) {
        this.state.whereClauses.map((obj) => {
          if (obj.id === queryIndex.toString()) {
            if (!obj.checkedList) {
              obj = {
                ...obj,
                checkedList: [
                  {
                    checkValue: event.target.attributes.name.value,
                    isChecked: true,
                  },
                ],
              };
              let filteredWhereClauses = this.state.whereClauses.filter(
                (a) => a.id !== obj.id
              );
              filteredWhereClauses.push(obj);
              this.setState(
                {
                  whereClauses: filteredWhereClauses,
                },
                () => {
                  this.state.whereClauses.sort(function (a, b) {
                    return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
                  });

                  // Remove duplicate entries from the whereClauses array
                  this.setState({
                    whereClauses: Array.from(new Set(this.state.whereClauses)),
                  });
                }
              );
            } else {
              const ifAlreadyCheck = obj.checkedList
                .map((obj) => obj.checkValue)
                .indexOf(event.target.attributes.name.value);
              if (ifAlreadyCheck == -1) {
                obj = {
                  ...obj,
                  checkedList: [
                    ...obj.checkedList,
                    {
                      checkValue: event.target.attributes.name.value,
                      isChecked: true,
                    },
                  ],
                };
                // Find the index of the obj object in the whereClauses array
                const index = this.state.whereClauses.findIndex(
                  (a) => a.id === obj.id
                );
                // Remove the obj object from the whereClauses array
                this.state.whereClauses.splice(index, 1);
                // Add the updated obj object to the whereClauses array
                this.state.whereClauses.push(obj);
                this.setState(
                  {
                    whereClauses: this.state.whereClauses,
                  },
                  () => {
                    this.state.whereClauses.sort(function (a, b) {
                      return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
                    });

                    // Remove duplicate entries from the whereClauses array
                    this.setState({
                      whereClauses: Array.from(
                        new Set(this.state.whereClauses)
                      ),
                    });
                  }
                );
              }
            }
          }
          return { obj };
        });
      }
    }
    if (event.target.checked === false) {
      // Find the obj object in the whereClauses array
      const obj = this.state.whereClauses.find((a) => a.id === currentId);
      // Remove the checkValue from the checkedList array
      obj.checkedList = obj.checkedList.filter(
        (a) => a.checkValue !== event.target.attributes.name.value
      );
      // Update the obj object in the whereClauses array
      const index = this.state.whereClauses.findIndex(
        (a) => a.id === currentId
      );
      this.state.whereClauses[index] = obj;
      this.setState(
        {
          whereClauses: this.state.whereClauses,
        },
        () => {
          this.state.whereClauses.sort(function (a, b) {
            return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
          });
          // Remove duplicate entries from the whereClauses array
          this.setState({
            whereClauses: Array.from(new Set(this.state.whereClauses)),
          });
        }
      );
    }
  };

  addCurrentWherClauseBlock = (currentId,currentWhereClause)=>{
    const blockId = currentId.split("-")[1];
    const currentSetBlock = [...this.state.SetBlock];
    let currentBlockIndex = -1;
    let currentBlock;
    currentBlockIndex = currentSetBlock.findIndex((item)=>`${item?.blockId}` === blockId);
    if (currentBlockIndex !== -1)currentBlock = currentSetBlock[currentBlockIndex]
    let currentWhereSetClause = null;
    if (currentBlock){
      currentWhereSetClause = currentBlock[`${blockId}`];
      if (currentWhereSetClause?.length){
        let index = -1;
        index = currentWhereSetClause.findIndex((item)=>item.id === currentId);
        if (index !== -1){
          currentWhereSetClause[index] = currentWhereClause;
        }else{
          currentWhereSetClause = [...currentWhereSetClause,currentWhereClause]
        }
        currentBlock[blockId] = currentWhereSetClause;
        currentSetBlock[currentBlockIndex] = currentBlock;
        this.setState({SetBlock:currentSetBlock});
      }else{
        currentBlock[blockId] = [currentWhereClause];
        currentSetBlock[currentBlockIndex] = currentBlock;
        this.setState({SetBlock:currentSetBlock});
      }
    }
  }

  onChangeCheckBoxSet = (event) => {
    let newWhereSetClause;
    let currentId = event.target.attributes.id.value;
    let objectId = event.target.attributes.value.value;
    let queryIndex;
    if (event.target.checked) {
      queryIndex = this.state.whereClauseSet
        .map((obj) => obj.id)
        .indexOf(currentId);
      if (queryIndex !== -1) {
        this.state.whereClauseSet.map((obj) => {
          if (obj.id === currentId) {
            if (!obj.checkedListSet) {
              obj = {
                ...obj,
                checkedListSet: [
                  {
                    checkValue: event.target.attributes.name.value,
                    isChecked: true,
                  },
                ],
              };
              let filteredWhereClauseSet = this.state.whereClauseSet.filter(
                (a) => a.id !== obj.id
              );
              filteredWhereClauseSet.push(obj);
              newWhereSetClause = filteredWhereClauseSet;
              this.setState(
                {
                  whereClauseSet: filteredWhereClauseSet,
                },
                () => {
                  this.state.whereClauseSet.sort(function (a, b) {
                    return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
                  });
                  // Remove duplicate entries from the whereClauses array
                  this.setState({whereClauseSet: Array.from(new Set(this.state.whereClauseSet)),});
                }
              );
            } else {
              const ifAlreadyCheck = obj.checkedListSet
                .map((obj) => obj.checkValue)
                .indexOf(event.target.attributes.name.value);
              if (ifAlreadyCheck == -1) {
                obj = {
                  ...obj,
                  checkedListSet: [
                    ...obj.checkedListSet,
                    {
                      checkValue: event.target.attributes.name.value,
                      isChecked: true,
                    },
                  ],
                };
                // Find the index of the obj object in the whereClauses array
                const index = this.state.whereClauseSet.findIndex(
                  (a) => a.id === obj.id
                );
                // Remove the obj object from the whereClauses array
                this.state.whereClauseSet.splice(index, 1);
                // Add the updated obj object to the whereClauses array
                this.state.whereClauseSet.push(obj);
                newWhereSetClause = this.state.whereClauseSet
                this.setState(
                  {
                    whereClauseSet: this.state.whereClauseSet,
                  },
                  () => {
                    this.state.whereClauseSet.sort(function (a, b) {
                      return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
                    });
                    // Remove duplicate entries from the whereClauses array
                    this.setState({whereClauseSet: Array.from(new Set(this.state.whereClauseSet)),
                    });
                  }
                );
              }
            }
          }
          return { obj };
        });
      }
    }
    if (event.target.checked === false) {
      // Find the obj object in the whereClauses array
      const obj = this.state.whereClauseSet.find((a) => a.id === currentId);
      // Remove the checkValue from the checkedList array
      obj.checkedListSet = obj.checkedListSet.filter(
        (a) => a.checkValue !== event.target.attributes.name.value
      );
      // Update the obj object in the whereClauses array
      const index = this.state.whereClauseSet.findIndex(
        (a) => a.id === currentId
      );
      this.state.whereClauseSet[index] = obj;
      this.setState(
        {
          whereClauseSet: this.state.whereClauseSet,
        },
        () => {
          this.state.whereClauseSet.sort(function (a, b) {
            return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
          });
          newWhereSetClause =  Array.from(new Set(this.state.whereClauseSet));
          // Remove duplicate entries from the whereClauses array
          this.setState({
            whereClauseSet: Array.from(new Set(this.state.whereClauseSet)),
          });
        }
      );
    }
    if (newWhereSetClause?.length){
      const currentNewWhereSetClause = newWhereSetClause.find((item)=>item.id === currentId);
      this.addCurrentWherClauseBlock(currentId,currentNewWhereSetClause)
    }
  };

  checkParenthesis(val: string) {
    let status = false;
    const brackets = ["(", ")", "[", "]", "{", "}"];
    if (brackets.includes(val.charAt(0))) {
      status = true;
    }
    return status;
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

  queryConstructor = (
    layerView,
    firstQuery,
    queryRequest,
    secondQueryTarget,
    AndOr,
    connector_function,
    layer,
    queryType = "single"
  ) => {
    const query = new Query();
    const values = secondQueryTarget;
    switch (queryRequest) {
      case "LIKE%":
        query.where = `${firstQuery} LIKE '${secondQueryTarget}%'`;
        connector_function({
          layerView,
          query,
          queryRequest,
          values,
          layer,
          AndOr,
          field: firstQuery,
          source: "singleQuery",
        });
        break;
      case "%LIKE":
        query.where = `${firstQuery} LIKE '%${secondQueryTarget}'`;
        connector_function({
          layerView,
          query,
          queryRequest,
          values,
          layer,
          AndOr,
          field: firstQuery,
          source: "singleQuery",
        });
        break;
      case "%LIKE%":
        query.where = `${firstQuery} LIKE '%${secondQueryTarget}%'`;
        connector_function({
          layerView,
          query,
          queryRequest,
          values,
          layer,
          AndOr,
          field: firstQuery,
          source: "singleQuery",
        });
        break;
      case "NOT LIKE":
        query.where = `${firstQuery} NOT LIKE '%${secondQueryTarget}%'`;
        connector_function({
          layerView,
          query,
          queryRequest,
          values,
          layer,
          AndOr,
          field: firstQuery,
          source: "singleQuery",
        });
        break;
      case "is null":
        query.where = `${firstQuery} is null`;
        connector_function({
          layerView,
          query,
          queryRequest,
          values,
          layer,
          AndOr,
          field: firstQuery,
          source: "singleQuery",
        });
        break;
      case "is not null":
        query.where = `${firstQuery} is not null`;
        connector_function({
          layerView,
          query,
          queryRequest,
          values,
          layer,
          AndOr,
          field: firstQuery,
          source: "singleQuery",
        });
        break;
      case "IN":
        if (this.containsAnyLetters(secondQueryTarget)) {
          query.where = `${firstQuery} IN (${
            "'" + secondQueryTarget.join("', '") + "'"
          })`;
          connector_function({
            layerView,
            query,
            queryRequest,
            values,
            layer,
            AndOr,
            field: firstQuery,
            source: "singleQuery",
          });
        } else {
          if (this.checkParenthesis(secondQueryTarget.join(","))) {
            const stringFiedValue = this.loopToGetString(secondQueryTarget);
            query.where = `${firstQuery} IN (${stringFiedValue})`;
          } else {
            query.where = `${firstQuery} IN (${secondQueryTarget.join(",")})`;
          }
          connector_function({
            layerView,
            query,
            queryRequest,
            values,
            layer,
            AndOr,
            field: firstQuery,
            source: "singleQuery",
          });
        }
        break;
      case "NOT_IN":
        if (this.containsAnyLetters(secondQueryTarget)) {
          query.where = `NOT ${firstQuery} IN (${
            "'" + secondQueryTarget.join("', '") + "'"
          })`;
          query.outFields = [`${firstQuery}`];
          connector_function({
            layerView,
            query,
            queryRequest,
            values,
            layer,
            AndOr,
            field: firstQuery,
            source: "singleQuery",
          });
        } else {
          if (this.checkParenthesis(secondQueryTarget.join(","))) {
            const stringFiedValue = this.loopToGetString(secondQueryTarget);
            query.where = `NOT  ${firstQuery} IN (${stringFiedValue})`;
          } else {
            query.where = `NOT  ${firstQuery} IN (${secondQueryTarget.join(
              ","
            )})`;
          }
          query.outFields = [`${firstQuery}`];
          connector_function({
            layerView,
            query,
            queryRequest,
            values,
            layer,
            AndOr,
            field: firstQuery,
            source: "singleQuery",
          });
        }
        break;
      case "included":
        query.where = `(${firstQuery} > ${secondQueryTarget.firstTxt} AND ${firstQuery} < ${secondQueryTarget.secondTxt})`;
        connector_function({
          layerView,
          query,
          queryRequest,
          values,
          layer,
          AndOr,
          field: firstQuery,
          source: "singleQuery",
        });
        break;
      case "is_not_included":
        query.where = `(${firstQuery} < ${secondQueryTarget.firstTxt} OR ${firstQuery} > ${secondQueryTarget.secondTxt})`;
        connector_function({
          layerView,
          query,
          queryRequest,
          values,
          layer,
          AndOr,
          field: firstQuery,
          source: "singleQuery",
        });
        break;
      default:
        if (this.containsAnyLetters(secondQueryTarget)) {
          query.where = `${firstQuery} ${queryRequest} '${secondQueryTarget}'`;
          connector_function({
            layerView,
            query,
            queryRequest,
            values,
            layer,
            AndOr,
            field: firstQuery,
            source: "singleQuery",
          });
        } else {
          query.where = `${firstQuery} ${queryRequest} ${secondQueryTarget}`;
          query.outFields = [`${firstQuery}`];
          connector_function({
            layerView,
            query,
            queryRequest,
            values,
            layer,
            AndOr,
            field: firstQuery,
            source: "singleQuery",
          });
        }
    }
  };

  chooseAndOr = (e) => this.setState({ AndOr: e.target.value });

  chooseAndOrSet = (e,blockId) =>{
    const currentSetBlock = [...this.state.SetBlock];
    const index = currentSetBlock.findIndex((item)=>item.blockId === blockId);
    if (index !== -1){
      const currentSetBlockItem = currentSetBlock[index];
      currentSetBlockItem["AndOrSet"] = e.target.value;
      currentSetBlock[index] = currentSetBlockItem
    }
     this.setState({ AndOrSet: e.target.value,SetBlock:currentSetBlock});
  }

  openDrop = (id) => {
    this.setState({ mouseleave: false });
    this.setState({ dropId: id });
    const dropDowns = { ...this.state.dropDowns };
    if (dropDowns[id]) {
      this.setState({ dropDowns: { ...this.state.dropDowns, [id]: false } });
    } else {
      this.setState({ dropDowns: { ...this.state.dropDowns, [id]: true } });
    }
  };

  openDropSet = (id) => {
    const currentId = id;
    this.setState({ mouseleave: false });
    this.setState({ dropIdSet:currentId });
    const dropDownsSet = { ...this.state.dropDownsSet };
    if (dropDownsSet[currentId]) {
      this.setState({dropDownsSet: { ...this.state.dropDownsSet, [currentId]: false },});
    } else {
      this.setState({dropDownsSet: { ...this.state.dropDownsSet, [currentId]: true }});
    }
  };

  closeDrop = () => this.setState({opened: false,autOpen: false,});

  closeDropOnclickOutside = () => {
    if (this.state.dropId !== null && this.state.mouseleave) {
      this.setState({dropDowns: { ...this.state.dropDowns, [this.state.dropId]: false },});
      this.setState({dropDownsSet: {...this.state.dropDownsSet,[this.state.dropIdSet]: false,},});
      this.setState({ mouseleave: false });
    }
    if (this.state.dropIdSet !== null && this.state.mouseleave) {
      this.setState({dropDownsSet: {...this.state.dropDownsSet,[this.state.dropIdSet]: false,},});
      this.setState({ mouseleave: false });
    }
  };

  onmouseLeave = () => this.setState({mouseleave: true});
  
  // methods for attribute table
  getAllCheckedLayers = () => {
    const activeView = Widget.activeV;
    const allMapLayers = activeView.view.map.allLayers?.items;
    const checkedLayers = this.state.checkedLayer_;
    let newMapLayer = [];
    if (allMapLayers?.length > 0 && checkedLayers.length > 0) {
      newMapLayer = allMapLayers.reduce((newArray, item) => {
        if (checkedLayers.includes(item.id)) {
          newArray.push(item);
        }
        return newArray;
      }, []);
    }
    return newMapLayer;
  };

  getActiveView = () => {
    const activeView = Widget.activeV;
    return activeView;
  };

  getAllJimuLayerViews = () => {
    const jimuLayerViews = Widget.jimuLayerViewz;
    return jimuLayerViews;
  };

  clearHighlights = (layerView: any) => {
    if (layerView) {
      layerView._highlightIds.clear();
    }
  };

  connector_function = async (data) => {
    const {
      layerView,
      query,
      queryRequest,
      values,
      layer,
      AndOr,
      field,
      source,
    } = data;
    if (this.state.higlightSelected.length) {
      this.clearHighlights(layerView);
      this.state.higlightSelected.forEach((highlight) => {
        highlight.remove();
      });
    }
    let results = { features: [] };
    let additionalQuery = null;
    if (source === "singleQuery") {
      additionalQuery = query.where;
      if (this.queryArray.length < this.state.whereClauses.length - 1) {
        additionalQuery = query.where + " " + AndOr;
      }
      this.queryArray.push(additionalQuery);
      this.outfields.push(`${field}`);
    }
    if (
      this.queryArray.length >= this.state.whereClauses.length ||
      source === "setQuery"
    ) {
      let currentQuery = null;
      if (this.queryArray.length) currentQuery = this.queryArray.join(" ");
      if (this.state.whereClauseSet?.length) {
        const { setQueryString, outFields } = this.sendQuerySet();
        if (source === "singleQuery") {
          if (setQueryString)
            currentQuery += " " + AndOr + " " + "(" + setQueryString + ")";
          if (outFields?.length) {
            this.outfields = this.outfields.concat(outFields);
            const set = new Set(this.outfields);
            this.outfields = Array.from(set);
          }
        } else {
          if (setQueryString) currentQuery = setQueryString;
          if (outFields?.length) this.outfields = outFields;
        }
      }
      if (!this.outfields.includes("OBJECTID")) {
        this.outfields.push("OBJECTID");
      }
      query.outFields = this.outfields;
      query.returnGeometry = true;
      query.where = currentQuery;
      try {
        results = await layer.queryFeatures(query);
      } catch (err) {
        if (layerView?.queryFeatures)
          results = await layerView.queryFeatures(query);
      }
      if (layer?.queryFeatures) results = await layer.queryFeatures(query);
      let checkedLayer_ = [data.layerView.layer.id];
      const highlightIds = helper.getHighlightedIds(results.features);
      if (highlightIds.length) {
        const higlightSelectedArr = [];
        highlightIds.forEach((el) => {
          const highlightSelected = layerView.highlight(el);
          higlightSelectedArr.push(highlightSelected);
        });
        if (results.features.length) {
          const arrayGeometry = [];
          results.features.forEach((el) => {
            const newGeometry = geometryEngine.buffer(el.geometry, 1, "meters");
            arrayGeometry.push(newGeometry);
          });
          if (arrayGeometry.length) {
            const unifiedGeomtry = geometryEngine.union(arrayGeometry);
            this.state.jimuMapView.view.goTo(unifiedGeomtry.extent);
          }
        }
        this.setState({ higlightSelected: higlightSelectedArr });
      }

      const selectedLayersContents = helper.getSelectedContentsLayer(
        [results.features],
        checkedLayer_
      );
      const numberOfAttributes = helper.getNumberOfAttributes(
        selectedLayersContents
      );
      let activeV = this.state.jimuMapView;
      this.setState({ layerContents: selectedLayersContents });
      this.setState({ checkedLayer_: checkedLayer_ });
      const geometry = Polygon.fromExtent(layerView.view.extent).toJSON();
      const layerOpen = {
        geometry: geometry,
        typeSelected: "contains",
      };
      if (results.features.length) {
        this.currentLayerView = layerView;
        const isLayerChecked = this.state.isAttributeTableClosed ? false : true;
        const allCheckedLayers = this.getAllCheckedLayers();
        this.attributeTableConnector.init({
          results: [results.features],
          allCheckedLayers: allCheckedLayers,
          isLayerChecked: isLayerChecked,
          checkedLayers: checkedLayer_,
          numberOfAttributes: numberOfAttributes,
          layerOpen: layerOpen,
        });
        this.setState({ isAttributeTableClosed: false });
        try {
          this.attributeTableConnector.dispatchingAll();
          this.setState({ itemNotFound: null });
        } catch (err) {
          if (err) this.setState({ itemNotFound: this.nls(err) });
          this.attributeTableConnector.closeTable();
          this.setState({ isAttributeTableClosed: true });
          this.returnToOriginalExtent()
        }
      } else {
        this.attributeTableConnector.closeTable();
        this.setState({
          isAttributeTableClosed: true,
          itemNotFound: this.nls("noItemSelected"),
        });
        this.returnToOriginalExtent()
      }
    }
  };

  returnToOriginalExtent = ()=>{
    const jimuMapView = this.state.jimuMapView;
    const view = jimuMapView.view;
    view.goTo({ center: view.center, zoom: Widget.initialZoom });
  }

  functionCounterIsChecked = (e, val) => {
    let counter = [...this.state.counterIsChecked];
    if (e.target.checked) {
      counter.push(val);
      this.setState({ counterIsChecked: counter });
    } else {
      let index = counter.indexOf(val);
      if (index > -1) counter.splice(index, 1);
      this.setState({ counterIsChecked: counter });
    }
  };

  functionRefresh = () => {
    const resultLayerList = this.state.resultLayerList;
    const jimuMapView = this.state.jimuMapView;
    this.init();
    this.attributeTableConnector.closeTable();
    this.setState({
      ...this.state,
      resultLayerList: resultLayerList,
      jimuMapView: jimuMapView,
      isAttributeTableClosed: true,
    });
    const view = jimuMapView.view;
    view.goTo({ center: view.center, zoom: Widget.initialZoom });
    if (this.currentLayerView) this.clearHighlights(this.currentLayerView);
  };

  //TODO config abilitare tab true/false
  render() {
    if (this.props.state === "CLOSED" && !this.state.widgetStateClosedChecked) {
      const jimuMapView = this.state.jimuMapView;
      const view = jimuMapView.view;
      const resultLayerList = this.state.resultLayerList;
      this.init();
      this.attributeTableConnector.closeTable();
      this.setState({
        ...this.state,
        resultLayerList: resultLayerList,
        jimuMapView: jimuMapView,
        isAttributeTableClosed: true,
        widgetStateOpenedChecked: false,
        widgetStateClosedChecked: true,
      });
      view.goTo({ center: view.center, zoom: Widget.initialZoom });
      if (this.currentLayerView) this.clearHighlights(this.currentLayerView);
    }
    if (this.props.state == "OPENED" && !this.state.widgetStateOpenedChecked) {
      this.setState({
        widgetStateClosedChecked: false,
        widgetStateOpenedChecked: true,
      });
    }
    return (
      <div
        className="widget-attribute-table jimu-widget"
        id="wrap"
        ref="wrap"
        onClick={(e) => {
          this.closeDropOnclickOutside();
          e.stopPropagation();
        }}
      >
        {this.props.hasOwnProperty("useMapWidgetIds") &&
          this.props.useMapWidgetIds &&
          this.props.useMapWidgetIds[0] && (
            <JimuMapViewComponent
              useMapWidgetId={this.props.useMapWidgetIds?.[0]}
              onActiveViewChange={this.activeViewChangeHandler}
            />
          )}
        <div id="search-advanced-tab-Ambito" title="Ambito">
          <div
            className="mt-4 container-fluid d-flex justify-content-between flex-column"
            style={{ height: "100%" }}
          >
            <div className="row">
              <div className="col-md-12">
                <div className="mb-2">
                  <Alert
                    className="w-100"
                    form="basic"
                    open
                    text="Selezionare prima il layer, poi continua con il costruttore della query"
                    type="info"
                    withIcon
                  />
                </div>
                <div className="mb-2">
                  <h3 className="w-100">Seleziona il layer:</h3>
                  <Select
                    onChange={this.onChangeSelectLayer}
                    placeholder="Seleziona il Layer"
                    value={this.state.currentSelectedId}
                  >
                    {this.state.resultLayerList.map((el, i) => {
                      return (
                        <Option
                          value={el.layerID}
                          parsedUrl={el.element.parsedUrl}
                          id={i}
                          key={i}
                        >
                          {el.element.title}
                        </Option>
                      );
                    })}
                  </Select>
                  {this.state.showAddSelect ? (
                    <p>
                      Visualizza le feature nel layer corrispondenti alla
                      seguente espressione
                    </p>
                  ) : (
                    <Select
                      onChange={this.chooseAndOr}
                      placeholder=" Visualizza le feature nel layer che corrispondono a tutte le espressioni seguenti"
                      defaultValue="AND"
                    >
                      <Option value="AND">
                        Visualizza le feature nel layer che corrispondono a
                        tutte le espressioni seguenti
                      </Option>
                      <Option value="OR">
                        Visualizza le feature nel layer che corrispondono ad una
                        qualsiasi delle espressioni seguenti
                      </Option>
                    </Select>
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-1 mb-3 justify-content-around">
              <div
                className="col-md-5 d-flex justify-content-center text-center"
                style={{ gap: "2%" }}
              >
                <Button
                  disabled={!this.state.currentTargetText}
                  onClick={this.addTable}
                  size="default"
                  className="d-flex align-items-center  mb-2"
                  type="secondary"
                >
                  <Icon
                    icon='<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0a.5.5 0 0 0-.5.5V7H.5a.5.5 0 0 0 0 1H7v6.5a.5.5 0 0 0 1 0V8h6.5a.5.5 0 0 0 0-1H8V.5a.5.5 0 0 0-.5-.5Z" fill="#000"></path></svg>'
                    size="m"
                  />
                  <p className="m-0 p-0">Aggiungi espressione</p>
                </Button>
                <Button
                  disabled={!this.state.currentTargetText}
                  onClick={this.addBlock}
                  size="default"
                  className="d-flex align-items-center  mb-2"
                  type="secondary"
                >
                  <Icon
                    icon='<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0a.5.5 0 0 0-.5.5V7H.5a.5.5 0 0 0 0 1H7v6.5a.5.5 0 0 0 1 0V8h6.5a.5.5 0 0 0 0-1H8V.5a.5.5 0 0 0-.5-.5Z" fill="#000"></path></svg>'
                    size="m"
                  />
                  <p className="m-0 p-0">Aggiungi set di espressioni</p>
                </Button>
              </div>
              <div className="col-md-5 d-flex justify-content-center text-center">
                <Button
                  size="default"
                  className="d-flex align-items-center mb-2"
                  type="secondary"
                  onClick={this.sendQuery}
                >
                  <p className="m-0 p-0">Applica</p>
                </Button>
                <Button
                  size="default"
                  className="d-flex align-items-center mb-2"
                  style={{ marginLeft: "5px" }}
                  type="secondary"
                  onClick={this.functionRefresh}
                >
                  <p className="m-0 p-0">Ricaricare</p>
                </Button>
              </div>
            </div>
            <div className="row" style={{ height: "50%", overflowY: "scroll" }}>
              <div className="col-md-12">
                {this.state.tables.map((el, i) => (
                  <Table
                    className="w-100"
                    key={i}
                    id={`row-${i}`}
                    list={this.state.resultsLayerSelected}
                    isOpenDropD={this.state.isOpen}
                    dropDown={() => this.dropDown(el.id)}
                    dropdownValueQuery={this.state.dropdownValueQuery}
                    isChecked={this.state.isChecked}
                    counterIsChecked={this.state.counterIsChecked}
                    checkedToQuery={this.state.checkedToQuery}
                    tables={this.state.tables}
                    tablesId={el.id}
                    whereClauses={this.state.whereClauses}
                    getQueryAttribute={this.getQueryAttribute}
                    getQuery={this.getQuery}
                    handleThirdQuery={this.thirdQuery}
                    textInputHandler={this.textInputHandler}
                    dropdownItemHandler={this.dropdownItemClick}
                    textFirstIncludedHandler={this.textFirstIncludedHandler}
                    textSecondIncludedHandler={this.textSecondIncludedHandler}
                    dropDownToggler={this.dropDown}
                    handleCheckBox={this.handleCheckBox}
                    deleteTable={() => this.deleteTable(el.id)}
                    univocoSelectHandler={this.univocoSelectHandler}
                    onChangeCheckBox={this.onChangeCheckBox}
                    openDrop={this.openDrop}
                    closeDrop={this.closeDrop}
                    opened={this.state.opened}
                    autOpen={this.state.autOpen}
                    mouseleave={this.state.mouseleave}
                    onmouseLeave={this.onmouseLeave}
                    functionCounterIsChecked={this.functionCounterIsChecked}
                    dropdowns={this.state.dropDowns}
                    itemNotFound={this.state.itemNotFound}
                  />
                ))}
                <br />
                <div
                  style={{
                    width: "98%",
                    background: "#005eca",
                    height: "10px",
                  }}
                ></div>
                <br />
                {this.state.SetBlock.map((el,index)=>
                <div id={index}>{el.tablesSet.length < 2 ? (
                  el.tablesSet.length == 1 ? <p>
                    Visualizza le feature nel layer corrispondenti alla seguente
                    espressione
                  </p>:''
                ) : (
                  
                  <div style={{display:'flex',flexDirection:'row',marginTop:'20px'}}><Select
                  onChange={(e)=>this.chooseAndOrSet(e,el.blockId)}
                  placeholder=" Visualizza le feature nel layer che corrispondono a tutte le espressioni seguenti"
                  defaultValue="AND"
                >
                  <Option value="AND">
                    Visualizza le feature nel layer che corrispondono a tutte
                    le espressioni seguenti
                  </Option>
                  <Option value="OR">
                    Visualizza le feature nel layer che corrispondono ad una
                    qualsiasi delle espressioni seguenti
                  </Option>
                </Select> 
                <div className="">
              <Button
                className=""
                onClick={()=>this.deleteBlockAll({el})}
                icon
                type='secondary'
              >
                <CloseOutlined />
              </Button>
            </div>
                
                <div className=" ">
                <Button
                  id={el.blockId}
                  onClick={this.addTwoTable}
                  className=""
                  icon
                  type="secondary"
                >
                  <PlusOutlined />
                </Button>
            
            </div></div>
                )}
                {el.tablesSet.map((innerEl, i,TableArray) => (
                  <AddSetTable
                    className="w-100"
                    key={i}
                    id={`row-${i}`}
                    list={this.state.resultsLayerSelected}
                    isOpenDropD={this.state.isOpen}
                    dropDown={() => this.dropDownSet(el.id)}
                    dropdownValueQuery={this.state.dropdownValueQuery}
                    isChecked={this.state.isChecked}
                    counterIsChecked={this.state.counterIsChecked}
                    checkedToQuery={this.state.checkedToQuery}
                    // for Add set table............................
                    tablesSet={this.state.tablesSet}
                    tablesSetId={`${innerEl.id}`+ "-"+`${el.blockId}`}
                    whereClausesSet={this.state.whereClauseSet}
                    // End for Add set table............................
                    getQueryAttribute={this.getQueryAttributeSet}
                    getQuery={this.getQuerySet}
                    handleThirdQuery={this.thirdQuery}
                    textInputHandler={this.textInputHandler}
                    dropdownItemHandler={this.dropdownItemClick}
                    textFirstIncludedHandler={this.textFirstIncludedHandler}
                    textSecondIncludedHandler={this.textSecondIncludedHandler}
                    dropDownToggler={this.dropDownSet}
                    handleCheckBox={this.handleCheckBox}
                    deleteTable={(e) => this.deleteBlock({el,innerEl})}
                    univocoSelectHandler={this.univocoSelectHandler}
                    onChangeCheckBox={this.onChangeCheckBoxSet}
                    openDrop={this.openDropSet}
                    closeDrop={this.closeDrop}
                    opened={this.state.opened}
                    autOpen={this.state.autOpen}
                    mouseleave={this.state.mouseleave}
                    onmouseLeave={this.onmouseLeave}
                    functionCounterIsChecked={this.functionCounterIsChecked}
                    dropdownsSet={this.state.dropDownsSet}
                    itemNotFound={this.state.itemNotFound}
                    showDelete={TableArray.length > 2 ? true:false}
                    showBlockDelete={TableArray.length === 2 && i==0 ? true:false }
                    blockId = {el.blockId}
                    deleteBlockAll={()=>this.deleteBlockAll({el,innerEl})}
                  />
                ))}</div>)}
                
                <br />
                <br />
                {this.state.itemNotFound && (
                  <Alert
                    className="w-100"
                    form="basic"
                    open
                    text={this.state.itemNotFound}
                    type="error"
                    withIcon
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
