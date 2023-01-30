/** @jsx jsx */
import { React, AllWidgetProps, jsx, appActions } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import "../style.css";
import { Select, Option, Alert, Button, Icon } from "jimu-ui";
import defaultMessages from "./translations/default";
import { IMConfig } from "../config";
import Query from "esri/rest/support/Query";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Table from "./components/Table";
import helper from "../connector";
import Polygon from "esri/geometry/Polygon";

export default class Widget extends React.PureComponent<
  AllWidgetProps<IMConfig>,
  any
> {
  graphicLayerFound = new GraphicsLayer({ listMode: "hide", visible: true });
  graphicLayerSelected = new GraphicsLayer({ listMode: "hide", visible: true });

  static activeV = null;
  static jimuLayerViewz = null;
  static attribute_table_data = null;

  constructor(props) {
    super(props);
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
      whereClauses: [],
      tablesId: null,
      isOpen: false,
      AndOr: "AND",
      opened: false,
      autOpen: true,
      mouseleave: false,
      dropDowns:{},
      highlightIds:[],
      selectedField:null,
      otherQueriesValue:{},
      dropId:null
    };
    this.activeViewChangeHandler = this.activeViewChangeHandler.bind(this);
    //Layer
    this.onChangeSelectLayer = this.onChangeSelectLayer.bind(this);
    this.getQueryAttribute = this.getQueryAttribute.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.sendQuery = this.sendQuery.bind(this);
    this.thirdQuery = this.thirdQuery.bind(this);
    this.dropdownItemClick = this.dropdownItemClick.bind(this);
    this.chooseAndOr = this.chooseAndOr.bind(this);
    this.closeDrop = this.closeDrop.bind(this);
    this.openDrop = this.openDrop.bind(this);
    this.closeDropOnclickOutside = this.closeDropOnclickOutside.bind(this);
    this.onmouseLeave = this.onmouseLeave.bind(this);
    this.getAllCheckedLayers = this.getAllCheckedLayers.bind(this);
    this.getAllJimuLayerViews = this.getAllJimuLayerViews.bind(this);
    this.connector_function = this.connector_function.bind(this);
    this.functionCounterIsChecked = this.functionCounterIsChecked.bind(this);
  }

  nls = (id: string) => {
    return this.props.intl
      ? this.props.intl.formatMessage({
          id: id,
          defaultMessage: defaultMessages[id],
        })
      : id;
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
            layerView.filter = {
              where: query.where,
            };
            f.visible = false;
            layerView.visible = false;
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
      this.setState({
        resultLayerList: resultLayerList,
        jimuMapView: jmv,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLayerSelected !== prevProps.isLayerSelected) {
      // console.log("è stato selezionato un layer");
    }
    if (this.state.whereClauses !== prevProps.whereClauses) {
      // this.setState({whereClauses: this.state.whereClauses})
    }
    if (prevProps.state == "CLOSED") {
      this.setState({
        isLayerSelected: false,
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
        whereClauses: [],
        tablesId: null,
        isOpen: false,
        AndOr: "AND",
        opened: false,
        autOpen: true,
      });
    }
  }

  componentWillUnmount(): void {}
  /**==============================================
   * EVENT CLICK SELECT
   ==============================================*/

  async getQueryAttribute(e) {
    // console.log(e.currentTarget.attributes[1].value)
    if (!this.state.whereClauses.length) {
      let whereClause = {
        id: e.currentTarget.attributes[1].value,
        attributeQuery: e.currentTarget.name,
        attributeQueryType: e.currentTarget.attributes.datatype.value,
        queryValue: "=",
      };
      this.setState({
        whereClauses: [whereClause],
      });
    }
    if (this.state.whereClauses.length) {
      const queryIndex = this.state.whereClauses
        .map((obj) => obj.id)
        .indexOf(e.currentTarget.attributes[1].value);
      if (queryIndex !== -1) {
        const updateState = this.state.whereClauses.map((obj) => {
          if (obj.id === queryIndex.toString()) {
            obj = {
              ...obj,
              attributeQuery: e.currentTarget.name,
              attributeQueryType: e.currentTarget.attributes.datatype.value,
            };
            // return this.state.whereClauses[queryIndex] = obj
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
          return { obj };
        });
      } else {
        let whereClause = {
          id: e.currentTarget.attributes[1].value,
          attributeQuery: e.currentTarget.name,
          attributeQueryType: e.currentTarget.attributes.datatype.value,
        };
        this.setState({
          whereClauses: [...this.state.whereClauses, whereClause],
        });
        this.state.whereClauses.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
        });
      }
    }
    this.setState({selectedField:e.currentTarget.name})
  }

  // for called on drop select list
  async getQuery(e) {
    let clickedQueryTableId = e.currentTarget.attributes[1].value;
    let currentClickedQueryAttribute;
    let queryIndex;
    if (this.state.whereClauses.length) {
      // console.log("ci sono più query");
      queryIndex = this.state.whereClauses
        .map((obj) => obj.id)
        .indexOf(clickedQueryTableId);
      if (queryIndex !== -1) {
        const updateState = this.state.whereClauses.map((obj) => {
          if (obj.id === queryIndex.toString()) {
            currentClickedQueryAttribute = obj.attributeQuery;
            obj = { ...obj, queryValue: e.currentTarget.name };
            // return this.state.whereClauses[queryIndex] = obj
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
          return { obj };
        });
      }
    }
    if (e.currentTarget.name === "IN" || e.currentTarget.name === "NOT_IN") {
      if (this.state.jimuMapView) {
        this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
          if (f.title === this.state.currentTargetText) {
            this.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
              const query = new Query();
              query.where = `${currentClickedQueryAttribute} is not null AND OBJECTID is not null`;
              // query.outFields = [this.state.currentFirstQuery];
              query.outFields = [`${currentClickedQueryAttribute}`,"OBJECTID"];
              layerView.filter = {
                where: query.where,
              };
              // f.visible = true
              // layerView.visible = true
              const results = f.queryFeatures(query);
              results.then((result) => {
                const detailThirdQuery = [];
                result.features.forEach((el) => {
                  detailThirdQuery.push({
                    label: el.attributes[currentClickedQueryAttribute],
                    value: el.attributes["OBJECTID"],
                  });
                  // detailThirdQuery.push({
                  //   value: Object.values(el.attributes),
                  //   label: Object.values(el.attributes),
                  // });
                });
                if (queryIndex !== -1) {
                  const updateState = this.state.whereClauses.map((obj) => {
                    if (obj.id === queryIndex.toString()) {
                      obj = { ...obj, ifInOrNotInQueryValue: detailThirdQuery };
                      // return this.state.whereClauses[queryIndex] = obj
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
                    return { obj };
                  });
                }
              });
            });
          }
        });
      }
    }else{
      if (this.state.jimuMapView) {
        this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
          if (f.title === this.state.currentTargetText) {
            this.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
              const query = new Query();
              query.where = `${currentClickedQueryAttribute} is not null AND OBJECTID is not null`;
              query.outFields = [`${currentClickedQueryAttribute}`,"OBJECTID"];
              layerView.filter = {where: query.where};
              const results = f.queryFeatures(query);
              results.then((result) => {
                const detailThirdQuery = [];
                result.features.forEach((el) => {
                  detailThirdQuery.push({
                    value: el.attributes[currentClickedQueryAttribute],
                    objectId: el.attributes["OBJECTID"],
                  });
                });
                this.setState({otherQueriesValue:{...this.state.otherQueriesValue,[currentClickedQueryAttribute]:detailThirdQuery}})
              });
            });
          }
        });
      }
    }
  }

  //TODO la sendQuery andrà risistemata quando si aggiungerà oltre all'espressione anche il set di espressioni
  // perché ora per l'AND fa il ciclo for su ogni where inserita nell'array ma dopo sarà necessario scomporre per creare le espressioni

  // step1
  async sendQuery() {
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
        } else {
          value = el.value?.txt ?? "";
        }
        if (this.state.jimuMapView) {
          this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
            if (f.title === this.state.currentTargetText) {
              this.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
                this.queryConstructor(
                  //step 2 start querying
                  layerView,
                  attributeQuery,
                  queryValue,
                  value,
                  this.state.AndOr,
                  this.connector_function
                );
              });
            }
          });
        }
      });
    } else {
      const query = new Query();
      let normalizedWhereToSendQuery: any = [];
      this.state.whereClauses.forEach((el, id) => {
        let attributeQuery = el.attributeQuery;
        let queryValue = el.queryValue;
        let value;
        if (queryValue === "is null" || queryValue === "is not null") {
          let queryIn = `${attributeQuery} ${queryValue}`;
          normalizedWhereToSendQuery.push(queryIn);
        }
        if (queryValue === "IN" || queryValue === "NOT_IN") {
          value = [];
          el.checkedList.forEach((el) => value.push(el.checkValue));
          if (this.containsAnyLetters(value)) {
            let queryIn = `${attributeQuery} IN (${
              "'" + value.join("', '") + "'"
            })`;
            normalizedWhereToSendQuery.push(queryIn);
          } else {
            let queryIn = `${attributeQuery} IN (${value.join(",")})`;
            normalizedWhereToSendQuery.push(queryIn);
          }
        }
        if (queryValue === "included" || queryValue === "is_not_included") {
          let queryIn;
          queryValue === "included"
            ? (queryIn = `${attributeQuery} > ${el.firstTxt.value} AND ${attributeQuery} < ${el.secondTxt.value}`)
            : (queryIn = `${attributeQuery} < ${el.firstTxt.value} OR ${attributeQuery} > ${el.secondTxt.value}`);
          normalizedWhereToSendQuery.push(queryIn);
        } else {
          value = el.value?.txt ?? "";
          if (this.containsAnyLetters(value)) {
            let queryInput = `${attributeQuery} ${queryValue} '${value}'`;
            normalizedWhereToSendQuery.push(queryInput);
          } else {
            let queryInput = `${attributeQuery} ${queryValue} ${value}`;
            normalizedWhereToSendQuery.push(queryInput);
          }
        }
      });
      if (this.state.jimuMapView) {
        this.state.jimuMapView.view.map.allLayers.forEach((f, index) => {
          if (f.title === this.state.currentTargetText) {
            this.state.jimuMapView.view.whenLayerView(f).then((layerView) => {
              let queryOr = `${normalizedWhereToSendQuery.join(" OR ")}`;
              query.outFields = [`*`];
              layerView.filter = {
                where: query.where,
              };
              layerView.visible = true;

              // displaying  data to table
              this.connector_function({ layerView, query,queryRequest:"OR" });
            });
          }
        });
      }
    }
  }

  async thirdQuery(e) {
    // const arrChoose = []
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
    const currentId =  this.state.tableCounter
    this.setState({
      tables: [...this.state.tables, { id: this.state.tableCounter }],
      tableCounter: this.state.tableCounter + 1,
      dropDowns:{...this.state.dropDowns,[currentId]:true}
    });
  };

  addTwoTable = () => {
    this.setState({
      tables: [
        ...this.state.tables,
        { id: this.state.tableCounter },
        { id: this.state.tableCounter },
      ],
      tableCounter: this.state.tableCounter + 1,
    });
  };

  deleteTable = (id) => {
    const newTables = this.state.tables.filter((el) => {
      return el.id !== id;
    });
    const deletedWhereClauses = this.state.whereClauses.filter((el) => {
      return el.id !== id.toString();
    });
    this.setState({
      tables: [...newTables],
      whereClauses: deletedWhereClauses,
    });
    if (this.state.tables.length === 0) {
      this.setState({
        whereClauses: [],
      });
    }
  };

  textInputHandler = (e) => {
    let txt = e.target.value;
    let currentTableId = e.target.attributes[0].value;
    this.queryTextConstructor(txt, currentTableId);
  };
  textFirstIncludedHandler = (e) => {
    let txt = e.target.value;
    let currentTableId = e.target.attributes[0].value;
    let input = "first";
    this.queryTextIncludedConstructor(txt, currentTableId, input);
  };

  textSecondIncludedHandler = (e) => {
    let txt = e.target.value;
    let currentTableId = e.target.attributes[0].value;
    let input = "second";
    this.queryTextIncludedConstructor(txt, currentTableId, input);
  };
  univocoSelectHandler = (e) => {
    let txt = e.currentTarget.textContent;
    let currentTableId = e.currentTarget.attributes[2].value;
    this.queryTextConstructor(txt, currentTableId);
  };

  containsAnyLetters = (str) => {
    return /[a-zA-Z]/.test(str);
  };

  queryTextConstructor = (txt, currentTableId) => {
    let queryIndex;
    if (this.state.whereClauses.length) {
      queryIndex = this.state.whereClauses
        .map((obj) => obj.id)
        .indexOf(currentTableId);
      if (queryIndex !== -1) {
        const updateState = this.state.whereClauses.map((obj) => {
          if (obj.id === queryIndex.toString()) {
            obj = { ...obj, value: { txt: txt } };
            // return this.state.whereClauses[queryIndex] = obj
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
          return { obj };
        });
      }
    }
  };
  queryTextIncludedConstructor = (txt, currentTableId, input) => {
    let queryIndex;
    if (this.state.whereClauses.length) {
      queryIndex = this.state.whereClauses
        .map((obj) => obj.id)
        .indexOf(currentTableId);
      if (queryIndex !== -1) {
        const updateState = this.state.whereClauses.map((obj) => {
          if (obj.id === queryIndex.toString()) {
            input === "first"
              ? (obj = { ...obj, firstTxt: { value: txt } })
              : (obj = { ...obj, secondTxt: { value: txt } });
            // return this.state.whereClauses[queryIndex] = obj
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
          return { obj };
        });
      }
    }
  };

  dropdownItemClick = (e) => {
    let clickedQueryTableId = e.currentTarget.attributes[2].value;
    let clickedValue = e.currentTarget.value;
    let currentClickedQueryAttribute;
    let queryIndex;
    queryIndex = this.state.whereClauses
      .map((obj) => obj.id)
      .indexOf(clickedQueryTableId);
    if (queryIndex !== -1) {
      const updateState = this.state.whereClauses.map((obj) => {
        if (obj.id === queryIndex.toString()) {
          obj = { ...obj, dropdownValueQuery: clickedValue };
          // return this.state.whereClauses[queryIndex] = obj
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
        return { obj };
      });
    }
    if (e.currentTarget.value === "univoco") {
      if (queryIndex !== -1) {
        const updateState = this.state.whereClauses.map((obj) => {
          if (obj.id === queryIndex.toString()) {
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
                      layerView.filter = {
                        where: query.where,
                      };
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
                          const updateState = this.state.whereClauses.map(
                            (obj) => {
                              if (obj.id === queryIndex.toString()) {
                                obj = {
                                  ...obj,
                                  ifInOrNotInQueryValue: detailThirdQuery,
                                  dropdownValueQuery: clickedValue,
                                };
                                // return this.state.whereClauses[queryIndex] = obj
                                let filteredWhereClauses =
                                  this.state.whereClauses.filter(
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
                                return this.setState({
                                  whereClauses: filteredWhereClauses,
                                });
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
    this.setState({
      dropdownValueQuery: e.target.value,
    });
  };

  dropDown = (id) => {
    // e.preventDefault()
    // e.stopPropagation()
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
          // return this.state.whereClauses[queryIndex] = obj
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
                // console.log("non è presente il valore tra i checked");
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
              } else {
                // console.log(
                //   "è già presente tra i valori quindi non aggiunto alla lista"
                // );
              }
            }
          }
          return { obj };
        });
      }
      this.setState({highlightIds:[...this.state.highlightIds,objectId]});
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

  checkParenthesis (val:any){
    const regexVal = /(\d{3}|\(\d{3}\))/
    let status = false;
    if (regexVal.test(val))status = true;
    return status;
  }

  loopToGetString (stringArr:string[]){
    let newString = " ";
    if (stringArr.length){
      newString = JSON.stringify(stringArr[0]);
      newString = newString.replace(/"/g,`'`);
      for (let i = 1;i < stringArr.length;i++){
        const newStringVal = JSON.stringify(stringArr[i]).replace(/"/g,`'`);
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
    connector_function
  ) => {
    const query = new Query();
    const values = secondQueryTarget;
    // console.log(queryRequest,"check query request")
    switch (queryRequest) {
      case "LIKE%":
        query.where = `${firstQuery} LIKE '${secondQueryTarget}%'`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // f.visible = true;
        // console.log(`${firstQuery} LIKE '${secondQueryTarget}%'`);
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      case "%LIKE":
        query.where = `${firstQuery} LIKE '%${secondQueryTarget}'`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // f.visible = true;
        // console.log(`${firstQuery} LIKE '%${secondQueryTarget}'`);
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      case "%LIKE%":
        query.where = `${firstQuery} LIKE '%${secondQueryTarget}%'`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // f.visible = true;
        // console.log(`${firstQuery} LIKE '%${secondQueryTarget}'`);
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      case "NOT LIKE":
        query.where = `${firstQuery} NOT LIKE '%${secondQueryTarget}%'`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // f.visible = true;
        // console.log(`${firstQuery} NOT LIKE '%${secondQueryTarget}%'`);
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      case "is null":
        query.where = `${firstQuery} is null`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // f.visible = true;
        // console.log(`${firstQuery} is null`);
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      case "is not null":
        query.where = `${firstQuery} is not null`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // f.visible = true;
        // console.log(`${firstQuery} is not null`);
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      case "IN":
        if (this.containsAnyLetters(secondQueryTarget)) {
          query.where = `${firstQuery} IN (${
            "'" + secondQueryTarget.join("', '") + "'"
          })`;
          query.outFields = [`${firstQuery}`];
          layerView.filter = {
            where: query.where,
          };
          connector_function({ layerView, query,queryRequest,values });
          // f.visible = true;
          // console.log(
          //   `${firstQuery} IN (${"'" + secondQueryTarget.join("', '") + "'"})`
          // );
        } else {
          if (this.checkParenthesis(secondQueryTarget.join(","))){
            const stringFiedValue = this.loopToGetString(secondQueryTarget);
            query.where = `${firstQuery} IN (${stringFiedValue})`;
            // query.where = `${firstQuery} IN ("${secondQueryTarget.join(",")}")`;
            // console.log(query.where,stringFiedValue);
          }else{
            query.where = `${firstQuery} IN (${secondQueryTarget.join(",")})`;
          }
          // query.where = `${firstQuery} IN ('${secondQueryTarget.join(",")}')`;
          query.outFields = [`${firstQuery}`];
          layerView.filter = {
            where: query.where,
          };
          // f.visible = true;
          // console.log(`${firstQuery} IN (${secondQueryTarget.join(",")})`);
          layerView.visible = true;

          // displaying  data to table
          connector_function({ layerView, query,queryRequest,values });
        }

        break;
      case "NOT_IN":
        query.where = `NOT  ${firstQuery} IN ('${secondQueryTarget.join(",")}')`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // f.visible = true;
        // console.log(`NOT ${firstQuery} IN (${secondQueryTarget.join(",")})`);
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      case "included":
        query.where = `${firstQuery} > ${secondQueryTarget.firstTxt} AND ${firstQuery} < ${secondQueryTarget.secondTxt}`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // // f.visible = true;
        // console.log(
        //   `${firstQuery} > ${secondQueryTarget.firstTxt} AND ${firstQuery} < ${secondQueryTarget.secondTxt}`
        // );
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      case "is_not_included":
        query.where = `${firstQuery} < ${secondQueryTarget.firstTxt} OR ${firstQuery} > ${secondQueryTarget.secondTxt}`;
        query.outFields = [`${firstQuery}`];
        layerView.filter = {
          where: query.where,
        };
        // // f.visible = true;
        // console.log(
        //   `${firstQuery} < ${secondQueryTarget.firstTxt} OR ${firstQuery} > ${secondQueryTarget.secondTxt}`
        // );
        layerView.visible = true;

        // displaying  data to table
        connector_function({ layerView, query,queryRequest,values });
        break;
      default:
        if (this.containsAnyLetters(secondQueryTarget)) {
          query.where = `${firstQuery} ${queryRequest} '${secondQueryTarget}'`;
          query.outFields = [`${firstQuery}`];
          layerView.filter = {
            where: query.where,
          };
          // f.visible = true;
          // console.log(`${firstQuery} ${queryRequest} '${secondQueryTarget}'`);
          layerView.visible = true;

          // displaying  data to table
          connector_function({ layerView, query,queryRequest,values });
        } else {
          query.where = `${firstQuery} ${queryRequest} ${secondQueryTarget}`;
          query.outFields = [`${firstQuery}`];
          layerView.filter = {
            where: query.where,
          };
          // f.visible = true;
          // console.log(`${firstQuery} ${queryRequest} ${secondQueryTarget}`);
          layerView.visible = true;

          // displaying  data to table
          connector_function({ layerView, query,queryRequest,values });
        }
    }
  };

  chooseAndOr = (e) => {
    this.setState(
      {
        AndOr: e.target.value,
      },
      () => console.log(this.state.AndOr)
    );
  };

  openDrop = (id) => {
    this.setState({mouseleave:false});
    this.setState({dropId:id});
    const dropDowns = {...this.state.dropDowns};
    if (dropDowns[id]){
      this.setState({dropDowns:{...this.state.dropDowns,[id]:false}});
    }else{
      this.setState({dropDowns:{...this.state.dropDowns,[id]:true}});    }
  };



  closeDrop = () => {
    this.setState({
      opened: false,
      autOpen: false,
    });

    // this.autOpen=false;
  };

  closeDropOnclickOutside = () => {
    if (this.state.dropId!==null && this.state.mouseleave) {
      this.setState({dropDowns:{...this.state.dropDowns,[this.state.dropId]:false}});
      this.setState({mouseleave:false});
    }
  };

  onmouseLeave = () => {
      this.setState({
        mouseleave: true,
      });
  };

  
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

  connector_function = async (data) => {
    const requiredRequest = ["IN","NOT_IN"]
    const { layerView, query,queryRequest,values} = data;
    // if (!query.outFields.includes("OBJECTID") && query.outFields[0] !== "*" )query.outFields = [...query.outFields,"OBJECTID"]
    const results = await layerView.queryFeatures(query);
    let checkedLayer_ = [data.layerView.layer.id];
    let highlightIds = this.state.highlightIds;
    if (!requiredRequest.includes(queryRequest)){
      let currentValue = values
      if (!Array.isArray(currentValue)){
        currentValue = [values];
      }
      const currentField = query.outFields[0]
      const otherQueriesValueArr = this.state.otherQueriesValue[currentField]??[];
      highlightIds = helper.getHighlightedIds(currentValue,otherQueriesValueArr);
    }
    if (highlightIds.length){
      highlightIds.forEach(el => {
        layerView.highlight(el);
      });
      // results.features.forEach(el => {
      //   layerView.highlight(el.attributes.OBJECTID)
      //   // console.log(el.attributes,"check el")
      //   // // console.log(el.attributes.OBJECTID,"check layer")
      //   // // layerView.highlight(el.attributes.OBJECTID);
      // });
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
    const geometry = Polygon.fromExtent(activeV.view.extent).toJSON();
    const layerOpen = {
      geometry: geometry,
      typeSelected: "contains",
    };
    this.props.dispatch(
      appActions.widgetStatePropChange("value", "createTable", true)
    );
    if (Object.keys(numberOfAttributes).length > 0) {
      this.props.dispatch(
        appActions.widgetStatePropChange("value", "createTable", true)
      );
      this.props.dispatch(
        appActions.widgetStatePropChange(
          "value",
          "numberOfAttribute",
          numberOfAttributes
        )
      );
      this.props.dispatch(
        appActions.widgetStatePropChange("value", "layerOpen", layerOpen)
      );
      this.props.dispatch(
        appActions.widgetStatePropChange(
          "value",
          "getAllLayers",
          this.getAllCheckedLayers
        )
      );
      this.props.dispatch(
        appActions.widgetStatePropChange(
          "value",
          "getActiveView",
          this.getActiveView
        )
      );
      this.props.dispatch(
        appActions.widgetStatePropChange(
          "value",
          "getAllJimuLayerViews",
          this.getAllJimuLayerViews
        )
      );
    } else {
      this.props.dispatch(
        appActions.widgetStatePropChange("value", "showAlert", true)
      );
    }
  };

  functionCounterIsChecked = (e,val)=>{
    let counter = [...this.state.counterIsChecked];
if(e.target.checked){
  counter.push(val);
  this.setState({counterIsChecked:counter});
}else{
  let index = counter.indexOf(val);
  if(index>-1) counter.splice(index,1);
  this.setState({counterIsChecked:counter});}
  }
  

  //TODO config abilitare tab true/false
  render() {
    // console.log(this.state.otherQueriesValue,"check other values")
    return (
      <div
        className="widget-attribute-table jimu-widget"
        id="wrap"
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
                  {this.state.tables.length < 2 ? (
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
              <div className="col-md-5 d-flex justify-content-center text-center">
                <Button
                  disabled={!this.state.currentTargetText}
                  onClick={this.addTable}
                  size="default"
                  className="d-flex align-items-center  mb-2"
                  type="primary"
                >
                  <Icon
                    icon='<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0a.5.5 0 0 0-.5.5V7H.5a.5.5 0 0 0 0 1H7v6.5a.5.5 0 0 0 1 0V8h6.5a.5.5 0 0 0 0-1H8V.5a.5.5 0 0 0-.5-.5Z" fill="#000"></path></svg>'
                    size="m"
                  />
                  <p className="m-0 p-0">Aggiungi espressione</p>
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
                    dropdowns = {this.state.dropDowns}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
