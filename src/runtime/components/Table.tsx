import {Button,Option,Select} from "jimu-ui";
import { React } from "jimu-core";
import { CloseOutlined } from "jimu-icons/outlined/editor/close";
import ReactResizeDetector from "../lib/ResizeDetector";
import {queryConstructorNumber,queryConstructorString} from "../utils/queryTableValue";
import '../../assets/styles/styles.scss';
import CommonSecondConstructor from "./common/inputs/commonSecondConstructor";
import Widget from "../widget";

function Table(props) {
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
    tablesId,
    getQueryAttribute,
    whereClauses,
    tables,
    getQuery,
    univocoSelectHandler,
    dropDown,
    isOpenDropD,
    // onChangeCheckBox,
    openDrop,
    closeDrop,
    opened,
    autOpen,
    mouseleave,
    onmouseLeave,
    dropdowns,
    currentTable,
    queryChanged,
    parent
  } = props;

  const currentwhereClauses = whereClauses.find((item) => item.id === `${tablesId}`);

  const onChangeCheckBox = (event) => {
    const self:Widget = parent;
    let currentId = event.target.attributes.id.value;
    let objectId = event.target.attributes.value.value;
    let queryIndex;
    if (event.target.checked) {
      queryIndex = whereClauses
        .map((obj) => obj.id)
        .indexOf(currentId);
      if (queryIndex !== -1) {
        whereClauses.map((obj) => {
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
              let filteredWhereClauses = whereClauses.filter((a) => a.id !== obj.id);
              filteredWhereClauses.push(obj);
              filteredWhereClauses.sort(function (a, b) {
                return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
              });
              self.setState({whereClauses: Array.from(new Set(filteredWhereClauses))});
              // console.log(filteredWhereClauses,"check filtered whereclause first")
              // self.setState({whereClauses: filteredWhereClauses},
              //   () => {
              //     filteredWhereClauses.sort(function (a, b) {
              //       return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
              //     });
              //     // Remove duplicate entries from the whereClauses array
              //     self.setState({whereClauses: Array.from(new Set(filteredWhereClauses))});
              //   }
              // );
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
                const index = whereClauses.findIndex((a) => a.id === obj.id);
                // Remove the obj object from the whereClauses array
                whereClauses.splice(index, 1);
                // Add the updated obj object to the whereClauses array
                whereClauses.push(obj);
                self.setState({whereClauses: whereClauses},
                  () => {
                    whereClauses.sort(function (a, b) {
                      return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
                    });

                    // Remove duplicate entries from the whereClauses array
                    self.setState({whereClauses: Array.from(new Set(whereClauses)),
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
      const obj = whereClauses.find((a) => a.id === currentId);
      // Remove the checkValue from the checkedList array
      obj.checkedList = obj.checkedList.filter(
        (a) => a.checkValue !== event.target.attributes.name.value
      );
      // Update the obj object in the whereClauses array
      const index = whereClauses.findIndex(
        (a) => a.id === currentId
      );
      whereClauses[index] = obj;
      self.setState({whereClauses:whereClauses},
        () => {
          whereClauses.sort(function (a, b) {
            return a.id < b.id ? -1 : a.id == b.id ? 0 : 1;
          });
          // Remove duplicate entries from the whereClauses array
          self.setState({whereClauses: Array.from(new Set(whereClauses))});
        }
      );
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

  if (currentTable.id === tablesId && !currentTable.deleted) {
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
                        onChange={(e)=>getQueryAttribute(e,"single")}
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
                                  data-table-id={tablesId}
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
                          {currentwhereClauses &&
                          currentwhereClauses.attributeQueryType === "string"
                            ? queryConstructorString.map((o, i) => {
                                return (
                                  <Option
                                    data-table-id={tablesId}
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
                                    data-table-id={tablesId}
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
                        whereClauses={whereClauses}
                        tablesId={tablesId}
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
                        dropdowns={dropdowns}
                        width={width}
                        queryChanged = {queryChanged}
                        parent = {parent}
                        queryType = "single"
                      />
                        {
                          width >= 626 && <div className="" style={{}}>
                            <Button className="" onClick={deleteTable} icon><CloseOutlined /></Button>
                          </div>
                        }
                    </div>
                    {
                      width <= 625 && <div className="" style={{}}>
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

export default Table;
