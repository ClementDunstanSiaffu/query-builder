/** @jsx jsx */
import { React, AllWidgetProps, jsx, appActions } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import { CloseOutlined } from "jimu-icons/outlined/editor/close";
import { PlusOutlined } from "jimu-icons/outlined/editor/plus";
import "../style.css";
import { Select, Option, Alert, Button, Icon } from "jimu-ui";
import defaultMessages from "./translations/default";
import { IMConfig } from "../config";
import Query from "esri/rest/support/Query";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Table from "./components/Table";
import ReactResizeDetector from "./lib/ResizeDetector";
import AttributeTableConnector from "../connector/attribute_table_connector";
import AddSetTable from "./components/AddSetTable";
import LayerSelectComponent from "./components/layerSelectComponent";
import CallToAction from "./components/callToActionComponent";
import AndOrSelector from "./components/common/andorSelector";
import {CallToActionContext,LayerSelectContext,TablesContext} from "../context/contextApi";

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
    this.getQueryAttribute = this.getQueryAttribute.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.dropdownItemClick = this.dropdownItemClick.bind(this);
    this.chooseAndOrSet = this.chooseAndOrSet.bind(this);
    this.closeDrop = this.closeDrop.bind(this);
    this.closeDropOnclickOutside = this.closeDropOnclickOutside.bind(this);
    this.onmouseLeave = this.onmouseLeave.bind(this);
    this.getAllCheckedLayers = this.getAllCheckedLayers.bind(this);
    this.getAllJimuLayerViews = this.getAllJimuLayerViews.bind(this);
    this.functionCounterIsChecked = this.functionCounterIsChecked.bind(this);
    this.getQuerySet = this.getQuerySet.bind(this);
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
      selectedId: null,
      width: 0,
      height: 0,
      queryChanged:{}
    };
  };

  nls = (id: string) => {
    return this.props.intl? this.props.intl.formatMessage({id: id,defaultMessage: defaultMessages[id]}): id;
  };

  activeViewChangeHandler(jmv: JimuMapView) {
    if (jmv) {
      jmv.view.map.add(this.graphicLayerFound);
      jmv.view.map.add(this.graphicLayerSelected);
      const resultLayerList = [];
      jmv.clearSelectedFeatures();
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
    if (this.state.isLayerSelected !== prevProps.isLayerSelected) {}
    if (this.state.whereClauses !== prevProps.whereClauses) {}
  }

  componentWillUnmount(): void {}
  /**==============================================
   * EVENT CLICK SELECT
   ==============================================*/

  removeValueFromObject(obj) {
    let newWhereClause = obj;
    if (obj?.ifInOrNotInQueryValue) {
      newWhereClause = {
        id: obj.id,
        attributeQuery: obj.attributeQuery,
        attributeQueryType: obj.attributeQueryType,
        queryValue: obj.queryValue,
        ifInOrNotInQueryValue: obj.ifInOrNotInQueryValue,
      };
    } else {
      newWhereClause = {
        id: obj.id,
        attributeQuery: obj.attributeQuery,
        attributeQueryType: obj.attributeQueryType,
        queryValue: obj.queryValue,
      };
    }
    return newWhereClause;
  }

  async getQueryAttribute(e,type="single") {
    const keytype = type === "single" ? "whereClauses" : "whereClauseSet";
    let currentWhereClause;
    const whereClauseState = this.state[keytype];
    if (!whereClauseState.length) {
      let whereClause = {
        id:e.currentTarget.attributes[1].value,
        attributeQuery: e.currentTarget.name,
        attributeQueryType:e.currentTarget.attributes.datatype.value,
        queryValue: "=",
      };
      currentWhereClause = whereClause;
      this.setState({[keytype]: [whereClause] });
    }
    if (whereClauseState.length) {
      const queryIndex = whereClauseState.map((obj) => obj.id).indexOf(e.currentTarget.attributes[1].value);
      if (queryIndex !== -1) {
        const updateState = whereClauseState.map((obj) => {
          if (obj.id === e.currentTarget.attributes[1].value) {
            obj = {
              ...obj,
              attributeQuery: e.currentTarget.name,
              attributeQueryType: e.currentTarget.attributes.datatype.value,
            };
            obj = this.removeValueFromObject(obj);
            let filteredWhereClauses = whereClauseState.filter((a) => a.id !== obj.id);
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;});
            currentWhereClause = obj;
            return this.setState({[keytype]: filteredWhereClauses });
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
        this.setState({[keytype]: [...whereClauseState,whereClause],});
        whereClauseState.sort(function (a, b) {return a.id < b.id ? -1 : a.id == b.id ? 0 : 1});
      }
    }
    this.setState({ selectedField: e.currentTarget.name }, () => {
      if (currentWhereClause)this.manipulateFieldQuery(currentWhereClause.queryValue,currentWhereClause.id,type);
    });
  }

  // for called on drop select list
  async getQuery(e, type = "single") {
    const clickedQueryTableId = e.currentTarget.attributes[1].value;
    const currentTargetName = e.currentTarget.name;
    this.manipulateFieldQuery(currentTargetName, clickedQueryTableId, type);
    this.setState({queryChanged:{...this.state.queryChanged,[clickedQueryTableId]:true}})
  }

  async manipulateFieldQuery(
    currentTargetName: string,
    clickedQueryTableId: string,
    type: string
  ) {
    let queryIndex = -1;
    let currentClickedQueryAttribute = " ";
    let newWhereSetClause;
    const keytype = type === "single" ? "whereClauses" : "whereClauseSet";
    if (this.state[keytype].length) {
      queryIndex = this.state[keytype]
        .map((obj) => obj.id)
        .indexOf(clickedQueryTableId);
      if (queryIndex !== -1) {
        const updateState = this.state[keytype].map((obj) => {
          if (obj.id === clickedQueryTableId) {
            currentClickedQueryAttribute = obj.attributeQuery;
            // obj = this.removeValueFromObject(obj)
            obj = { ...obj, queryValue: currentTargetName };
            let filteredWhereClauses = this.state[keytype].filter(
              (a) => a.id !== obj.id
            );
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            newWhereSetClause = filteredWhereClauses;
            return this.setState({ [keytype]: filteredWhereClauses });
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
                    if (obj.id === clickedQueryTableId) {
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
    if (keytype === "whereClauseSet") {
      if (newWhereSetClause?.length) {
        const currentNewWhereSetClause = newWhereSetClause.find((item) => item.id === clickedQueryTableId);
        this.addCurrentWherClauseBlock(clickedQueryTableId,currentNewWhereSetClause);
      }
    }
  }

  async getQuerySet(e, type = "single") {
    const clickedQueryTableId = e.currentTarget.attributes[1].value;
    const currentTargetName = e.currentTarget.name;
    this.manipulateFieldQuery(currentTargetName, clickedQueryTableId, "set");
    this.setState({queryChanged:{...this.state.queryChanged,[clickedQueryTableId]:true}})
  }

  //TODO la sendQuery andrà risistemata quando si aggiungerà oltre all'espressione anche il set di espressioni
  // perché ora per l'AND fa il ciclo for su ogni where inserita nell'array ma dopo sarà necessario scomporre per creare le espressioni

  addTwoTable = (blockId) => {
    let newStateBlock = [...this.state.SetBlock];
    const index = newStateBlock.findIndex((item) => item.blockId === blockId);
    if (index !== -1) {
      const currentBlock = newStateBlock[index];
      const currentId = currentBlock["tableCounterSet"];
      currentBlock["tablesSet"] = [ ...currentBlock["tablesSet"],{ id: currentId, deleted: false }];
      currentBlock["dropDownsSet"] = {...currentBlock["dropDownsSet"],[currentId]: false};
      currentBlock["tableCounterSet"] = currentBlock["tableCounterSet"] + 1;
      newStateBlock[index] = currentBlock;
    }
    if (this.state.tables.length > 0) this.setState({ showAddSelect: false });
    this.setState({ SetBlock: newStateBlock });
  };

  deleteTable = (id) => {
    let copiedTable = [...this.state.tables];
    copiedTable = copiedTable.map((el) => {
      if (el.id === id)el.deleted = true;
      return el;
    });
    const newTables = copiedTable;
    this.setState({ tableCounter: this.state.tableCounter - 1 });
    const copiedWhereClauses = [...this.state.whereClauses];
    const deletedWhereClauses = copiedWhereClauses.filter((el) => el.id !== id.toString());
    this.setState({
      tables: newTables,
      whereClauses: deletedWhereClauses,
      tableCounter: this.state.tableCounter - 1,
      selectedId: id,
    });
    if (this.state.tables.length === 0)this.setState({whereClauses:[]});
    
    const tableLength = this.state.tables.map((el, idx) => (el.deleted == false ? idx : "")).filter(String).length;
    const tablesSetLength = this.state.SetBlock.length;
    if (tableLength == 2 && tablesSetLength == 0)this.setState({ showAddSelect: false });
    
    if (tableLength == 0 && tablesSetLength > 0)this.setState({ showAddSelect: true });
    
    if (tableLength == 1 && tablesSetLength == 0)this.setState({ showAddSelect: true });

  };

  deleteBlock = (blockId: string) => {
    const copiedBlock = [...this.state.SetBlock];
    const copiedWhereclauseSet = [...this.state.whereClauseSet];
    const index = copiedBlock.findIndex((item) => item.blockId === blockId);
    if (index !== -1) {
      copiedBlock.splice(index, 1);
      this.setState({ SetBlock: copiedBlock });
    }
    if (copiedWhereclauseSet?.length) {
      copiedWhereclauseSet.filter((item) => item.id.split("-")[1] === blockId);
      this.setState({ whereClauseSet: copiedWhereclauseSet });
    }
    const tableLength = this.state.tables.map((el, idx) => (el.deleted == false ? idx : "")).filter(String).length;
    if (tableLength == 1 && copiedBlock.length == 0)this.setState({ showAddSelect: true });
  };

  deleteBlockTable = (tableBlockId: string, blockId: string) => {
    const tableId = tableBlockId.split("-")[0];
    const copiedBlock = [...this.state.SetBlock];
    const copiedWhereclauseSet = [...this.state.whereClauseSet];
    const currentBlocIndex = copiedBlock.findIndex((block) => `${block.blockId}` === blockId);
    let currentBlock;
    if (currentBlocIndex !== -1) currentBlock = copiedBlock[currentBlocIndex];
    if (currentBlock) {
      const currentWhereClauseSet = currentBlock[blockId];
      const currentTableSets = currentBlock["tablesSet"];
      if (currentWhereClauseSet?.length) {
        const copiedCurrentWhereClauseSet = [...currentWhereClauseSet];
        const whereClauseSetIndex = copiedCurrentWhereClauseSet.findIndex((item) => {
            if (item.id === tableBlockId) {
              return item;
            }
          }
        );
        if (whereClauseSetIndex !== -1) {
          copiedCurrentWhereClauseSet.splice(whereClauseSetIndex, 1);
          currentBlock[blockId] = copiedCurrentWhereClauseSet;
        }
      }
      if (currentTableSets?.length) {
        const copiedTableSets = [...currentTableSets];
        const tableSetIndex = copiedTableSets.findIndex((item) => `${item.id}` === tableId);
        if (tableSetIndex !== -1) {
          copiedTableSets[tableSetIndex]["deleted"] = true;
          currentBlock["tablesSet"] = copiedTableSets;
        }
      }
      copiedBlock[currentBlocIndex] = currentBlock;
      this.setState({ SetBlock: copiedBlock });
    }
    if (copiedWhereclauseSet?.length) {
      const index = copiedWhereclauseSet.findIndex((item) => {
        if (item.id === tableBlockId) {
          return item;
        }
      });
      if (index !== -1) {
        copiedWhereclauseSet.splice(index, 1);
        this.setState({ whereClauseSet: copiedWhereclauseSet });
      }
    }
  };

  deleteBlockAll = (blockData) => {};

  textInputHandler = (e, queryType = "single") => {
    let txt = e.target.value.trim();
    let currentTableId = e.target.attributes[0].value;
    this.queryTextConstructor(txt, currentTableId, queryType);
  };

  textFirstIncludedHandler = (e, queryType = "single") => {
    let txt = e.target.value.trim();
    let currentTableId = e.target.attributes[0].value;
    let input = "first";
    this.queryTextIncludedConstructor(txt, currentTableId, input, queryType);
  };

  textSecondIncludedHandler = (e, queryType = "single") => {
    let txt = e.target.value.trim()
    let currentTableId = e.target.attributes[0].value;
    let input = "second";
    this.queryTextIncludedConstructor(txt, currentTableId, input, queryType);
  };

  univocoSelectHandler = (currentTable:{value:any,tableId:string}, queryType = "single") => {
    let txt = currentTable.value.trim();
    let currentTableId = currentTable.tableId;
    this.queryTextConstructor(txt, currentTableId, queryType);
  };

  queryTextConstructor = (txt, currentTableId, queryType) => {
    let queryIndex;
    let newWhereSetClause;
    const keyType = queryType === "single" ? "whereClauses" : "whereClauseSet";
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
            return this.setState({ [keyType]: filteredWhereClauses });
          }
          return { obj };
        });
      }
      if (newWhereSetClause?.length) {
        const currentNewWhereSetClause = newWhereSetClause.find((item) => item.id === currentTableId
        );
        this.addCurrentWherClauseBlock(currentTableId,currentNewWhereSetClause);
      }
    }
  };

  queryTextIncludedConstructor = (txt, currentTableId, input, queryType) => {
    let queryIndex;
    let newWhereSetClause;
    const keyType = queryType === "single" ? "whereClauses" : "whereClauseSet";
    if (this.state[keyType].length) {
      queryIndex = this.state[keyType].map((obj) => obj.id).indexOf(currentTableId);
      if (queryIndex !== -1) {
        const updateState = this.state[keyType].map((obj) => {
          if (obj.id === currentTableId) {
            input === "first"
              ? (obj = { ...obj, firstTxt: { value: txt } })
              : (obj = { ...obj, secondTxt: { value: txt } });
            let filteredWhereClauses = this.state[keyType].filter((a) => a.id !== obj.id);
            filteredWhereClauses.push(obj);
            filteredWhereClauses.sort(function (a, b) {
              return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
            });
            newWhereSetClause = filteredWhereClauses;
            return this.setState({ [keyType]: filteredWhereClauses });
          }
          return { obj };
        });
      }
      if (newWhereSetClause?.length) {
        const currentNewWhereSetClause = newWhereSetClause.find((item) => item.id === currentTableId);
        this.addCurrentWherClauseBlock(currentTableId,currentNewWhereSetClause);
      }
    }
  };

  dropdownItemClick = (e, type = "single") => {
    let clickedQueryTableId = e.currentTarget.attributes[2].value;
    let clickedValue = e.currentTarget.value;
    let currentClickedQueryAttribute;
    let currentNewWhereSetClause;
    const keytype = type === "single" ? "whereClauses" : "whereClauseSet";
    let queryIndex;
    queryIndex = this.state[keytype].map((obj) => obj.id).indexOf(clickedQueryTableId);
    if (queryIndex !== -1) {
      const updateState = this.state[keytype].map((obj) => {
        if (obj.id === clickedQueryTableId) {
          obj = { ...obj, dropdownValueQuery: clickedValue };
          let filteredWhereClauses = this.state[keytype].filter((a) => a.id !== obj.id);
          filteredWhereClauses.push(obj);
          filteredWhereClauses.sort(function (a, b) {
            return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
          });
          currentNewWhereSetClause = obj;
          return this.setState({ [keytype]: filteredWhereClauses });
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
                      layerView.filter = { where: query.where };
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
                          if (typeof detailThirdQuery[0].value[0] !== "number") {
                            detailThirdQuery.sort((a, b) =>a.label < b.label ? -1 : a.label > b.label ? 1 : 0);
                          } else {
                            detailThirdQuery.sort((a, b) =>a.value - b.value < 0 ? -1 : a.value === b.value ? 0 : 1);
                          }
                          const updateState = this.state[keytype].map((obj) => {
                            if (obj.id === clickedQueryTableId) {
                              obj = {
                                ...obj,
                                ifInOrNotInQueryValue: detailThirdQuery,
                                dropdownValueQuery: clickedValue,
                              };
                              currentNewWhereSetClause = obj;
                              let filteredWhereClauses = this.state[keytype].filter((a) => a.id !== obj.id);
                              filteredWhereClauses.push(obj);
                              filteredWhereClauses.sort(function (a, b) {
                                return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
                              });
                              return this.setState({[keytype]: filteredWhereClauses});
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
        });
      }
    }
    this.setState({ dropdownValueQuery: e.target.value }, () => {});
    if (keytype === "whereClauseSet") {
      if (currentNewWhereSetClause)this.addCurrentWherClauseBlock(clickedQueryTableId,currentNewWhereSetClause);
    }
  };

  addCurrentWherClauseBlock = (currentId, currentWhereClause) => {
    const blockId = currentId.split("-")[1];
    const currentSetBlock = [...this.state.SetBlock];
    let currentBlockIndex = -1;
    let currentBlock;
    currentBlockIndex = currentSetBlock.findIndex((item) => `${item?.blockId}` === blockId);
    if (currentBlockIndex !== -1)currentBlock = currentSetBlock[currentBlockIndex];
    let currentWhereSetClause = null;
    if (currentBlock) {
      currentWhereSetClause = currentBlock[`${blockId}`];
      if (currentWhereSetClause?.length) {
        let index = -1;
        index = currentWhereSetClause.findIndex((item) => item.id === currentId);
        if (index !== -1) {
          currentWhereSetClause[index] = currentWhereClause;
        } else {
          currentWhereSetClause = [
            ...currentWhereSetClause,
            currentWhereClause,
          ];
        }
        currentBlock[blockId] = currentWhereSetClause;
        currentSetBlock[currentBlockIndex] = currentBlock;
        this.setState({ SetBlock: currentSetBlock });
      } else {
        currentBlock[blockId] = [currentWhereClause];
        currentSetBlock[currentBlockIndex] = currentBlock;
        this.setState({ SetBlock: currentSetBlock });
      }
    }
  };
  
  chooseAndOrSet = (e, blockId) => {
    const currentSetBlock = [...this.state.SetBlock];
    const index = currentSetBlock.findIndex((item) => item.blockId === blockId);
    if (index !== -1) {
      const currentSetBlockItem = currentSetBlock[index];
      currentSetBlockItem["AndOrSet"] = e.target.value;
      currentSetBlock[index] = currentSetBlockItem;
    }
    this.setState({ AndOrSet: e.target.value, SetBlock: currentSetBlock });
  };

  closeDrop = () => this.setState({ opened: false, autOpen: false });

  closeDropOnclickOutside = () => {
    if (this.state.dropId !== null && this.state.mouseleave)this.setState({ mouseleave: false });
    if (this.state.dropIdSet !== null && this.state.mouseleave)this.setState({ mouseleave: false });
  };

  onmouseLeave = () => this.setState({ mouseleave: true });

  // methods for attribute table
  getAllCheckedLayers = () => {
    const activeView = Widget.activeV;
    const allMapLayers = activeView.view.map.allLayers?.items;
    const checkedLayers = this.state.checkedLayer_;
    let newMapLayer = [];
    if (allMapLayers?.length > 0 && checkedLayers.length > 0) {
      newMapLayer = allMapLayers.reduce((newArray, item) => {
        if (checkedLayers.includes(item.id))newArray.push(item);
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
    if (layerView)layerView._highlightIds.clear();
  };

  returnToOriginalExtent = () => {
    const jimuMapView = this.state.jimuMapView;
    const view = jimuMapView.view;
    view.goTo({ center: view.center, zoom: Widget.initialZoom });
  };

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
    const tableSetCounts = (tableSetCounts: { id: string; deleted: boolean }[]) => {
      let counts = 0;
      if (tableSetCounts.length) {
        const copiedTableSetCounts = [...tableSetCounts];
        const filteredItem = copiedTableSetCounts.filter(
          (item) => !item.deleted
        );
        counts = filteredItem.length;
      }
      return counts;
    };

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
      this.setState({widgetStateClosedChecked: false,widgetStateOpenedChecked: true,});
    }
    return (
      <ReactResizeDetector handleWidth handleHeight>
        {({ width, height }) => (
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
                    <LayerSelectContext.Provider 
                      value = {{
                        parent:this,
                        jimuMapView:this.state.jimuMapView,
                        resultLayerList:this.state.resultLayerList,
                        showAddSelect:this.state.showAddSelect,
                        currentSelectedId:this.state.currentSelectedId
                      }}
                    >
                      <LayerSelectComponent />
                    </LayerSelectContext.Provider>
              
                    <CallToActionContext.Provider 
                      value = {{
                        parent:this,
                        whereClauses:this.state.whereClauses,
                        AndOr:this.state.AndOr,
                        AndOrSet:this.state.AndOrSet,
                        jimuMapView:this.state.jimuMapView,
                        SetBlock:this.state.SetBlock,
                        currentTargetText:this.state.currentTargetText,
                        tables:this.state.tables,
                        tableCounter:this.state.tableCounter,
                        tableCounterSet:this.state.tableCounterSet,
                        dropDowns:this.state.dropDowns,
                        dropDownsSet:this.state.dropDownsSet,
                        higlightSelected:this.state.higlightSelected,
                        isAttributeTableClosed:this.state.isAttributeTableClosed,
                        whereClauseSet:this.state.whereClauseSet,
                        counterIsChecked:this.state.counterIsChecked
                      }}
                    >
                      <CallToAction width={width} functionRefresh = {this.functionRefresh}/>
                    </CallToActionContext.Provider>
                      
                    <TablesContext.Provider 
                      value={{list:this.state.resultsLayerSelected,parent:this,queryChanged:this.state.queryChanged}}
                    >
                      <div className="row" style={{ height: "50%", overflowY: "scroll" }}>
                        <div className="col-md-12">
                          {this.state.tables.map((el, i) => (
                            <Table
                              className="w-100"
                              key={i}
                              id={`row-${i}`}
                              dropdownValueQuery={this.state.dropdownValueQuery}
                              tables={this.state.tables}
                              tablesId={el.id}
                              whereClauses={this.state.whereClauses}
                              getQueryAttribute={this.getQueryAttribute}
                              getQuery={this.getQuery}
                              textInputHandler={this.textInputHandler}
                              dropdownItemHandler={this.dropdownItemClick}
                              textFirstIncludedHandler={this.textFirstIncludedHandler}
                              textSecondIncludedHandler={this.textSecondIncludedHandler}
                              deleteTable={() => this.deleteTable(el.id)}
                              univocoSelectHandler={this.univocoSelectHandler}
                              closeDrop={this.closeDrop}
                              onmouseLeave={this.onmouseLeave}
                              functionCounterIsChecked={this.functionCounterIsChecked}
                              dropdowns={this.state.dropDowns}
                              selectedId={this.state.selectedId}
                              currentTable={el}
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
                          {this.state.SetBlock.map((el, index) => {
                            const counts = tableSetCounts(el.tablesSet);
                            return (
                              <div id={index}>
                                {counts < 2 ? (
                                  counts == 1 ? (
                                    <p>
                                      Visualizza le feature nel layer corrispondenti
                                      alla seguente espressione
                                    </p>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  <div
                                    className={width >= 626 ? "d-flex col-l-1 ":"d-flex col-md-8"}
                                    style={{paddingLeft:0,paddingRight:0}}
                                  >
                                    <AndOrSelector chooseAndOr={(e)=>this.chooseAndOrSet(e,el.blockId)}/>
                                    <div className="">
                                      <Button
                                        className=""
                                        onClick={() => this.deleteBlock(el.blockId)}
                                        icon
                                        type="secondary"
                                      >
                                        <CloseOutlined />
                                      </Button>
                                    </div>

                                    <div className=" ">
                                      <Button
                                        id={el.blockId}
                                        onClick={() => this.addTwoTable(el.blockId)}
                                        className=""
                                        icon
                                        type="secondary"
                                      >
                                        <PlusOutlined />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                {el.tablesSet.map((innerEl, i, TableArray) => (
                                  <AddSetTable
                                    className="w-100"
                                    key={i}
                                    id={`row-${i}`}
                                    // for Add set table............................
                                    tablesSet={this.state.tablesSet}
                                    tablesSetId={`${innerEl.id}` + "-" + `${el.blockId}`}
                                    whereClausesSet={this.state.whereClauseSet}
                                    // End for Add set table............................
                                    getQueryAttribute={this.getQueryAttribute}
                                    getQuery={this.getQuerySet}
                                    textInputHandler={this.textInputHandler}
                                    dropdownItemHandler={this.dropdownItemClick}
                                    textFirstIncludedHandler={this.textFirstIncludedHandler}
                                    textSecondIncludedHandler={this.textSecondIncludedHandler}
                                    deleteTable={(e) =>
                                      this.deleteBlockTable(`${innerEl.id}` + "-" + `${el.blockId}`,`${el.blockId}`)
                                    }
                                    univocoSelectHandler={this.univocoSelectHandler}
                                    closeDrop={this.closeDrop}
                                    onmouseLeave={this.onmouseLeave}
                                    functionCounterIsChecked={this.functionCounterIsChecked}
                                    dropdownsSet={this.state.dropDownsSet}
                                    showDelete={counts > 2 ? true : false}
                                    showBlockDelete={counts === 2 && i == 0 ? true : false}
                                    blockId={el.blockId}
                                    deleteBlockAll={() =>this.deleteBlockAll({ el, innerEl })}
                                    currentTable={innerEl}
                                  />
                                ))}
                              </div>
                            );
                          })}

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
                    </TablesContext.Provider>
                  </div>
                </div>
          </div>
        )}
      </ReactResizeDetector>
    );
  }
}
