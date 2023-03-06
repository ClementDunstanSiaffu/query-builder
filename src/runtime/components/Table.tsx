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
// import {useState} from 'react'

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
  } = props;

  const currentwhereClauses = whereClauses.find(
    (item) => item.id === `${tablesId}`
  );

  if (currentTable.id === tablesId && !currentTable.deleted) {
    return (
      <ReactResizeDetector handleWidth handleHeight>
        {({ width, height }) => (
          <div className="my-1">
            {width}
            {list.fields ? (
              <>
                {width < 547 && (
                  <div
                    className=""
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      background: "",
                      height: "fit-content",
                      alignItems:"center",
                      justifyContent:"space-between",
                      // width:"100%"
                    }}
                  >
                    <div
                      className=""
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        width:"80%",
                      }}
                    >
                      <Select
                        className=""
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
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                        }}
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
                        {/* <div className="" style={{}}>
                          <Button className="" onClick={deleteTable} icon>
                            <CloseOutlined />
                          </Button>
                        </div> */}
                      </div>
                      <div style={{ width: "100%"}}>
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
                        />
                      </div>
                    </div>
                    <div className="" style={{}}>
                      <Button className="" onClick={deleteTable} icon>
                        <CloseOutlined />
                      </Button>
                    </div>
                  </div>
                )}
                {width > 547 && (
                  <div
                    className=""
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      background: "",
                      justifyContent: "center",
                    }}
                  >
                    <div className="row m-0">
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
                      <div className="" style={{ background: "" }}>
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
                      />
                    </div>
                    <div className="">
                      <Button className="" onClick={deleteTable} icon>
                        <CloseOutlined />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        )}
      </ReactResizeDetector>
    );
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

  const test = (props) => {};
  return (
    <Switch queryValues={defaultValue}>
      {/* <div value={"="} className="d-flex col-md-4"> */}
      <div value={"="} className="d-flex col-md-4" style={{width:"100%"}}>
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
      <div value={"<>"} className="d-flex col-md-4">
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
      <div value={"IN"} onMouseLeave={() => onmouseLeave()}>
        <div className="w-100">
          {
            <Dropdown
              activeIcon
              isOpen={dropdowns[tablesId]}
              toggle={() => dropDown}
            >
              <DropdownButton onClick={() => openDrop(tablesId)}>
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
              isOpen={dropdowns[tablesId]}
              toggle={() => dropDown}
            >
              <DropdownButton onClick={() => openDrop(tablesId)}>
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
              </DropdownMenu>
            </Dropdown>
          }
        </div>
      </div>
      <div value={"<="} className="d-flex  col-md-4">
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
      <div value={">="} className="d-flex col-md-4">
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
      <div value={"<"} className="d-flex col-md-4">
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
      <div value={">"} className="d-flex col-md-4">
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
      <div value={"is null"}></div>
      <div value={"is not null"}></div>
      <div value={"included"} className="d-flex col-md-4">
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
      <div value={"is_not_included"} className="d-flex col-md-4">
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
      <div value={"LIKE%"} className="d-flex col-md-4">
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
      <div value={"%LIKE"} className="d-flex col-md-4">
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
      <div value={"LIKE%"} className="d-flex col-md-4">
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
      <div value={"%LIKE%"} className="d-flex col-md-4">
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
      <div value={"NOT LIKE"} className="d-flex col-md-4">
        <TextInput
          onChange={textInputHandler}
          onAcceptValue={function noRefCheck() {}}
          type="text"
          className=" w-100"
          data-table-id={tablesId}
        />
      </div>
    </Switch>
  );
};

export default Table;
