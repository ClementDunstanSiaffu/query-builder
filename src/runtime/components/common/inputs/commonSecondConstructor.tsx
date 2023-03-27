

import {
    Dropdown,
    DropdownButton,
    DropdownItem,
    DropdownMenu,
    Input,
    TextInput,
  } from "jimu-ui";
import { SettingOutlined } from "jimu-icons/outlined/application/setting";
import { React } from "jimu-core";
import '../../../../assets/styles/styles.scss'
import PaginationCompoenent from "../../pagination";
import SelectUnivoco from "./select";

const CommonSecondConstructor = (props) => {

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
      // dropDown,
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
      parent,
      queryType
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
          listel: currentWhereClause.checkedList??currentWhereClause.checkedListSet,
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

    
    const checkedList = currentWhereClause?.checkedList;
    const checkedListSet = currentWhereClause?.checkedListSet;
    if (checkedList?.length){
        checked = checkedList.length
    }else if (checkedListSet?.length){
        checked = checkedListSet.length
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
  
    const startIndex = currentTable[tablesId]?.startIndex??0;
    const endIndex = currentTable[tablesId]?.endIndex??10;
  
    const queriesWithUnivoco = ["=","<>","<=",">=","<",">"];
    const queriesWithMultiselect = ["IN","NOT_IN"];
    const queriesWithNothing = ["is null","is not null"];
    const queriesWithTwoInputs = ["included","is_not_included"];
    const queriesWithSingleInput = ["LIKE%","%LIKE","%LIKE%","NOT LIKE"];
  
    return(
      <>
        {
          queriesWithUnivoco.includes(defaultValue) && 
          <div value={defaultValue} className = {width >= 626 ? "d-flex col-md-4" :" "} style={width >= 626 ? {}:{display:'flex'}}>
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
                queryType = {queryType??"single"}
                onChangingPage = {onChangingPage}
                setOnChangingPage = {setOnChangingPage}
                currentValue = {currentWhereClause?.value?.txt}
              />
            ) : (
              <TextInput
                onChange={(e)=>textInputHandler(e,queryType??"single")}
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
                    onClick={(e) => dropdownItemHandler(e, queryType??"single")}
                    data-table-id={tablesId}
                  >
                    Valore
                  </DropdownItem>
                  <DropdownItem
                    value="campo"
                    onClick={(e) => dropdownItemHandler(e,queryType??"single")}
                    disabled
                    data-table-id={tablesId}
                  >
                    Campo
                  </DropdownItem>
                  <DropdownItem
                    value="univoco"
                    onClick={(e) => dropdownItemHandler(e,queryType??"single")}
                    data-table-id={tablesId}
                  >
                    Univoci
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        }
        {
          queriesWithMultiselect.includes(defaultValue) &&
          <div value={defaultValue} onMouseLeave={() => onmouseLeave()} className = {width >= 626 ? "d-flex col-md-4" :" "}>
            {
              <Dropdown activeIcon isOpen={dropdowns[tablesId]} style = {{width:"100%"}}>
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
        }
        {
          queriesWithNothing.includes(defaultValue) && 
          <div value={defaultValue} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
          </div>
        }
        {
          queriesWithTwoInputs.includes(defaultValue) && 
          <div value={defaultValue} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
            <TextInput
              onChange={(e)=>textFirstIncludedHandler(e,queryType??"single")}
              onAcceptValue={function noRefCheck() {}}
              type="text"
              data-table-id={tablesId}
              id="inputs"
              style={{width:"100%"}}
            />
            <span className="col-sm-2 text-center" style={{height:'100%',fontSize:'18px'}}>e</span>
            <TextInput
              onChange={(e)=>textSecondIncludedHandler(e,queryType??"single")}
              onAcceptValue={function noRefCheck() {}}
              type="text"
              data-table-id={tablesId}
              id="inputs"
              style={{width:"100%"}}
            />
          </div>
        }
        {
          queriesWithSingleInput.includes(defaultValue) && 
          <div value={defaultValue} className={width > 626 ? "d-flex col-md-4":" "} style={width >= 626 ? {}:{display:'flex'}}>
            <TextInput
              onChange={(e)=>textInputHandler(e,queryType??"single")}
              onAcceptValue={function noRefCheck() {}}
              type="text"
              className=" w-100"
              data-table-id={tablesId}
            />
          </div>
        }
      </>
    )
  };

  export default CommonSecondConstructor;