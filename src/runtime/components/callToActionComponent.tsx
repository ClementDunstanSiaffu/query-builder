
import Query from 'esri/rest/support/Query';
import {React,jsx} from 'jimu-core';
import { Button, Icon } from 'jimu-ui';
import '../../style.css'
import Widget from '../widget';
import helper from "../../connector";


type PropsType = {
    width:number,
    addTable:()=>void,
    currentTargetText:string,
    addBlock:()=>void,
    functionRefresh:()=>void,
    // sendQuery:()=>void,
    parent:Widget
}

export default class CallToAction extends React.PureComponent<PropsType,any>{

    constructor(props:PropsType){
        super(props)
        this.sendQuery = this.sendQuery.bind(this);
    }

    async sendQuery() {
        const self = this.props.parent;
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
        if (self.state.whereClauses.length) {
          if (self.state.AndOr === "AND") {
            self.state.whereClauses.forEach((el, id) => {
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
              if (self.state.jimuMapView) {
                self.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
                  if (f.title === self.state.currentTargetText) {
                    self.state.jimuMapView.view
                      .whenLayerView(f)
                      .then((layerView) => {
                        self.queryConstructor(
                          //step 2 start querying
                          layerView,
                          attributeQuery,
                          queryValue,
                          value,
                          self.state.AndOr,
                          self.connector_function,
                          f
                        );
                      });
                  }
                });
              }
            });
          } else {
            let normalizedWhereToSendQuery: any = [];
            self.state.whereClauses.forEach((el, id) => {
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
                  let queryIn = `${attributeQuery} IN (${"'" + value.join("', '") + "'"})`;
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
              if (self.state.jimuMapView) {
                self.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
                  if (f.title === self.state.currentTargetText) {
                    self.state.jimuMapView.view
                      .whenLayerView(f)
                      .then((layerView) => {
                        self.connector_function({
                          layerView,
                          query,
                          queryRequest: "OR",
                          layer: f,
                          AndOr:self.state.AndOr,
                          field: attributeQuery,
                          source: "singleQuery",
                        });
                      });
                  }
                });
              }
            });
          }
        } else if (self.state.SetBlock.length) {
          if (self.state.jimuMapView) {
            self.queryArray = [];
            self.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
              if (f.title === self.state.currentTargetText) {
                self.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
                  self.connector_function({
                    layerView,
                    query: new Query(),
                    queryRequest: null,
                    layer: f,
                    AndOr:self.state.AndOr,
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
                        disabled={!this.props.currentTargetText}
                        onClick={this.props.addTable}
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
                        disabled={!this.props.currentTargetText}
                        onClick={this.props.addBlock}
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


