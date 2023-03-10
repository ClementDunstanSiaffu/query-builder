import {
  Button,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  Input,
  Option,
  Select,
  TextInput,
} from "jimu-ui";
import { SettingOutlined } from "jimu-icons/outlined/application/setting";
import { React } from "jimu-core";
import { CloseOutlined } from "jimu-icons/outlined/editor/close";
import ReactResizeDetector from "../lib/ResizeDetector";
import {queryConstructorNumber,queryConstructorString} from "../utils/queryTableValue";
import '../../assets/styles/styles.scss';
import PaginationCompoenent from "./pagination";
import SelectUnivoco from "./common/inputs/select";

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

  const currentwhereClauses = whereClauses.find((item) => item.id === `${tablesId}`);

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

  const [currentTable,setCurrentTable] = React.useState({});
  const [onChangingPage,setOnChangingPage] = React.useState({});
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
    if (
      currentTable[tablesId]?.currentNumberOfPage === 0 && 
      copiednormalizedThirdQuery.length
    ){
      calculateTotalNumberOfPage();
      onIncrement();
    }
  },[copiednormalizedThirdQuery]);

  React.useEffect(()=>{
    if (queryChanged[tablesId] && parent){
      setCurrentTable({
        ...currentTable,
        [tablesId]:{
          "startIndex":0,
          "endIndex":0,
          "currentNumberOfPage":0,
          "totalNumberOfPage":0
      }})
      parent?.setState({queryChanged:{...queryChanged,[tablesId]:false}})
    }
  },[queryChanged])

  const calculateTotalNumberOfPage = ()=>{
    if (copiednormalizedThirdQuery.length){
      const newTotalNumberOfPage = Math.ceil(copiednormalizedThirdQuery.length/numberOfItems);
      let newCurrentTable = currentTable[tablesId];
      if (newCurrentTable){
        newCurrentTable = {...newCurrentTable,"totalNumberOfPage":newTotalNumberOfPage};
      }else{
        newCurrentTable = {"totalNumberOfPage":newTotalNumberOfPage}
      }
      setCurrentTable({...currentTable,[tablesId]:newCurrentTable})
    }
  }

  const onIncrement = ()=>{
    const currentNumberOfPage = currentTable[tablesId]?.currentNumberOfPage ?? 0;
    if (
      currentNumberOfPage < currentTable[tablesId]?.totalNumberOfPage
    ){
      const firstIndex = currentTable[tablesId]?.endIndex??0;
      const lastIndex = firstIndex + numberOfItems;
      const newcurrentNumberOfPage = currentNumberOfPage + 1;
      let newCurrentTable = currentTable[tablesId];
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
      setCurrentTable({...currentTable,[tablesId]:newCurrentTable})
      setOnChangingPage({...onChangingPage,[tablesId]:true})
    }
  }

  const onDecrement = ()=>{
    if (currentTable[tablesId]?.startIndex > 0){
      const startIndex = currentTable[tablesId].startIndex;
      const endIndex = currentTable[tablesId].endIndex;
      const currentNumberOfPage = currentTable[tablesId].currentNumberOfPage
      const firstIndex = startIndex-numberOfItems;
      const lastIndex = endIndex-numberOfItems;
      const newcurrentNumberOfPage = currentNumberOfPage - 1;
      let newCurrentTable = currentTable[tablesId];
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
      setCurrentTable({...currentTable,[tablesId]:newCurrentTable});
      setOnChangingPage({...onChangingPage,[tablesId]:true})
    }
  }

  // const test = (props) => {};
  const startIndex = currentTable[tablesId]?.startIndex??0;
  const endIndex = currentTable[tablesId]?.endIndex??10;
  return(
    <Switch queryValues={defaultValue}>
      <div 
        value={"="} 
        className = {width >= 626 ? "d-flex col-md-4" :" "} 
        style={width >= 626 ? {}:{display:'flex'}}
      >
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesId]?.startIndex??0}
            endIndex = {currentTable[tablesId]?.endIndex??0}
            tablesId = {tablesId}
            dropdowns = {dropdowns}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "single"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {currentWhereClause?.value?.txt}
          />
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
      <div value={"<>"} className={width >= 626 ? "d-flex col-md-4":" "}>
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesId]?.startIndex??0}
            endIndex = {currentTable[tablesId]?.endIndex??0}
            tablesId = {tablesId}
            dropdowns = {dropdowns}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "single"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {currentWhereClause?.value?.txt}
          />
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
        {
          <Dropdown
            activeIcon
            isOpen={dropdowns[tablesId]}
            style = {{width:"100%"}}
          >
            <DropdownButton onClick={() => openDrop(tablesId)} style = {{width:"100%"}}>
                {checked} elementi selezionati
            </DropdownButton>
            <DropdownMenu className="drop-down-menu-table">
                <DropdownItem header>Multi selezione attiva</DropdownItem>
                <DropdownItem divider  />
                {copiednormalizedThirdQuery.slice(startIndex,endIndex)?.map((el,i)=>{
                  if (el){
                    return (
                      <div >
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
                    currentPage={`${currentTable[tablesId]?.currentNumberOfPage??0}`}
                    totalNumberOfPage = {`${currentTable[tablesId]?.totalNumberOfPage}`}
                    ondecrement = {onDecrement}
                    onincrement = {onIncrement}
                  />
                </>
              </DropdownMenu>
            </Dropdown>
          }
      </div>
      <div value={"NOT_IN"} className = {width >= 626 ? "d-flex col-md-4" :" "}>
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
                if (el){
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
                }
              })}
              <>
                <PaginationCompoenent
                  currentPage={`${currentTable[tablesId]?.currentNumberOfPage??0}`}
                  totalNumberOfPage = {`${currentTable[tablesId]?.totalNumberOfPage??0}`}
                  ondecrement = {onDecrement}
                  onincrement = {onIncrement}
                />
              </>
            </DropdownMenu>
          </Dropdown>
        }
      </div>
      <div 
        value={"<="}  
        className = {width >= 626 ? "d-flex col-md-4" :" "} 
        style={width >= 626 ? {}:{display:'flex'}}
      >
        {dropdownValueQuery === "univoco" ? (
          <SelectUnivoco 
            currentPage={currentTable[tablesId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesId]?.startIndex??0}
            endIndex = {currentTable[tablesId]?.endIndex??0}
            tablesId = {tablesId}
            dropdowns = {dropdowns}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "single"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {currentWhereClause?.value?.txt}
          />
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
        <SelectUnivoco 
          currentPage={currentTable[tablesId]?.currentNumberOfPage??0}
          totalNumberOfPages = {currentTable[tablesId]?.totalNumberOfPage??0}
          onDecrement = {onDecrement}
          onIncrement = {onIncrement}
          startIndex = {currentTable[tablesId]?.startIndex??0}
          endIndex = {currentTable[tablesId]?.endIndex??0}
          tablesId = {tablesId}
          dropdowns = {dropdowns}
          openDrop = {openDrop}
          univocoSelectHandler = {univocoSelectHandler}
          data = {copiednormalizedThirdQuery}
          queryType = "single"
          onChangingPage = {onChangingPage}
          setOnChangingPage = {setOnChangingPage}
          currentValue = {currentWhereClause?.value?.txt}
        />
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
          <DropdownButton><SettingOutlined className="setting-svg" /></DropdownButton>
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
          <SelectUnivoco 
            currentPage={currentTable[tablesId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesId]?.startIndex??0}
            endIndex = {currentTable[tablesId]?.endIndex??0}
            tablesId = {tablesId}
            dropdowns = {dropdowns}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "single"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {currentWhereClause?.value?.txt}
          />
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
            <DropdownButton><SettingOutlined className="setting-svg" /></DropdownButton>
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
          <SelectUnivoco 
            currentPage={currentTable[tablesId]?.currentNumberOfPage??0}
            totalNumberOfPages = {currentTable[tablesId]?.totalNumberOfPage??0}
            onDecrement = {onDecrement}
            onIncrement = {onIncrement}
            startIndex = {currentTable[tablesId]?.startIndex??0}
            endIndex = {currentTable[tablesId]?.endIndex??0}
            tablesId = {tablesId}
            dropdowns = {dropdowns}
            openDrop = {openDrop}
            univocoSelectHandler = {univocoSelectHandler}
            data = {copiednormalizedThirdQuery}
            queryType = "single"
            onChangingPage = {onChangingPage}
            setOnChangingPage = {setOnChangingPage}
            currentValue = {currentWhereClause?.value?.txt}
          />
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
        <TextInput
          onChange={textFirstIncludedHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          data-table-id={tablesId}
          id="inputs"
          style={{width:"100%"}}
        />
        <span className="col-sm-2 text-center" style={{height:'100%',fontSize:'18px'}}>e</span>
        <TextInput
          onChange={textSecondIncludedHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          data-table-id={tablesId}
          id="inputs"
          style={{width:"100%"}}
        />
      </div>
      <div value={"is_not_included"} className={width >= 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
        <TextInput
          onChange={textFirstIncludedHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          id="inputs"
          data-table-id={tablesId}
          style={{width:"100%"}}
        />
        <span className="col-sm-2 text-center" style={{height:'100%',fontSize:'18px'}}>e</span>
        <TextInput
          onChange={textSecondIncludedHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          id="inputs"
          data-table-id={tablesId}
          style={{width:"100%"}}
        />
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
