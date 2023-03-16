import {
  Button,
  Checkbox,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  Input,
  MultiSelect,
  Option,
  Select,
  TextInput,
} from "jimu-ui";
import { SettingOutlined } from "jimu-icons/outlined/application/setting";
import { React } from "jimu-core";
import { CloseOutlined } from "jimu-icons/outlined/editor/close";
import ReactResizeDetector from "../lib/ResizeDetector";
import {
  queryConstructorNumber,
  queryConstructorString,
} from "../utils/queryTableValue";
import '../../assets/styles/styles.scss';
import PaginationCompoenent from "./pagination";
import SelectUnivoco from "./common/inputs/select";
import SecondConstructorAddset from "./common/inputs/secondConstructorAddset";


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


  if (
    currentTable.id === parseInt(tablesSetId.split("-")[0]) &&
    !currentTable.deleted
  ) {
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
                        onChange={getQueryAttribute}
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
                        <Select
                          onChange={(e) => getQuery(e, "single")}
                          placeholder="Seleziona campo"
                        >
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
                      <SecondConstructorAddset
                        className="col-md-4"
                        handleThirdQuery={handleThirdQuery}
                        textInputHandler={textInputHandler}
                        multiSelectHandler={multiSelectHandler}
                        dropdownItemHandler={dropdownItemHandler}
                        textFirstIncludedHandler={textFirstIncludedHandler}
                        textSecondIncludedHandler={textSecondIncludedHandler}
                        dropdownValueQuery={dropdownValueQuery}
                        handleCheckBox={handleCheckBox}
                        isChecked={isChecked}
                        counterIsChecked={counterIsChecked}
                        functionCounterIsChecked={functionCounterIsChecked}
                        checkedToQuery={checkedToQuery}
                        getQueryAttribute={getQueryAttribute}
                        whereClausesSet={whereClausesSet}
                        tablesSetId={tablesSetId}
                        dropDownToggler={dropDownToggler}
                        univocoSelectHandler={univocoSelectHandler}
                        dropDown={dropDown}
                        isOpenDropD={isOpenDropD}
                        onChangeCheckBox={onChangeCheckBox}
                        openDrop={openDrop}
                        closeDrop={closeDrop}
                        opened={opened}
                        autOpen={autOpen}
                        mouseleave={mouseleave}
                        onmouseLeave={onmouseLeave}
                        dropdownsSet={dropdownsSet}
                        blockId={blockId}
                        width={width}
                        queryChanged = {queryChanged}
                        parent = {parent}
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
