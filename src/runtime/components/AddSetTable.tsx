import {Button,Option,Select,} from "jimu-ui";
import { React } from "jimu-core";
import { CloseOutlined } from "jimu-icons/outlined/editor/close";
import ReactResizeDetector from "../lib/ResizeDetector";
import {queryConstructorNumber,queryConstructorString,} from "../utils/queryTableValue";
import '../../assets/styles/styles.scss';
import CommonSecondConstructor from "./common/inputs/commonSecondConstructor";
import Widget from "../widget";
import { TablesContext } from "../../context/contextApi";

function AddSetTable(props) {
  const {
    textInputHandler,
    dropdownItemHandler,
    textFirstIncludedHandler,
    textSecondIncludedHandler,
    functionCounterIsChecked,
    deleteTable,
    getQueryAttribute,
    // for Add set table............................
    tablesSetId,
    whereClausesSet,
    // End for Add set table............................
    getQuery,
    univocoSelectHandler,
    closeDrop,
    onmouseLeave,
    dropdownsSet,
    showDelete,
    currentTable,
  } = props;

  const context = React.useContext(TablesContext);

  //@ts-ignore
  const {list,parent,queryChanged} = context;


  const currentwhereClausesSet = whereClausesSet.find((item) => item.id === tablesSetId);

  const onChangeCheckBoxSet = (event) => {
    const self:Widget = parent;
    let newWhereSetClause;
    let currentId = event.target.attributes.id.value;
    let objectId = event.target.attributes.value.value;
    let queryIndex;
    if (event.target.checked) {
      queryIndex = whereClausesSet.map((obj) => obj.id).indexOf(currentId);
      if (queryIndex !== -1) {
        whereClausesSet.map((obj) => {
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
              let filteredWhereClauseSet = whereClausesSet.filter(
                (a) => a.id !== obj.id
              );
              filteredWhereClauseSet.push(obj);
              newWhereSetClause = filteredWhereClauseSet;
              filteredWhereClauseSet.sort(function (a, b) {
                return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
              });
              self.setState({whereClauseSet: Array.from(new Set(filteredWhereClauseSet)),});
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
                const index = whereClausesSet.findIndex(
                  (a) => a.id === obj.id
                );
                // Remove the obj object from the whereClauses array
                whereClausesSet.splice(index, 1);
                // Add the updated obj object to the whereClauses array
                whereClausesSet.push(obj);
                newWhereSetClause = whereClausesSet;
                whereClausesSet.sort(function (a, b) {
                  return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
                });
                self.setState({whereClauseSet: Array.from(new Set(whereClausesSet))});
              }
            }
          }
          return { obj };
        });
      }
    }
    if (event.target.checked === false) {
      // Find the obj object in the whereClauses array
      const obj = whereClausesSet.find((a) => a.id === currentId);
      // Remove the checkValue from the checkedList array
      obj.checkedListSet = obj.checkedListSet.filter(
        (a) => a.checkValue !== event.target.attributes.name.value
      );
      // Update the obj object in the whereClauses array
      const index = whereClausesSet.findIndex(
        (a) => a.id === currentId
      );
      whereClausesSet[index] = obj;
      whereClausesSet.sort(function (a, b) {
        return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
      });
      newWhereSetClause = Array.from(new Set(whereClausesSet));
      self.setState({whereClauseSet: Array.from(new Set(whereClausesSet)),});
    }
    if (newWhereSetClause?.length) {
      const currentNewWhereSetClause = newWhereSetClause.find(
        (item) => item.id === currentId
      );
      self.addCurrentWherClauseBlock(currentId, currentNewWhereSetClause);
    }
  };

  const styles = {
    smallerWidthOuterContainer:{
      display: "flex",
      flexDirection: "row",
      height: "fit-content",
      alignItems:"center",
      gap:'3%',
      minWidth:'280px',
      marginBottom:20
    },
    smallerWidthInnerContainer:{
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      width:"80%",
    },
    smallerWidthQueryContainer:{
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    largerWidthOuterContainer:{
      width:"100%"
    },
    largerWidthInnerContainer:{
      display:"flex",
      alignItems:"center",
      justifyContent:"start",
      flexDirection:"row",
      gap:"3%",
    }
  }

  const openDropSet = (id) => {
    const self:Widget = parent
    const currentId = id;
    self.setState({ mouseleave: false });
    self.setState({ dropIdSet: currentId });
    const dropDownsSet = { ...dropdownsSet};
    if (dropDownsSet[currentId]) {
      self.setState({dropDownsSet: { ...dropdownsSet, [currentId]: false },});
    } else {
      self.setState({dropDownsSet: { ...dropdownsSet, [currentId]: true },});
    }
  };

  if (currentTable.id === parseInt(tablesSetId.split("-")[0]) &&!currentTable.deleted) {
    return(
      <ReactResizeDetector handleWidth handleHeight>
        {({ width, height }) => (
            <div className="my-1">
              {list?.fields ? (
                <>
                  <div style={width <= 625 ? styles.smallerWidthOuterContainer:styles.largerWidthOuterContainer}>
                    <div style = {width <= 625 ? styles.smallerWidthInnerContainer:styles.largerWidthInnerContainer}>
                      <Select
                        className={width <= 625 ? " ":"col-md-4"}
                        onChange={(e)=>getQueryAttribute(e,"set")}
                        placeholder="Seleziona campo"
                      >
                        {/* eslint-disable-next-line array-callback-return */}
                        {list.fields.map((el, i) => {
                            if (
                              el.type === "oid" ||
                              el.type === "small-integer" ||
                              el.type === "integer" ||
                              el.type === "string" ||
                              el.type === "double"
                            ) {
                              return (
                                <Option
                                  data-table-id={tablesSetId}
                                  value={i}
                                  name={el.name}
                                  dataType={el.type}
                                >
                                  {el.alias} ({el.type})
                                </Option>
                              );
                            }
                          })}
                      </Select>
                      <div
                        className={width <= 625 ? " ":"col-md-4"}
                        style = {width <= 625 ? styles.smallerWidthQueryContainer:{}}
                      >
                        <Select onChange={(e) => getQuery(e, "single")} placeholder="Seleziona campo">
                          {currentwhereClausesSet &&
                          currentwhereClausesSet.attributeQueryType === "string"
                            ? queryConstructorString.map((o, i) => {
                                return (
                                  <Option
                                    data-table-id={tablesSetId}
                                    value={i}
                                    name={o.value}
                                  >
                                    {o.name}
                                  </Option>
                                );
                              })
                            : queryConstructorNumber.map((o, i) => {
                                return (
                                  <Option
                                    data-table-id={tablesSetId}
                                    value={i}
                                    name={o.value}
                                  >
                                    {o.name}
                                  </Option>
                                );
                              })}
                        </Select>
                      </div>
                      <CommonSecondConstructor 
                        className="col-md-4"
                        textInputHandler = {textInputHandler}
                        dropdownItemHandler = {dropdownItemHandler}
                        textFirstIncludedHandler = {textFirstIncludedHandler}
                        textSecondIncludedHandler = {textSecondIncludedHandler}
                        functionCounterIsChecked = {functionCounterIsChecked}
                        tablesId = {tablesSetId}
                        whereClauses = {whereClausesSet}
                        univocoSelectHandler = {univocoSelectHandler}
                        onChangeCheckBox = {onChangeCheckBoxSet}
                        openDrop = {openDropSet}
                        closeDrop = {closeDrop}
                        onmouseLeave = {onmouseLeave}
                        dropdowns = {dropdownsSet}
                        width = {width}
                        queryChanged = {queryChanged}
                        parent = {parent}
                        queryType = "set"
                      />
                      {
                        (width >= 626 && showDelete) && <div className="" style={{}}>
                          <Button className="" onClick={deleteTable} icon><CloseOutlined /></Button>
                        </div>
                      }
                    </div>
                    {
                      (width <= 625 && showDelete) && <div className="" style={{}}>
                          <Button className="" onClick={deleteTable} icon><CloseOutlined /></Button>
                        </div>
                    }
                  </div>
                </>
              ):
                (" ")
              }
            </div>
        )}
      </ReactResizeDetector>
    )
  }
  return null;
}

export default AddSetTable;
