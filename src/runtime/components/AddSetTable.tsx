import {Button,Option,Select,} from "jimu-ui";
import { React } from "jimu-core";
import { CloseOutlined } from "jimu-icons/outlined/editor/close";
import ReactResizeDetector from "../lib/ResizeDetector";
import {queryConstructorNumber,queryConstructorString,} from "../utils/queryTableValue";
import '../../assets/styles/styles.scss';
import CommonSecondConstructor from "./common/inputs/commonSecondConstructor";

function AddSetTable(props) {
  const {
    list,
    handleThirdQuery,
    textInputHandler,
    multiSelectHandler,
    dropdownItemHandler,
    textFirstIncludedHandler,
    textSecondIncludedHandler,
    dropdownValueQuery,
    handleCheckBox,
    isChecked,
    counterIsChecked,
    dropDownToggler,
    functionCounterIsChecked,
    checkedToQuery,
    deleteTable,
    getQueryAttribute,
    // for Add set table............................
    tablesSet,
    tablesSetId,
    whereClausesSet,
    // End for Add set table............................
    tables,
    getQuery,
    univocoSelectHandler,
    dropDown,
    isOpenDropD,
    onChangeCheckBox,
    openDrop,
    closeDrop,
    opened,
    autOpen,
    mouseleave,
    onmouseLeave,
    dropdownsSet,
    showDelete,
    blockId,
    currentTable,
    showBlockDelete,
    queryChanged,
    parent
  } = props;

  const currentwhereClausesSet = whereClausesSet.find(
    (item) => item.id === tablesSetId
  );

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

  if (currentTable.id === parseInt(tablesSetId.split("-")[0]) &&!currentTable.deleted) {
    return(
      <ReactResizeDetector handleWidth handleHeight>
        {({ width, height }) => (
            <div className="my-1">
              {list.fields ? (
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
                        counterIsChecked = {counterIsChecked}
                        functionCounterIsChecked = {functionCounterIsChecked}
                        tablesId = {tablesSetId}
                        whereClauses = {whereClausesSet}
                        dropDownToggler = {dropDownToggler}
                        univocoSelectHandler = {univocoSelectHandler}
                        dropDown = {dropDown}
                        isOpenDropD = {isOpenDropD}
                        onChangeCheckBox = {onChangeCheckBox}
                        openDrop = {openDrop}
                        closeDrop = {closeDrop}
                        opened={opened}
                        autOpen = {autOpen}
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
