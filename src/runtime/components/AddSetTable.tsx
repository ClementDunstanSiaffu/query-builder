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
import {
  queryConstructorNumber,
  queryConstructorString,
} from "../utils/queryTableValue";
// import {useState} from 'react'

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
    showDelete,blockId
  } = props;

  const currentwhereClausesSet = whereClausesSet.find((item)=>item.id === tablesSetId);
  return (
    <div className="my-1">
      {list.fields ? (
        <div className="d-flex flex-column">
          <div className="row m-0">
            {showDelete&&<div className="row w-100 d-flex justify-content-end">
              <Button
                className="mb-2 col-1 self-end"
                onClick={deleteTable}
                icon
              >
                <CloseOutlined />
              </Button>
            </div>}
            <Select
              className="col-md-4 mb-2"
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
            <div className="col-md-4 mb-2">
              <Select
                onChange={(e) => getQuery(e, "set")}
                placeholder="Seleziona campo"
              >
                {currentwhereClausesSet && currentwhereClausesSet.attributeQueryType === "string"
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
              blockId = {blockId}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
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
    blockId
  } = props;
  const normalizedThirdQuery = [];
  let defaultValue = "=";
  let dropdownValueQuery = "valore";
  let opened = false;
  let checked = 0;
  let au = true;
  // valueThirdQuery.map((el, i) => { normalizedThirdQuery.push({ label: el.label[0].toString(), value: el.value[0].toString() }) })
  if (whereClausesSet.length){
    const currentItem = whereClausesSet.find((item)=>item.id === tablesSetId);
    if (currentItem?.ifInOrNotInQueryValue){
      currentItem.ifInOrNotInQueryValue.map((el,i)=>{
        normalizedThirdQuery.push({
          id: tablesSetId.toString(),
          label: el.label.toString(),
          value: el.value.toString(),
          listel: currentItem.checkedListSet,
        });
      })
    }

    if (currentItem?.queryValue)defaultValue = currentItem.queryValue;
    if (currentItem?.dropdownValueQuery) dropdownValueQuery = currentItem.dropdownValueQuery;
    if (currentItem?.isOpen) {
      // opened = whereClausesSet[tablesSetId].isOpen;
    }
    if (currentItem?.checkedListSet)checked = currentItem.checkedListSet.length;
    
  }

  return (
    <Switch queryValues={defaultValue}>
      <div value={"="} className="d-flex col-md-4">
        {dropdownValueQuery === "univoco" ? (
          <Select
            onChange={(e)=>univocoSelectHandler(e,"set")}
            placeholder="Seleziona il Layer"
          >
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesSetId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={(e)=>textInputHandler(e,"set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesSetId}
          />
        )}
        <div className="flex-shrink-1">
          {}
          <Dropdown activeIcon>
            <DropdownButton>
              <SettingOutlined className="setting-svg" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem header>Importa il tipo di input</DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                value="valore"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={"<>"} className="d-flex col-md-4">
        {dropdownValueQuery === "univoco" ? (
          <Select
            onChange={(e)=>univocoSelectHandler(e,"set")}
            placeholder="Seleziona il Layer"
          >
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesSetId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={(e)=>textInputHandler(e,"set")}
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
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={"IN"} onMouseLeave={() => onmouseLeave()}>
        <div className="w-100">
          {
            <Dropdown
              activeIcon
              isOpen={dropdownsSet[tablesSetId]??false}
              toggle={() => dropDown}
            >
              <DropdownButton onClick={() => openDrop(tablesSetId)}>
                {checked} elementi selezionati
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem header>Multi selezione attiva</DropdownItem>
                <DropdownItem divider />
                {normalizedThirdQuery.map((el, i) => {
                  return (
                    <div>
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
                })}
              </DropdownMenu>
            </Dropdown>
          }
        </div>
      </div>
      <div value={"NOT_IN"} className="d-flex justify-content-between">
      <div className="w-100">
          {
            <Dropdown
              activeIcon
              isOpen={dropdownsSet[tablesSetId]??false}
              toggle={() => dropDown}
            >
              <DropdownButton onClick={() => openDrop(tablesSetId)}>
                {checked} elementi selezionati
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem header>Multi selezione attiva</DropdownItem>
                <DropdownItem divider />
                {normalizedThirdQuery.map((el, i) => {
                  return (
                    <div>
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
                })}
              </DropdownMenu>
            </Dropdown>
          }
        </div>
      </div>
      <div value={"<="} className="d-flex  col-md-4">
        {dropdownValueQuery === "univoco" ? (
          <Select placeholder="Seleziona il Layer" onChange={(e)=>univocoSelectHandler(e,"set")}>
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesSetId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={(e)=>textInputHandler(e,"set")}
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
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={">="} className="d-flex col-md-4">
        {dropdownValueQuery === "univoco" ? (
          <Select placeholder="Seleziona il Layer" onChange={(e)=>univocoSelectHandler(e,"set")}>
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesSetId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={(e)=>textInputHandler(e,"set")}
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
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={"<"} className="d-flex col-md-4">
        {dropdownValueQuery === "univoco" ? (
          <Select placeholder="Seleziona il Layer" onChange={(e)=>univocoSelectHandler(e,"set")}>
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesSetId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={(e)=>textInputHandler(e,"set")}
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
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={">"} className="d-flex col-md-4">
        {dropdownValueQuery === "univoco" ? (
          <Select placeholder="Seleziona il Layer" onChange={(e)=>univocoSelectHandler(e,"set")}>
            {normalizedThirdQuery.map((el, i) => {
              return (
                <Option value={i} data-table-id={tablesSetId}>
                  {el.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          <TextInput
            onChange={(e)=>textInputHandler(e,"set")}
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
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Valore
              </DropdownItem>
              <DropdownItem
                value="campo"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                disabled
                data-table-id={tablesSetId}
              >
                Campo
              </DropdownItem>
              <DropdownItem
                value="univoco"
                onClick={(e)=>dropdownItemHandler(e,"set")}
                data-table-id={tablesSetId}
              >
                Univoci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div value={"is null"}></div>
      <div value={"is not null"}></div>
      <div value={"included"} className="d-flex col-md-4">
        <div className="include">
          <TextInput
            onChange={(e)=>textFirstIncludedHandler(e,"set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            data-table-id={tablesSetId}
            id="inputs"
          />
          <p className="col-md-2 text-center" style={{ width: "10%" }}>
            e
          </p>
          <TextInput
            onChange={(e)=>textSecondIncludedHandler(e,"set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            data-table-id={tablesSetId}
            id="inputs"
          />
        </div>
      </div>
      <div value={"is_not_included"} className="d-flex col-md-4">
        <div className="include">
          <TextInput
            onChange={(e)=>textFirstIncludedHandler(e,"set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            id="inputs"
            data-table-id={tablesSetId}
          />
          <p className="col-sm-2 text-center">e</p>
          <TextInput
            onChange={(e)=>textSecondIncludedHandler(e,"set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            id="inputs"
            data-table-id={tablesSetId}
          />
        </div>
      </div>
      <div value={"LIKE%"} className="d-flex col-md-4">
        <TextInput
          onChange={(e)=>textInputHandler(e,"set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
      <div value={"%LIKE"} className="d-flex col-md-4">
        <TextInput
          onChange={(e)=>textInputHandler(e,"set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
      <div value={"LIKE%"} className="d-flex col-md-4">
        <TextInput
          onChange={(e)=>textInputHandler(e,"set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
      <div value={"%LIKE%"} className="d-flex col-md-4">
        <TextInput
          onChange={(e)=>textInputHandler(e,"set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
      <div value={"NOT LIKE"} className="d-flex col-md-4">
        <TextInput
          onChange={(e)=>textInputHandler(e,"set")}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesSetId}
        />
      </div>
    </Switch>
  );
};

export default AddSetTable;
