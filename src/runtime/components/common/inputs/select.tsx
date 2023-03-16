
import {React,jsx} from 'jimu-core';
import {Dropdown,DropdownButton,DropdownMenu,DropdownItem,Input} from 'jimu-ui'
import { CheckOutlined } from 'jimu-icons/outlined/application/check'
import PaginationCompoenent from '../../pagination';
import '../../../../assets/styles/styles.scss'

type PropsType = {
  tablesId:number|string
  data:any[],
  startIndex:number,
  endIndex:number,
  totalNumberOfPages:number,
  currentPage:number,
  onIncrement:()=>void,
  onDecrement:()=>void,
  univocoSelectHandler:(currentTable:{value:any,tableId:string},queryType:string)=>void,
  dropdowns:{[key:number|string]:boolean},
  openDrop:(tablesId:string|number)=>void,
  queryType:string,
  onChangingPage:{[key:string|number]:boolean},
  setOnChangingPage:any,
  currentValue:string|number
}

const SelectUnivoco = (props:PropsType)=>{

  const [currentTable,setCurrentTable] = React.useState({});
  const {
    tablesId,
    data,
    startIndex,
    endIndex,
    totalNumberOfPages,
    currentPage,
    onIncrement,
    onDecrement,
    univocoSelectHandler,
    dropdowns,
    openDrop,
    queryType,
    onChangingPage,
    setOnChangingPage,
    currentValue
  } = props

  React.useEffect(()=>{
    if (onChangingPage[tablesId]){
      setCurrentTable({...currentTable,[tablesId]:{"selectedIndex":-1,"selectedItem":" "}})
      setOnChangingPage({...onChangingPage,[tablesId]:false});
    }
  },[onChangingPage])

  const getClickedItem = (value:any,tableId:string|number,index)=>{
    setCurrentTable({...currentTable,[tableId]:{"selectedIndex":index,"selectedItem":value}});
    const currentTableId = typeof tableId === "number" ? `${tableId}`:tableId
    const obj = {value,tableId:currentTableId}
    console.log(obj,queryType,"check both")
    univocoSelectHandler(obj,queryType);
    openDrop(tablesId)
  }

  const unrequiredSelectedValue = [''," ",' '];
  let selectedItem = currentValue??" "
  const currentTableSelectedValue = currentTable[tablesId]?.selectedItem;
  if (currentTableSelectedValue && !unrequiredSelectedValue.includes(currentTableSelectedValue)){
    selectedItem = currentTableSelectedValue
  }
  
  return(
    <Dropdown
      activeIcon
      isOpen={dropdowns[tablesId]}
      style = {{width:"100%"}} 
    >
      <DropdownButton onClick={() => openDrop(tablesId)} style = {{width:"100%"}}>
          {selectedItem}
      </DropdownButton>
      <DropdownMenu className="drop-down-menu-table"  >
        <DropdownItem divider  />
          {data?.slice(startIndex,endIndex)?.map((el,i)=>{
            if (el){
              return (
                <div onClick = {(e)=>getClickedItem(el.value,tablesId,i)}>
                  <DropdownItem
                    value={i}
                    data-table-id={tablesId}
                    className="d-flex justify-content-start"
                    strategy={"fixed"}
                  >
                    {
                      <div style={{width:20,height:20,display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                        {currentTable[tablesId]?.selectedIndex === i && <CheckOutlined />}
                      </div>
                    }
                    <label htmlFor={tablesId} className="ml-3 mb-0" id={tablesId}>
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
              currentPage={`${currentPage}`}
              totalNumberOfPage = {`${totalNumberOfPages}`}
              ondecrement = {onDecrement}
              onincrement = {onIncrement}
            />
          </>
        </DropdownMenu>
      </Dropdown>
    )
}

export default SelectUnivoco;