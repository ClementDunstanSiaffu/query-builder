
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
  setOnChangingPage:any
}

const SelectUnivoco = (props:PropsType)=>{

  // const [openDropdown,setOpenDropdown] = React.useState<boolean>(false);
  // const [selectedIndex,setSelectedIndex] = React.useState<number>(-1);
  // const [selectedItem,setSelectedItem] = React.useState<string>(" ");
  const [currentTable,setCurrentTable] = React.useState({});

  // const openDropDown_ = ()=>setOpenDropdown(!openDropdown);
  
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
    setOnChangingPage
  } = props

  React.useEffect(()=>{
    if (onChangingPage[tablesId]){
      setCurrentTable({...currentTable,[tablesId]:{"selectedIndex":-1,"selectedItem":" "}})
      // setSelectedIndex(-1);
      // setSelectedItem(" ");
      setOnChangingPage({...onChangingPage,[tablesId]:false});
    }
  },[onChangingPage])

  const getClickedItem = (value:any,tableId:string|number,index)=>{
    setCurrentTable({...currentTable,[tableId]:{"selectedIndex":index,"selectedItem":value}});
    // setSelectedIndex(index);
    // setSelectedItem(value)
    const currentTableId = typeof tableId === "number" ? `${tableId}`:tableId
    const obj = {value,tableId:currentTableId}
    univocoSelectHandler(obj,queryType);
    openDrop(tablesId)
  }
  

  return(
    
      <Dropdown
        activeIcon
        isOpen={dropdowns[tablesId]}
        // toggle={() => dropDown}
        style = {{width:"100%"}}
        
      >
        <DropdownButton onClick={() => openDrop(tablesId)} style = {{width:"100%"}}>
          {currentTable[tablesId]?.selectedItem??" "}
          {/* {selectedItem} */}
        </DropdownButton>
        <DropdownMenu className="drop-down-menu-table"  >
          {/* <DropdownItem header></DropdownItem> */}
          <DropdownItem divider  />
          {data?.slice(startIndex,endIndex)?.map((el,i)=>{
          {/* {normalizedThirdQuery.map((el, i) => { */}
            if (el){
              return (
                <div 
                  // onMouseOver={(e)=>onMouseOver_(e,i)}
                  onClick = {(e)=>getClickedItem(el.value,tablesId,i)}
                  // value = {el.value}
                >
                  <DropdownItem
                    
                    value={i}
                    data-table-id={tablesId}
                    className="d-flex justify-content-start"
                    strategy={"fixed"}
                  >
                    {
                      <div style={{width:20,height:20,display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                        {currentTable[tablesId]?.selectedIndex === i && <CheckOutlined />}
                        {/* {  selectedIndex === i && <CheckOutlined />} */}
                      </div>
                    
                      // <Input
                      //   // onChange={onChangeCheckBox}
                      //   type="checkbox"
                      //   id={tablesId}
                      //   name={el.label}
                      //   value={el.value}
                      //   defaultChecked={
                      //     el.listel &&
                      //     el.listel.filter(function (e) {
                      //       return e.checkValue === el.label;
                      //     }).length > 0
                      //   }
                      // />
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
              currentPage={`${currentPage}`}
              totalNumberOfPage = {`${totalNumberOfPages}`}
              ondecrement = {onDecrement}
              onincrement = {onIncrement}
            />
          </>
        </DropdownMenu>
      </Dropdown>
    
      // <Dropdown
      //   activeIcon
      //   isOpen = {dropdowns[tablesId]}     
      //   style = {{width:"100%"}}
      // >
      //   <DropdownButton onClick={()=>openDrop(tablesId)} style = {{width:"100%"}} >{selectedItem}</DropdownButton>
      //   <DropdownMenu className="drop-down-menu-table">
      //     <DropdownItem header>Multi selezione attiva</DropdownItem>
      //     <DropdownItem divider >
      //       {data.slice(startIndex,endIndex)?.map((el,i)=>{
      //         if (el){
      //           console.log(el,"check el from select")
      //           return (
      //             <div 
      //               // onMouseOver={(e)=>onMouseOver_(e,i)}
      //             >
      //               <DropdownItem
      //                 value={i}
      //                 data-table-id={tablesId}
      //                 className="d-flex justify-content-start"
      //                 strategy={"fixed"}
      //               >
      //                 {
      //                   <Input
      //                     // onChange={onChangeCheckBox}
      //                     type="checkbox"
      //                     id={tablesId}
      //                     name={el.label}
      //                     value={el.value}
      //                     defaultChecked={
      //                       el.listel &&
      //                       el.listel.filter(function (e) {
      //                         return e.checkValue === el.label;
      //                       }).length > 0
      //                     }
      //                   />
      //                 }
      //                 <label
      //                   htmlFor={tablesId}
      //                   className="ml-3 mb-0"
      //                   id={tablesId}
      //                 >
      //                   {" "}
      //                   {el.label}
      //                 </label>
      //               </DropdownItem>
                  
      //             </div>
      //           );
      //         }
      //       })}
      //     </DropdownItem>
      //     <>
      //       <PaginationCompoenent
      //         currentPage={`${currentPage}`}
      //         totalNumberOfPage = {`${totalNumberOfPages}`}
      //         ondecrement = {onDecrement}
      //         onincrement = {onIncrement}
      //       />
      //     </>
      //   </DropdownMenu>
      // </Dropdown>
    )
}

export default SelectUnivoco;