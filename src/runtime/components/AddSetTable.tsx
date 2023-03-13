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
const Switch = (props) => {
  const { queryValues, children } = props;
  // filter out only children with a matching prop
  return children.find((child) => {
    return child.props.value === queryValues;
  });
};

const SecondConstructor = (props) => {
  const {
    textInputHandler,
    dropdownItemHandler,
    textFirstIncludedHandler,
    textSecondIncludedHandler,
    counterIsChecked,
    functionCounterIsChecked,
    tablesSetId,
    whereClausesSet,
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
    dropdownsSet,
    blockId,
    width,
    queryChanged,
    parent
  } = props;

  const [currentTable,setCurrentTable] = React.useState({});
  const [onChangingPage,setOnChangingPage] = React.useState({});
  const numberOfItems = 10;

  const normalizedThirdQuery = [];
  let defaultValue = "=";
  let dropdownValueQuery = "valore";
  let opened = false;
  let checked = 0;
  let au = true;
  let singleWhereClause
  // valueThirdQuery.map((el, i) => { normalizedThirdQuery.push({ label: el.label[0].toString(), value: el.value[0].toString() }) })
  if (whereClausesSet.length) {
    const currentItem = whereClausesSet.find((item) => item.id === tablesSetId);
    if (currentItem?.ifInOrNotInQueryValue) {
      currentItem.ifInOrNotInQueryValue.map((el, i) => {
        normalizedThirdQuery.push({
          id: tablesSetId.toString(),
          label: el.label.toString(),
          value: el.value.toString(),
          listel: currentItem.checkedListSet,
        });
      });
    }

    if (currentItem?.queryValue) defaultValue = currentItem.queryValue;
    if (currentItem?.dropdownValueQuery)
      dropdownValueQuery = currentItem.dropdownValueQuery;
    if (currentItem?.isOpen) {
      // opened = whereClausesSet[tablesSetId].isOpen;
    }
    if (currentItem?.checkedListSet)checked = currentItem.checkedListSet.length;

    singleWhereClause = currentItem;
  }

  const copiednormalizedThirdQuery = [...normalizedThirdQuery];

  React.useEffect(()=>{
    if (
      currentTable[tablesSetId]?.currentNumberOfPage === 0 && 
      copiednormalizedThirdQuery.length
    ){
      calculateTotalNumberOfPage();
      onIncrement();
    }
  },[copiednormalizedThirdQuery]);

  React.useEffect(()=>{
    if (queryChanged[tablesSetId] && parent){
      setCurrentTable({
        ...currentTable,
        [tablesSetId]:{
          "startIndex":0,
          "endIndex":0,
          "currentNumberOfPage":0,
          "totalNumberOfPage":0
      }})
      parent?.setState({queryChanged:{...queryChanged,[tablesSetId]:false}})
    }
  },[queryChanged])

  const calculateTotalNumberOfPage = ()=>{
    if (copiednormalizedThirdQuery.length){
      const newTotalNumberOfPage = Math.ceil(copiednormalizedThirdQuery.length/numberOfItems);
      let newCurrentTable = currentTable[tablesSetId];
      if (newCurrentTable){
        newCurrentTable = {...newCurrentTable,"totalNumberOfPage":newTotalNumberOfPage};
      }else{
        newCurrentTable = {"totalNumberOfPage":newTotalNumberOfPage}
      }
      setCurrentTable({...currentTable,[tablesSetId]:newCurrentTable})
    }
  }

  const onIncrement = ()=>{
    const currentNumberOfPage = currentTable[tablesSetId]?.currentNumberOfPage ?? 0;
    if (
      currentNumberOfPage < currentTable[tablesSetId]?.totalNumberOfPage
    ){
      const firstIndex = currentTable[tablesSetId]?.endIndex??0;
      const lastIndex = firstIndex + numberOfItems;
      const newcurrentNumberOfPage = currentNumberOfPage + 1;
      let newCurrentTable = currentTable[tablesSetId];
      if (newCurrentTable){
        newCurrentTable = {
          ...newCurrentTable, 
          "startIndex":firstIndex,
          "endIndex":lastIndex,
          "currentNumberOfPage":newcurrentNumberOfPage
        };
      }else{
        newCurrentTable = {"startIndex":firstIndex,"endIndex":lastIndex,"currentNumberOfPage":newcurrentNumberOfPage}
      }
      setCurrentTable({...currentTable,[tablesSetId]:newCurrentTable})
      setOnChangingPage({...onChangingPage,[tablesSetId]:true})
    }
  }

  const onDecrement = ()=>{
    if (currentTable[tablesSetId]?.startIndex > 0){
      const startIndex = currentTable[tablesSetId].startIndex;
      const endIndex = currentTable[tablesSetId].endIndex;
      const currentNumberOfPage = currentTable[tablesSetId].currentNumberOfPage
      const firstIndex = startIndex-numberOfItems;
      const lastIndex = endIndex-numberOfItems;
      const newcurrentNumberOfPage = currentNumberOfPage - 1;
      let newCurrentTable = currentTable[tablesSetId];
      if (newCurrentTable){
        newCurrentTable = {
          ...newCurrentTable, 
          "startIndex":firstIndex,
          "endIndex":lastIndex,
          "currentNumberOfPage":newcurrentNumberOfPage
        };
      }else{
        newCurrentTable = {"startIndex":firstIndex,"endIndex":lastIndex,"currentNumberOfPage":newcurrentNumberOfPage}
      }
      setCurrentTable({...currentTable,[tablesSetId]:newCurrentTable});
      setOnChangingPage({...onChangingPage,[tablesSetId]:true})
    }
  }

  // const test = (props) => {};
  const startIndex = currentTable[tablesSetId]?.startIndex??0;
  const endIndex = currentTable[tablesSetId]?.endIndex??10;

  return(
    <Switch queryValues={defaultValue}>
      <div 
        value={"="} 
        className = {width >= 626 ? "d-flex col-md-4" :" "} 
        style={width >= 626 ? {}:{display:'flex'}}
      >
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesSetId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesSetId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesSetId]?.startIndex??0}
            endIndex = {currentTable[tablesSetId]?.endIndex??0}
            tablesId = {tablesSetId}
            dropdowns = {dropdownsSet}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "set"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {singleWhereClause?.value?.txt}
          />
        ) : (
          <TextInput
            onChange={(e) => textInputHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className="w-100"
            data-table-id={tablesSetId}
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
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={"<>"} className={width >= 626 ? "d-flex col-md-4":" "}>
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesSetId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesSetId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesSetId]?.startIndex??0}
            endIndex = {currentTable[tablesSetId]?.endIndex??0}
            tablesId = {tablesSetId}
            dropdowns = {dropdownsSet}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "set"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {singleWhereClause?.value?.txt}
          />
        ) : (
          <TextInput
            onChange={(e) => textInputHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesSetId}
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
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={"IN"} onMouseLeave={() => onmouseLeave()}  className = {width >= 626 ? "d-flex col-md-4" :" "}>
        {/* <div className="w-100" style={{width:"100%",backgroundColor:"red"}}> */}
          {
            <Dropdown
              activeIcon
              isOpen={dropdownsSet[tablesSetId]}
              toggle={() => dropDown}
              style = {{width:"100%"}}
            >
              <DropdownButton 
                onClick={() => openDrop(tablesSetId)} 
                style = {{width:"100%"}}
              >
                {checked} elementi selezionati
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem header>Multi selezione attiva</DropdownItem>
                <DropdownItem divider />
                {copiednormalizedThirdQuery.slice(startIndex,endIndex)?.map((el,i)=>{
                  if (el){
                    return (
                      <div >
                        <DropdownItem
                          value={i}
                          data-table-id={tablesSetId}
                          className="d-flex justify-content-start"
                          strategy={"fixed"}
                        >
                          {
                            <Input
                              onChange={onChangeCheckBox}
                              type="checkbox"
                              id={tablesSetId}
                              name={el.label}
                              value={el.value}
                              checked = {
                                el.listel &&
                                el.listel.filter(function (e) {
                                  return e.checkValue === el.label;
                                }).length > 0
                              }
                              defaultChecked={
                                el.listel &&
                                el.listel.filter(function (e) {
                                  return e.checkValue === el.label;
                                }).length > 0
                              }
                            />
                          }
                          <label
                            htmlFor={tablesSetId}
                            className="ml-3 mb-0"
                            id={tablesSetId}
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
                    currentPage={`${currentTable[tablesSetId]?.currentNumberOfPage??0}`}
                    totalNumberOfPage = {`${currentTable[tablesSetId]?.totalNumberOfPage}`}
                    ondecrement = {onDecrement}
                    onincrement = {onIncrement}
                  />
                </>
              </DropdownMenu>
            </Dropdown>
          }
        {/* </div> */}
      </div>
      <div value={"NOT_IN"} className = {width >= 626 ? "d-flex col-md-4" :" "}>
        {
          <Dropdown
            activeIcon
            isOpen={dropdownsSet[tablesSetId]}
            toggle={() => dropDown}
            style = {{width:"100%"}}
          >
            <DropdownButton onClick={() => openDrop(tablesSetId)} style = {{width:"100%"}}>
              {checked} elementi selezionati
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem header>Multi selezione attiva</DropdownItem>
              <DropdownItem divider />
                {copiednormalizedThirdQuery.slice(startIndex,endIndex)?.map((el,i)=>{
                  if (el){
                    return (
                      <div >
                        <DropdownItem
                          value={i}
                          data-table-id={tablesSetId}
                          className="d-flex justify-content-start"
                          strategy={"fixed"}
                        >
                          {
                            <Input
                              onChange={onChangeCheckBox}
                              type="checkbox"
                              id={tablesSetId}
                              name={el.label}
                              value={el.value}
                              checked = {
                                el.listel &&
                                el.listel.filter(function (e) {
                                  return e.checkValue === el.label;
                                }).length > 0
                              }
                              defaultChecked={
                                el.listel &&
                                el.listel.filter(function (e) {
                                  return e.checkValue === el.label;
                                }).length > 0
                              }
                            />
                          }
                          <label
                            htmlFor={tablesSetId}
                            className="ml-3 mb-0"
                            id={tablesSetId}
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
                    currentPage={`${currentTable[tablesSetId]?.currentNumberOfPage??0}`}
                    totalNumberOfPage = {`${currentTable[tablesSetId]?.totalNumberOfPage}`}
                    ondecrement = {onDecrement}
                    onincrement = {onIncrement}
                  />
                </>
              </DropdownMenu>
            </Dropdown>
          }
      </div>
      <div value={"<="}  className = {width >= 626 ? "d-flex col-md-4" :" "} style={width >= 626 ? {}:{display:'flex'}}>
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesSetId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesSetId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesSetId]?.startIndex??0}
            endIndex = {currentTable[tablesSetId]?.endIndex??0}
            tablesId = {tablesSetId}
            dropdowns = {dropdownsSet}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "set"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {singleWhereClause?.value?.txt}
          />
        ) : (
          <TextInput
            onChange={(e) => textInputHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesSetId}
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
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={">="} style={width >= 626 ? {}:{display:'flex'}} className={width >= 626 ? "d-flex col-md-4":" "}>
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesSetId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesSetId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesSetId]?.startIndex??0}
            endIndex = {currentTable[tablesSetId]?.endIndex??0}
            tablesId = {tablesSetId}
            dropdowns = {dropdownsSet}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "set"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {singleWhereClause?.value?.txt}
          />
        ) : (
          <TextInput
            onChange={(e) => textInputHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesSetId}
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
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={"<"} className= {width >= 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}> 
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesSetId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesSetId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesSetId]?.startIndex??0}
            endIndex = {currentTable[tablesSetId]?.endIndex??0}
            tablesId = {tablesSetId}
            dropdowns = {dropdownsSet}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "set"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {singleWhereClause?.value?.txt}
          />
        ) : (
          <TextInput
            onChange={(e) => textInputHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesSetId}
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
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={">"} className={width > 626 ? "d-flex col-md-4":" "}style={width >= 626 ? {}:{display:'flex'}}>
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesSetId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesSetId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesSetId]?.startIndex??0}
            endIndex = {currentTable[tablesSetId]?.endIndex??0}
            tablesId = {tablesSetId}
            dropdowns = {dropdownsSet}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "set"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {singleWhereClause?.value?.txt}
          />
        ) : (
          <TextInput
            onChange={(e) => textInputHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesSetId}
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
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e) => dropdownItemHandler(e, "set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e) => dropdownItemHandler(e, "set")}
                data-table-id={tablesSetId}
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
        <TextInput
          onChange={(e) => textFirstIncludedHandler(e, "set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          data-table-id={tablesSetId}
          id="inputs"
          style={{width:"100%"}}
        />
        <span className="col-sm-2 text-center" style={{height:'100%',fontSize:'18px'}}>e</span>
        <TextInput
          onChange={(e) => textSecondIncludedHandler(e, "set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          data-table-id={tablesSetId}
          id="inputs"
          style={{width:"100%"}}
        />
      </div>
      <div value={"is_not_included"} className={width >= 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={(e) => textFirstIncludedHandler(e, "set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          data-table-id={tablesSetId}
          id="inputs"
          style={{width:"100%"}}
        />
        <span className="col-sm-2 text-center" style={{height:'100%',fontSize:'18px'}}>e</span>
        <TextInput
          onChange={(e) => textSecondIncludedHandler(e, "set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          data-table-id={tablesSetId}
          id="inputs"
          style={{width:"100%"}}
        />
      </div>
      <div value={"LIKE%"} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={(e) => textInputHandler(e, "set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
      <div value={"%LIKE"} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={(e) => textInputHandler(e, "set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
      <div value={"%LIKE%"} className={width >= 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={(e) => textInputHandler(e, "set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
      <div value={"NOT LIKE"} className={width >= 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={(e) => textInputHandler(e, "set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
    </Switch>
  )
};

export default AddSetTable;
