
import {React,jsx} from 'jimu-core';
import { Button, Icon } from 'jimu-ui';
import '../../style.css'

type PropsType = {
    width:number,
    addTable:()=>void,
    currentTargetText:string,
    addBlock:()=>void,
    sendQuery:()=>void,
    functionRefresh:()=>void
}

export default class CallToAction extends React.PureComponent<PropsType,any>{

    render(): React.ReactNode {
        return(
            <div 
                className={this.props.width >= 626 ? "row mt-1 mb-3 justify-content-around":" "} 
                style={this.props.width >= 626 ? {}: { display: "flex", flexDirection: "column" }}
            >
                <div 
                    className={this.props.width >= 626 ? "col-md-5 d-flex justify-content-center text-center":" "} 
                    style={this.props.width >= 626 ? { gap: "2%" }:{gap: "2%",width:"100%",display: "flex",justifyContent:"center"}}
                >
                    <Button
                        disabled={!this.props.currentTargetText}
                        onClick={this.props.addTable}
                        size="default"
                        className="d-flex align-items-center  mb-2"
                        type="secondary"
                    >
                        <Icon
                            icon='<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0a.5.5 0 0 0-.5.5V7H.5a.5.5 0 0 0 0 1H7v6.5a.5.5 0 0 0 1 0V8h6.5a.5.5 0 0 0 0-1H8V.5a.5.5 0 0 0-.5-.5Z" fill="#000"></path></svg>'
                            size="m"
                        />
                        <p className="m-0 p-0">Aggiungi espressione</p>
                    </Button>
                    <Button
                        disabled={!this.props.currentTargetText}
                        onClick={this.props.addBlock}
                        size="default"
                        className="d-flex align-items-center  mb-2"
                        type="secondary"
                    >
                        <Icon
                            icon='<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0a.5.5 0 0 0-.5.5V7H.5a.5.5 0 0 0 0 1H7v6.5a.5.5 0 0 0 1 0V8h6.5a.5.5 0 0 0 0-1H8V.5a.5.5 0 0 0-.5-.5Z" fill="#000"></path></svg>'
                            size="m"
                        />
                        <p className="m-0 p-0">Aggiungi set di espressioni</p>
                    </Button>
                </div>
                <div 
                    className={this.props.width >= 626 ? "col-md-5 d-flex justify-content-center text-center":" "}
                    style={this.props.width >= 626 ? {}:{width: "100%",display: "flex",justifyContent: "center"}}
                >
                    <Button
                        size="default"
                        className="d-flex align-items-center mb-2"
                        type="secondary"
                        onClick={this.props.sendQuery}
                    >
                        <p className="m-0 p-0">Applica</p>
                    </Button>
                    <Button
                        size="default"
                        className="d-flex align-items-center mb-2"
                        style={{ marginLeft: "5px" }}
                        type="secondary"
                        onClick={this.props.functionRefresh}
                    >
                        <p className="m-0 p-0">Ricaricare</p>
                    </Button>
                </div>
          </div>
        )
    }
}


