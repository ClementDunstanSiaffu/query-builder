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
import "../../../../assets/styles/styles.scss";
import PaginationCompoenent from "../../pagination";
import SelectUnivoco from "./select";

const SecondConstructorAddset = (props) => {
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
    parent,
  } = props;

  const [currentTable, setCurrentTable] = React.useState({});
  const [onChangingPage, setOnChangingPage] = React.useState({});
  const numberOfItems = 10;

  const normalizedThirdQuery = [];
  let defaultValue = "=";
  let dropdownValueQuery = "valore";
  let opened = false;
  let checked = 0;
  let au = true;
  let singleWhereClause;
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
    if (currentItem?.checkedListSet)
      checked = currentItem.checkedListSet.length;

    singleWhereClause = currentItem;
  }

  const copiednormalizedThirdQuery = [...normalizedThirdQuery];

  React.useEffect(() => {
    if (
      currentTable[tablesSetId]?.currentNumberOfPage === 0 &&
      copiednormalizedThirdQuery.length
    ) {
      calculateTotalNumberOfPage();
      onIncrement();
    }
  }, [copiednormalizedThirdQuery]);

  React.useEffect(() => {
    if (queryChanged[tablesSetId] && parent) {
      setCurrentTable({
        ...currentTable,
        [tablesSetId]: {
          startIndex: 0,
          endIndex: 0,
          currentNumberOfPage: 0,
          totalNumberOfPage: 0,
        },
      });
      parent?.setState({
        queryChanged: { ...queryChanged, [tablesSetId]: false },
      });
    }
  }, [queryChanged]);

  const calculateTotalNumberOfPage = () => {
    if (copiednormalizedThirdQuery.length) {
      const newTotalNumberOfPage = Math.ceil(
        copiednormalizedThirdQuery.length / numberOfItems
      );
      let newCurrentTable = currentTable[tablesSetId];
      if (newCurrentTable) {
        newCurrentTable = {
          ...newCurrentTable,
          totalNumberOfPage: newTotalNumberOfPage,
        };
      } else {
        newCurrentTable = { totalNumberOfPage: newTotalNumberOfPage };
      }
      setCurrentTable({ ...currentTable, [tablesSetId]: newCurrentTable });
    }
  };

  const onIncrement = () => {
    const currentNumberOfPage =
      currentTable[tablesSetId]?.currentNumberOfPage ?? 0;
    if (currentNumberOfPage < currentTable[tablesSetId]?.totalNumberOfPage) {
      const firstIndex = currentTable[tablesSetId]?.endIndex ?? 0;
      const lastIndex = firstIndex + numberOfItems;
      const newcurrentNumberOfPage = currentNumberOfPage + 1;
      let newCurrentTable = currentTable[tablesSetId];
      if (newCurrentTable) {
        newCurrentTable = {
          ...newCurrentTable,
          startIndex: firstIndex,
          endIndex: lastIndex,
          currentNumberOfPage: newcurrentNumberOfPage,
        };
      } else {
        newCurrentTable = {
          startIndex: firstIndex,
          endIndex: lastIndex,
          currentNumberOfPage: newcurrentNumberOfPage,
        };
      }
      setCurrentTable({ ...currentTable, [tablesSetId]: newCurrentTable });
      setOnChangingPage({ ...onChangingPage, [tablesSetId]: true });
    }
  };

  const onDecrement = () => {
    if (currentTable[tablesSetId]?.startIndex > 0) {
      const startIndex = currentTable[tablesSetId].startIndex;
      const endIndex = currentTable[tablesSetId].endIndex;
      const currentNumberOfPage = currentTable[tablesSetId].currentNumberOfPage;
      const firstIndex = startIndex - numberOfItems;
      const lastIndex = endIndex - numberOfItems;
      const newcurrentNumberOfPage = currentNumberOfPage - 1;
      let newCurrentTable = currentTable[tablesSetId];
      if (newCurrentTable) {
        newCurrentTable = {
          ...newCurrentTable,
          startIndex: firstIndex,
          endIndex: lastIndex,
          currentNumberOfPage: newcurrentNumberOfPage,
        };
      } else {
        newCurrentTable = {
          startIndex: firstIndex,
          endIndex: lastIndex,
          currentNumberOfPage: newcurrentNumberOfPage,
        };
      }
      setCurrentTable({ ...currentTable, [tablesSetId]: newCurrentTable });
      setOnChangingPage({ ...onChangingPage, [tablesSetId]: true });
    }
  };

  // const test = (props) => {};
  const startIndex = currentTable[tablesSetId]?.startIndex ?? 0;
  const endIndex = currentTable[tablesSetId]?.endIndex ?? 10;
  const queriesWithUnivoco = ["=", "<>", "<=", ">=", "<", ">"];
  const queriesWithMultiselect = ["IN", "NOT_IN"];
  const queriesWithNothing = ["is null", "is not null"];
  const queriesWithTwoInputs = ["included", "is_not_included"];
  const queriesWithSingleInput = ["LIKE%", "%LIKE", "%LIKE%", "NOT LIKE"];

  return (
    <>
      {queriesWithMultiselect.includes(defaultValue) && (
        <div
          value={defaultValue}
          className={width >= 626 ? "d-flex col-md-4" : " "}
        >
          {
            <Dropdown
              activeIcon
              isOpen={dropdownsSet[tablesSetId]}
              toggle={() => dropDown}
              style={{ width: "100%" }}
            >
              <DropdownButton
                onClick={() => openDrop(tablesSetId)}
                style={{ width: "100%" }}
              >
                {checked} elementi selezionati
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem header>Multi selezione attiva</DropdownItem>
                <DropdownItem divider />
                {copiednormalizedThirdQuery
                  .slice(startIndex, endIndex)
                  ?.map((el, i) => {
                    if (el) {
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
                                checked={
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
                    currentPage={`${
                      currentTable[tablesSetId]?.currentNumberOfPage ?? 0
                    }`}
                    totalNumberOfPage={`${currentTable[tablesSetId]?.totalNumberOfPage}`}
                    ondecrement={onDecrement}
                    onincrement={onIncrement}
                  />
                </>
              </DropdownMenu>
            </Dropdown>
          }
        </div>
      )}
      {queriesWithUnivoco.includes(defaultValue) && (
        <div
          value={defaultValue}
          className={width > 626 ? "d-flex col-md-4" : " "}
          style={width >= 626 ? {} : { display: "flex" }}
        >
          {dropdownValueQuery === "univoco" ? (
            <SelectUnivoco
              currentPage={currentTable[tablesSetId]?.currentNumberOfPage ?? 0}
              totalNumberOfPages={
                currentTable[tablesSetId]?.totalNumberOfPage ?? 0
              }
              onDecrement={onDecrement}
              onIncrement={onIncrement}
              startIndex={currentTable[tablesSetId]?.startIndex ?? 0}
              endIndex={currentTable[tablesSetId]?.endIndex ?? 0}
              tablesId={tablesSetId}
              dropdowns={dropdownsSet}
              openDrop={openDrop}
              univocoSelectHandler={univocoSelectHandler}
              data={copiednormalizedThirdQuery}
              queryType="set"
              onChangingPage={onChangingPage}
              setOnChangingPage={setOnChangingPage}
              currentValue={singleWhereClause?.value?.txt}
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
      )}
      {queriesWithNothing.includes(defaultValue) && (
        <div
          value={defaultValue}
          className={width > 626 ? "d-flex col-md-4" : " "}
          style={width >= 626 ? {} : { display: "flex" }}
        ></div>
      )}

      {queriesWithTwoInputs.includes(defaultValue) && (
        <div
          value={defaultValue}
          className={width >= 626 ? "d-flex col-md-4" : " "}
          style={width >= 626 ? {} : { display: "flex" }}
        >
          <TextInput
            onChange={(e) => textFirstIncludedHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            data-table-id={tablesSetId}
            id="inputs"
            style={{ width: "100%" }}
          />
          <span
            className="col-sm-2 text-center"
            style={{ height: "100%", fontSize: "18px" }}
          >
            e
          </span>
          <TextInput
            onChange={(e) => textSecondIncludedHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            data-table-id={tablesSetId}
            id="inputs"
            style={{ width: "100%" }}
          />
        </div>
      )}
      {queriesWithSingleInput.includes(defaultValue) && (
        <div
          value={defaultValue}
          className={width >= 626 ? "d-flex col-md-4" : " "}
          style={width >= 626 ? {} : { display: "flex" }}
        >
          <TextInput
            onChange={(e) => textInputHandler(e, "set")}
            onAcceptValue={function noRefCheck() {}}
            type="text"
            className=" w-100"
            data-table-id={tablesSetId}
          />
        </div>
      )}
    </>
  );
};

export default SecondConstructorAddset;
