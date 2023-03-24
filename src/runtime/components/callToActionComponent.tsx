
import Query from 'esri/rest/support/Query';
import {React,jsx} from 'jimu-core';
import { Button, Icon } from 'jimu-ui';
import { CallToActionContext } from '../../context/contextApi';
import '../../style.css';
import helper from '../../connector'

type PropsType = {
    width:number,
    functionRefresh:()=>void
}

export default class CallToAction extends React.PureComponent<PropsType,any>{

    static contextType?: React.Context<any> = CallToActionContext;

    constructor(props:PropsType){
        super(props);
        this.sendQuery = this.sendQuery.bind(this);
        this.addBlock = this.addBlock.bind(this);
        this.addTable = this.addTable.bind(this);
    }

    async sendQuery() {
        const self = this.context.parent;
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
                        self.queryConstructor(
                          layerView,
                          attributeQuery,
                          queryValue,
                          value,
                          this.context.AndOr,
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
                        self.connector_function({
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
                  self.connector_function({
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


