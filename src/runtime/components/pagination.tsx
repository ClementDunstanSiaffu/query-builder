
import {React,jsx} from 'jimu-core';
import { LeftOutlined } from 'jimu-icons/outlined/directional/left';
import { RightOutlined } from 'jimu-icons/outlined/directional/right'

type PropsType = {
    totalNumberOfPage:string,
    currentPage:string,
    ondecrement:()=>void,
    onincrement:()=>void
}

const PaginationCompoenent = (props:PropsType)=>{

    const {totalNumberOfPage,currentPage,ondecrement,onincrement} = props;

    const styles = {
        outerContainer:{
            width:"100%",
            display:"flex",
            flexDirection:"row",
            alignItems:"center",
            gap:"3%",
            height:50,
            backgroundColor:"whitesmoke",
            marginBottom:-10
        },
        iconContainer:{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            width:"25%"
        },
        innerIconContainer:{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            backgroundColor:"rgb(0,94,202)",
            alignItems:"center",
            height:30,
            width:"80%"
        },
        textContainer:{
            display:"flex",
            flexDirection:"column",
            justifyContents:"center",
            alignItems:"center",
            width:"50%",
        },
        innerTextContainer:{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            height:30,
            fontSize:16
        }
    }

    return(
        <div style = {styles.outerContainer}>
            <div style ={styles.iconContainer}>
                <div style = {styles.innerIconContainer} onClick = {ondecrement}><LeftOutlined color='white' size = {25} /></div>
            </div>
            <div style={styles.textContainer}><div style={styles.innerTextContainer}>{currentPage}/{totalNumberOfPage}</div></div>
            <div style ={styles.iconContainer} onClick = {onincrement}>
                <div style = {styles.innerIconContainer}><RightOutlined color='white' size = {25} /></div>
            </div>
        </div>
    )
}

export default PaginationCompoenent;