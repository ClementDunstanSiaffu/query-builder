import Query from 'esri/rest/support/Query';
import {React,jsx} from 'jimu-core';
import { Button, Icon } from 'jimu-ui';
import { CallToActionContext } from '../../context/contextApi';
import '../../style.css';
import helper from '../../connector'
import Widget from '../widget';
import geometryEngine from 'esri/geometry/geometryEngine';
import Polygon from "esri/geometry/Polygon";

type PropsType = {width:number,functionRefresh:()=>void}

export default class CallToAction extends React.PureComponent<PropsType,any>{

  static contextType?: React.Context<any> = CallToActionContext;

  constructor(props:PropsType){
    super(props);
    this.sendQuery = this.sendQuery.bind(this);
    this.addBlock = this.addBlock.bind(this);
    this.addTable = this.addTable.bind(this);
    this.connector_function = this.connector_function.bind(this)
  }

  async sendQuery() {
    const self:Widget = this.context.parent;
        self.queryArray = [];
        self.outfields = [];
        const checkedQuery = [
          "is null",
          "is not null",
          "IN",
          "NOT_IN",
          "included",
          "is_not_included",
        ];
        const likelyQuery = ["LIKE%", "%LIKE", "%LIKE%", "NOT LIKE"];
        if (this.context.whereClauses.length) {
          if (this.context.AndOr === "AND") {
            this.context.whereClauses.forEach((el, id) => {
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
                value = {firstTxt: el.firstTxt.value,secondTxt: el.secondTxt.value};
              } else if (!checkedQuery.includes(queryValue)) {
                value = el.value?.txt ?? "";
              }
              if (this.context.jimuMapView) {
                this.context.jimuMapView.view.map.allLayers.forEach((f, index) => {
                  if (f.title === this.context.currentTargetText) {
                    this.context.jimuMapView.view
                      .whenLayerView(f)
                      .then((layerView) => {
                        this.queryConstructor(
                          layerView,
                          attributeQuery,
                          queryValue,
                          value,
                          this.context.AndOr,
                          // this.connector_function,
                          f
                        );
                      });
                  }
                });
              }
            });
          } else {
            let normalizedWhereToSendQuery: any = [];
            this.context.whereClauses.forEach((el, id) => {
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
                el.checkedList.forEach((el) => value.push(el.checkValue));
                if (self.containsAnyLetters(value)) {
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
                  if (self.containsAnyLetters(value)) {
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
              if (this.context.jimuMapView) {
                this.context.jimuMapView.view.map.allLayers.forEach((f, index) => {
                  if (f.title === this.context.currentTargetText) {
                    this.context.jimuMapView.view
                      .whenLayerView(f)
                      .then((layerView) => {
                        this.connector_function({
                          layerView,
                          query,
                          queryRequest: "OR",
                          layer: f,
                          AndOr: this.context.AndOr,
                          field: attributeQuery,
                          source: "singleQuery",
                        });
                      });
                  }
                });
              }
            });
          }
        } else if (this.context.SetBlock.length) {
          if (this.context.jimuMapView) {
            self.queryArray = [];
            this.context.jimuMapView.view.map.allLayers.forEach((f, index) => {
              if (f.title === this.context.currentTargetText) {
                this.context.jimuMapView.view.whenLayerView(f).then((layerView) => {
                  this.connector_function({
                    layerView,
                    query: new Query(),
                    queryRequest: null,
                    layer: f,
                    AndOr: this.context.AndOr,
                    field: null,
                    source: "setQuery",
                  });
                });
              }
            });
          }
        } else {
          self.attributeTableConnector.closeTable();
          self.setState({ isAttributeTableClosed: true });
          self.returnToOriginalExtent();
        }
  }

  queryConstructor = (
    layerView,
    firstQuery,
    queryRequest,
    secondQueryTarget,
    AndOr,
    // connector_function,
    layer,
    queryType = "single"
  ) => {
    const query = new Query();
    const values = secondQueryTarget;
    const self:Widget = this.context.parent;
    switch (queryRequest) {
      case "LIKE%":
        query.where = `${firstQuery} LIKE '${secondQueryTarget}%'`;
        this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        break;
      case "%LIKE":
        query.where = `${firstQuery} LIKE '%${secondQueryTarget}'`;
        this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        break;
      case "%LIKE%":
        query.where = `${firstQuery} LIKE '%${secondQueryTarget}%'`;
        this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        break;
      case "NOT LIKE":
        query.where = `${firstQuery} NOT LIKE '%${secondQueryTarget}%'`;
        this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        break;
      case "is null":
        query.where = `${firstQuery} is null`;
        this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        break;
      case "is not null":
        query.where = `${firstQuery} is not null`;
        this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        break;
      case "IN":
        if (self.containsAnyLetters(secondQueryTarget)) {
          query.where = `${firstQuery} IN (${"'" + secondQueryTarget.join("', '") + "'"})`;
          this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        } else {
          if (self.checkParenthesis(secondQueryTarget.join(","))) {
            const stringFiedValue = self.loopToGetString(secondQueryTarget);
            query.where = `${firstQuery} IN (${stringFiedValue})`;
          } else {
            query.where = `${firstQuery} IN (${secondQueryTarget.join(",")})`;
          }
          this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        }
        break;
      case "NOT_IN":
        if (self.containsAnyLetters(secondQueryTarget)) {
          query.where = `NOT ${firstQuery} IN (${"'" + secondQueryTarget.join("', '") + "'"})`;
          query.outFields = [`${firstQuery}`];
          this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        } else {
          if (self.checkParenthesis(secondQueryTarget.join(","))) {
            const stringFiedValue = self.loopToGetString(secondQueryTarget);
            query.where = `NOT  ${firstQuery} IN (${stringFiedValue})`;
          } else {
            query.where = `NOT  ${firstQuery} IN (${secondQueryTarget.join(",")})`;
          }
          query.outFields = [`${firstQuery}`];
          this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        }
        break;
      case "included":
        query.where = `(${firstQuery} > ${secondQueryTarget.firstTxt} AND ${firstQuery} < ${secondQueryTarget.secondTxt})`;
        this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        break;
      case "is_not_included":
        query.where = `(${firstQuery} < ${secondQueryTarget.firstTxt} OR ${firstQuery} > ${secondQueryTarget.secondTxt})`;
        this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        break;
      default:
        if (self.containsAnyLetters(secondQueryTarget)) {
          query.where = `${firstQuery} ${queryRequest} '${secondQueryTarget}'`;
          this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        } else {
          const brackets = ["(", ")", "[", "]", "{", "}"];
          if (brackets.includes(secondQueryTarget.charAt(0))) {
            const stringFiedValue = JSON.stringify(secondQueryTarget).replace(/"/g, `'`)
            query.where = `${firstQuery} ${queryRequest} (${stringFiedValue})`;
          }else{
            query.where = `${firstQuery} ${queryRequest} '${secondQueryTarget}'`;
          }
          this.connector_function({layerView,query,queryRequest,values,layer,AndOr,field: firstQuery,source: "singleQuery"});
        }
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
    const self:Widget = this.context.parent;
    if (this.context.higlightSelected.length) {
      self.clearHighlights(layerView);
      this.context.higlightSelected.forEach((highlight) => {
        highlight.remove();
      });
    }
    let results = { features: [] };
    let additionalQuery = null;
    if (source === "singleQuery") {
      additionalQuery = query.where;
      if (self.queryArray.length < this.context.whereClauses.length - 1) {
        additionalQuery = query.where + " " + AndOr;
      }
      self.queryArray.push(additionalQuery);
      self.outfields.push(`${field}`);
    }
    if (
      self.queryArray.length >= this.context.whereClauses.length ||
      source === "setQuery"
    ) {
      let currentQuery = null;
      if (self.queryArray.length) currentQuery = self.queryArray.join(" ");
      if (self.state.whereClauseSet?.length) {
        const { setQueryString, outFields } = self.sendQuerySet();
        if (source === "singleQuery") {
          if (setQueryString)
            currentQuery += " " + AndOr + " " + "(" + setQueryString + ")";
          if (outFields?.length) {
            self.outfields = self.outfields.concat(outFields);
            const set = new Set(self.outfields);
            self.outfields = Array.from(set);
          }
        } else {
          if (setQueryString) currentQuery = setQueryString;
          if (outFields?.length) self.outfields = outFields;
        }
      }
      if (!self.outfields.includes("OBJECTID")) {
        self.outfields.push("OBJECTID");
      }
      query.outFields = self.outfields;
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
            this.context.jimuMapView.view.goTo(unifiedGeomtry.extent);
          }
        }
        self.setState({ higlightSelected: higlightSelectedArr });
      }

      const selectedLayersContents = helper.getSelectedContentsLayer(
        [results.features],
        checkedLayer_
      );
      const numberOfAttributes = helper.getNumberOfAttributes(selectedLayersContents);
      let activeV = this.context.jimuMapView;
      self.setState({ layerContents: selectedLayersContents,checkedLayer_: checkedLayer_});
      // this.setState({ checkedLayer_: checkedLayer_ });
      const geometry = Polygon.fromExtent(layerView.view.extent).toJSON();
      const layerOpen = {geometry: geometry,typeSelected: "contains"};
      if (results.features.length) {
        self.currentLayerView = layerView;
        const isLayerChecked = this.context.isAttributeTableClosed ? false : true;
        const allCheckedLayers = self.getAllCheckedLayers();
        self.attributeTableConnector.init({
          results: [results.features],
          allCheckedLayers: allCheckedLayers,
          isLayerChecked: isLayerChecked,
          checkedLayers: checkedLayer_,
          numberOfAttributes: numberOfAttributes,
          layerOpen: layerOpen,
        });
        self.setState({ isAttributeTableClosed: false });
        try {
          self.attributeTableConnector.dispatchingAll();
          self.setState({ itemNotFound: null });
        } catch (err) {
          if (err) self.setState({ itemNotFound: self.nls(err) });
          self.attributeTableConnector.closeTable();
          self.setState({ isAttributeTableClosed: true });
          self.returnToOriginalExtent();
        }
      } else {
        self.attributeTableConnector.closeTable();
        self.setState({isAttributeTableClosed: true,itemNotFound:self.nls("noItemSelected"),});
        self.returnToOriginalExtent();
      }
    }
  };

  addTable = () => {
        const self = this.context.parent;
        const currentId = this.context.tableCounter;
        self.setState({
            tables: [...this.context.tables,{ id: this.context.tableCounter, deleted: false },],
            tableCounter: this.context.tableCounter + 1,
            dropDowns: { ...this.context.dropDowns, [currentId]: false },
        });
        const tableLength = this.context.tables.map((el, idx) => (el.deleted == false ? idx : "")).filter(String).length;
        const tablesSetLength = this.context.SetBlock.length;
        if (tableLength > 0) {
          self.setState({ showAddSelect: false });
        }
    
        if (tablesSetLength > 0) {
          self.setState({ showAddSelect: false });
        }
  };

  addBlock = () => {
      const self = this.context.parent;
      const SetBlock = this.context.SetBlock
      let idOne = SetBlock.tableCounterSet ?? 0;
      let idTwo = idOne + 1;
      const currentId = idOne;
      const nextCurrentId = idTwo;
      let newBlock = [...SetBlock];
      newBlock.push({
        blockId:SetBlock.length,
        [`${SetBlock.length}`]: [],
        tablesSet: [
          { id: idOne, deleted: false },
          { id: idTwo, deleted: false },
        ],
        tableCounterSet: this.context.tableCounterSet + 2,
        dropDownsSet: {
          ...this.context.dropDownsSet,
          [`${currentId}-${SetBlock.length}`]: false,
          [`${nextCurrentId}-${SetBlock.length}`]: false,
        },
        AndOrSet: this.context.AndOrSet,
      });
      self.setState({
        SetBlock:newBlock,
        dropDownsSet: {
          ...this.context.dropDownsSet,
          [`${currentId}-${SetBlock.length}`]: false,
          [`${nextCurrentId}-${SetBlock.length}`]: false,
        },
      });
  
      const tableLength = this.context.tables
        .map((el, idx) => (el.deleted == false ? idx : ""))
        .filter(String).length;
      const tablesSetLength = SetBlock.length;
  
      if (tableLength > 0) self.setState({ showAddSelect: false });
  };

    render(): React.ReactNode {
        return(
            <div 
                className={this.props.width >= 626 ? "row mt-1 mb-3 justify-content-around":" "} 
                style={this.props.width >= 626 ? {}: { display: "flex", flexDirection: "column" }}
            >
                <div 
                    className={this.props.width >= 626 ? "col-md-5 d-flex justify-content-center text-center":" "} 
                    style={this.props.width >= 626 ? { gap: "2%" }:{gap: "2%",width:"100%",display: "flex",justifyContent:"center"}}
                >
                    <Button
                        disabled={!this.context.currentTargetText}
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
                        disabled={!this.context.currentTargetText}
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
                <div 
                    className={this.props.width >= 626 ? "col-md-5 d-flex justify-content-center text-center":" "}
                    style={this.props.width >= 626 ? {}:{width: "100%",display: "flex",justifyContent: "center"}}
                >
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
                        onClick={this.props.functionRefresh}
                    >
                        <p className="m-0 p-0">Ricaricare</p>
                    </Button>
                </div>
          </div>
        )
    }
}


