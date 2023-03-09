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
    onChangeCheckBox,
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

  const currentwhereClauses = whereClauses.find(
    (item) => item.id === `${tablesId}`
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
                      <SecondConstructor
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
const Switch = (props) => {
  const { queryValues, children } = props;
  // filter out only children with a matching prop
  return children.find((child) => {
    return child.props.value === queryValues;
  });
};

const SecondConstructor = (props) => {

  const [startIndex,setStartIndex] = React.useState<number>(0);
  const [endIndex,setEndIndex] = React.useState<number>(0);
  const [currentNumberOfPage,setCurrentNumberOfPage] = React.useState<number>(0);
  const [totalNumberOfPage,setTotalNumberOfPage] = React.useState<number>(0);

  const numberOfItems = 10;

  const {
    textInputHandler,
    dropdownItemHandler,
    textFirstIncludedHandler,
    textSecondIncludedHandler,
    counterIsChecked,
    functionCounterIsChecked,
    tablesId,
    whereClauses,
    dropDownToggler,
    univocoSelectHandler,
    dropDown,
    isOpenDropD,
    onChangeCheckBox,
    openDrop,
    closeDrop,
    opened: d,
    autOpen,
    onmouseLeave,
    dropdowns,
    width,
    queryChanged,
    parent
  } = props;
  const normalizedThirdQuery = [];
  let defaultValue = "=";
  let dropdownValueQuery = "valore";
  let opened = false;
  let checked = 0;
  let au = true;
  let defaultTextValue = " ";
  const currentWhereClause = whereClauses.find(
    (item) => item.id === `${tablesId}`
  );
  if (currentWhereClause && currentWhereClause.ifInOrNotInQueryValue) {
    currentWhereClause.ifInOrNotInQueryValue.map((el, i) => {
      normalizedThirdQuery.push({
        id: tablesId.toString(),
        label: el.label.toString(),
        value: el.value.toString(),
        listel: currentWhereClause.checkedList,
      });
    });
  }
  if (currentWhereClause && currentWhereClause.queryValue) {
    defaultValue = currentWhereClause.queryValue;
  }
  if (currentWhereClause && currentWhereClause.dropdownValueQuery) {
    dropdownValueQuery = currentWhereClause.dropdownValueQuery;
  }
  if (currentWhereClause && currentWhereClause.isOpen) {
    // opened = whereClauses[tablesId].isOpen;
  }

  if (currentWhereClause && currentWhereClause.checkedList) {
    checked = currentWhereClause.checkedList.length;
  }

  const copiednormalizedThirdQuery = [...normalizedThirdQuery];

  React.useEffect(()=>{
    if (currentNumberOfPage === 0 && copiednormalizedThirdQuery.length){
      calculateTotalNumberOfPage();
      onIncrement();
    }
  },[copiednormalizedThirdQuery]);

  React.useEffect(()=>{
    if (queryChanged && parent){
      setStartIndex(0);
      setEndIndex(0);
      setCurrentNumberOfPage(0);
      setTotalNumberOfPage(0);
      parent?.setState({queryChanged:false})
  }
  },[queryChanged])

  const calculateTotalNumberOfPage = ()=>{
    if (copiednormalizedThirdQuery.length){
      const newTotalNumberOfPage = Math.floor(copiednormalizedThirdQuery.length/numberOfItems);
      setTotalNumberOfPage(newTotalNumberOfPage);
    }
  }

  const onIncrement = ()=>{
    const firstIndex = endIndex;
    const lastIndex = firstIndex + numberOfItems;
    const newcurrentNumberOfPage = currentNumberOfPage + 1;
    setStartIndex(firstIndex);
    setEndIndex(lastIndex);
    setCurrentNumberOfPage(newcurrentNumberOfPage);
  }

  const onDecrement = ()=>{
    if (startIndex > 0){
      const firstIndex = startIndex-numberOfItems;
      const lastIndex = endIndex-numberOfItems;
      const newcurrentNumberOfPage = currentNumberOfPage - 1;
      setStartIndex(firstIndex);
      setEndIndex(lastIndex);
      setCurrentNumberOfPage(newcurrentNumberOfPage);
    }
  }

  // const onMouseOver_ = (e,currentIndex)=>{
  //   let newFirstIndex,newLastIndex;
  //   console.log(currentIndex,"check current index")
  //   if (currentIndex === (numberOfItems-1)){
  //     newFirstIndex = endIndex;
  //     newLastIndex = endIndex+10;
  //     setStartIndex(newFirstIndex);
  //     setEndIndex(newLastIndex);
  //   }else if (currentIndex === 0){

  //   }
  // }

  // const test = (props) => {};
  return(
    <Switch queryValues={defaultValue}>
      <div 
        value={"="} 
        className = {width >= 626 ? "d-flex col-md-4" :" "} 
        style={width >= 626 ? {}:{display:'flex'}}
      >
        {dropdownValueQuery === "univoco" ? (
          <Select
            onChange={(e) => univocoSelectHandler(e, "single")}
            placeholder="Seleziona il Layer"
          >
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={textInputHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className="w-100"
            data-table-id={tablesId}
            defaultValue={defaultTextValue}
          />
        )}
        <div className="flex-shrink-1">
          <Dropdown activeIcon>
            <DropdownButton>
              <SettingOutlined className="setting-svg" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem header>Importa il tipo di input</DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                value="valore"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "single")}
                disabled
                data-table-id={tablesId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div 
        value={"<>"} 
        className={width >= 626 ? "d-flex col-md-4":" "}
      >
        {dropdownValueQuery === "univoco" ? (
          <Select
            onChange={(e) => univocoSelectHandler(e, "single")}
            placeholder="Seleziona il Layer"
          >
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={textInputHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesId}
          />
        )}
        <div className="flex-shrink-1">
          <Dropdown activeIcon>
            <DropdownButton>
              <SettingOutlined className="setting-svg" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem header>Importa il tipo di input</DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                value="valore"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "single")}
                disabled
                data-table-id={tablesId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div 
        value={"IN"} 
        onMouseLeave={() => onmouseLeave()}  
        className = {width >= 626 ? "d-flex col-md-4" :" "}
      >
        {/* <div className="w-100" style={{width:"100%",backgroundColor:"red"}}> */}
          {
            <Dropdown
              activeIcon
              isOpen={dropdowns[tablesId]}
              toggle={() => dropDown}
              style = {{width:"100%"}}
              
            >
              <DropdownButton 
                onClick={() => openDrop(tablesId)} 
                style = {{width:"100%"}}
              >
                {checked} elementi selezionati
              </DropdownButton>
              <DropdownMenu className="drop-down-menu-table">
                <DropdownItem header>Multi selezione attiva</DropdownItem>
                <DropdownItem divider  />
                {copiednormalizedThirdQuery.slice(startIndex,endIndex)?.map((el,i)=>{
                {/* {normalizedThirdQuery.map((el, i) => { */}
                  if (el){
                    return (
                      <div 
                        // onMouseOver={(e)=>onMouseOver_(e,i)}
                      >
                        <DropdownItem
                          value={i}
                          data-table-id={tablesId}
                          className="d-flex justify-content-start"
                          strategy={"fixed"}
                        >
                          {
                            <Input
                              onChange={onChangeCheckBox}
                              type="checkbox"
                              id={tablesId}
                              name={el.label}
                              value={el.value}
                              defaultChecked={
                                el.listel &&
                                el.listel.filter(function (e) {
                                  return e.checkValue === el.label;
                                }).length > 0
                              }
                            />
                          }
                          <label
                            htmlFor={tablesId}
                            className="ml-3 mb-0"
                            id={tablesId}
                          >
                            {" "}
                            {el.label}
                          </label>
                        </DropdownItem>
                      
                      </div>
                    );
                  }
                })}
                <>
                  <PaginationCompoenent
                    currentPage={`${currentNumberOfPage}`}
                    totalNumberOfPage = {`${totalNumberOfPage}`}
                    ondecrement = {onDecrement}
                    onincrement = {onIncrement}
                  />
                </>
              </DropdownMenu>
            </Dropdown>
          }
        {/* </div> */}
      </div>
      <div 
        value={"NOT_IN"} 
        className = {width >= 626 ? "d-flex col-md-4" :" "}
        // className="d-flex justify-content-between"
      >
        {/* <div className="w-100"> */}
          {
            <Dropdown
              activeIcon
              isOpen={dropdowns[tablesId]}
              toggle={() => dropDown}
              style = {{width:"100%"}}
            >
              <DropdownButton onClick={() => openDrop(tablesId)} style = {{width:"100%"}}>
                {checked} elementi selezionati
              </DropdownButton>
              <DropdownMenu className="drop-down-menu-table">
                <DropdownItem header>Multi selezione attiva</DropdownItem>
                <DropdownItem divider  />
                {copiednormalizedThirdQuery.slice(startIndex,endIndex)?.map((el,i)=>{
                {/* {normalizedThirdQuery.map((el, i) => { */}
                  if (el){
                    return (
                      <div 
                        // onMouseOver={(e)=>onMouseOver_(e,i)}
                      >
                        <DropdownItem
                          value={i}
                          data-table-id={tablesId}
                          className="d-flex justify-content-start"
                          strategy={"fixed"}
                        >
                          {
                            <Input
                              onChange={onChangeCheckBox}
                              type="checkbox"
                              id={tablesId}
                              name={el.label}
                              value={el.value}
                              defaultChecked={
                                el.listel &&
                                el.listel.filter(function (e) {
                                  return e.checkValue === el.label;
                                }).length > 0
                              }
                            />
                          }
                          <label
                            htmlFor={tablesId}
                            className="ml-3 mb-0"
                            id={tablesId}
                          >
                            {" "}
                            {el.label}
                          </label>
                        </DropdownItem>
                      
                      </div>
                    );
                  }
                })}
                <>
                  <PaginationCompoenent
                    currentPage={`${currentNumberOfPage}`}
                    totalNumberOfPage = {`${totalNumberOfPage}`}
                    ondecrement = {onDecrement}
                    onincrement = {onIncrement}
                  />
                </>
              </DropdownMenu>
              {/* <DropdownMenu>
                <DropdownItem header>Multi selezione attiva</DropdownItem>
                <DropdownItem divider />
                {normalizedThirdQuery.map((el, i) => {
                  return (
                    <div>
                      <DropdownItem
                        value={i}
                        data-table-id={tablesId}
                        className="d-flex justify-content-start"
                        strategy={"fixed"}
                      >
                        {
                          <Input
                            onChange={onChangeCheckBox}
                            type="checkbox"
                            id={tablesId}
                            name={el.label}
                            value={el.value}
                            defaultChecked={
                              el.listel &&
                              el.listel.filter(function (e) {
                                return e.checkValue === el.label;
                              }).length > 0
                            }
                          />
                        }
                        <label
                          htmlFor={tablesId}
                          className="ml-3 mb-0"
                          id={tablesId}
                        >
                          {" "}
                          {el.label}
                        </label>
                      </DropdownItem>
                    </div>
                  );
                })}
              </DropdownMenu> */}
            </Dropdown>
          }
        {/* </div> */}
      </div>
      <div 
        value={"<="}  
        className = {width >= 626 ? "d-flex col-md-4" :" "} 
        style={width >= 626 ? {}:{display:'flex'}}
      >
        {dropdownValueQuery === "univoco" ? (
          <Select
            placeholder="Seleziona il Layer"
            onChange={(e) => univocoSelectHandler(e, "single")}
          >
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={textInputHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesId}
          />
        )}
        <div className="flex-shrink-1">
          <Dropdown activeIcon>
            <DropdownButton>
              <SettingOutlined className="setting-svg" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem header>Importa il tipo di input</DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                value="valore"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "single")}
                disabled
                data-table-id={tablesId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div 
        value={">="} 
        style={width >= 626 ? {}:{display:'flex'}}
        className={width >= 626 ? "d-flex col-md-4":" "}
      >
        {dropdownValueQuery === "univoco" ? (
          <Select
            placeholder="Seleziona il Layer"
            onChange={(e) => univocoSelectHandler(e, "single")}
          >
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={textInputHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesId}
          />
        )}
        <div className="flex-shrink-1">
          <Dropdown activeIcon>
            <DropdownButton>
              <SettingOutlined className="setting-svg" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem header>Importa il tipo di input</DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                value="valore"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "single")}
                disabled
                data-table-id={tablesId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div 
        value={"<"} 
        className= {width >= 626 ? "d-flex col-md-4":" "}
        style={width >= 626 ? {}:{display:'flex'}}
      >
        {dropdownValueQuery === "univoco" ? (
          <Select
            placeholder="Seleziona il Layer"
            onChange={(e) => univocoSelectHandler(e, "single")}
          >
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={textInputHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesId}
          />
        )}
        <div className="flex-shrink-1">
          <Dropdown activeIcon>
            <DropdownButton>
              <SettingOutlined className="setting-svg" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem header>Importa il tipo di input</DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                value="valore"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "single")}
                disabled
                data-table-id={tablesId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div 
        value={">"} 
        className={width > 626 ? "d-flex col-md-4":" "}
        style={width >= 626 ? {}:{display:'flex'}}
      >
        {dropdownValueQuery === "univoco" ? (
          <Select
            placeholder="Seleziona il Layer"
            onChange={(e) => univocoSelectHandler(e, "single")}
          >
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={textInputHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesId}
          />
        )}
        <div className="flex-shrink-1">
          <Dropdown activeIcon>
            <DropdownButton>
              <SettingOutlined className="setting-svg" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem header>Importa il tipo di input</DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                value="valore"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "single")}
                disabled
                data-table-id={tablesId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "single")}
                data-table-id={tablesId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={"is null"} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}></div>
      <div value={"is not null"} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}></div>
      <div value={"included"} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <div className="include">
          <TextInput
            onChange={textFirstIncludedHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            data-table-id={tablesId}
            id="inputs"
          />
          <p className="col-md-2 text-center" style={{ width: "10%" }}>
            e
          </p>
          <TextInput
            onChange={textSecondIncludedHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            data-table-id={tablesId}
            id="inputs"
          />
        </div>
      </div>
      <div value={"is_not_included"} className={width >= 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <div className="include">
          <TextInput
            onChange={textFirstIncludedHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            id="inputs"
            data-table-id={tablesId}
          />
          <p className="col-sm-2 text-center">e</p>
          <TextInput
            onChange={textSecondIncludedHandler}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            id="inputs"
            data-table-id={tablesId}
          />
        </div>
      </div>
      <div value={"LIKE%"} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
      <div value={"%LIKE"} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
      <div value={"%LIKE%"} className={width >= 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
      <div value={"NOT LIKE"} className={width >= 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
    </Switch>
  )
};

export default Table;
