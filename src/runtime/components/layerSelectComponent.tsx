
import Layer from 'esri/layers/Layer';
import {React} from 'jimu-core';
import { Alert, Select,Option } from 'jimu-ui';
import { ChangeEvent } from 'react';
import '../../style.css'
import AndOrSelector from './common/andorSelector';

interface resultLayerListObject {
    element:Layer,
    label:string,
    value:number,
    layerID:string,
    urlServiceServer:string
}

type PropsType = {
    onChangeSelectLayer :(e:ChangeEvent)=>void,
    currentSelectedId:string,
    resultLayerList:resultLayerListObject[],
    showAddSelect:boolean,
    chooseAndOr:(e:ChangeEvent)=>void
}

export default class LayerSelectComponent extends React.PureComponent<PropsType,any>{

    constructor(props:PropsType){
        super(props)
    }

    render(): React.ReactNode {
        return(
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-2">
                        <Alert
                            className="w-100"
                            form="basic"
                            open
                            text="Selezionare prima il layer, poi continua con il costruttore della query"
                            type="info"
                            withIcon
                        />
                    </div>
                    <div className="mb-2">
                        <h3 className="w-100">Seleziona il layer:</h3>
                        <Select
                          onChange={this.props.onChangeSelectLayer}
                            placeholder="Seleziona il Layer"
                            value={this.props.currentSelectedId}
                        >
                        {this.props.resultLayerList.map((el, i) => {
                            return (
                            <Option
                                value={el.layerID}
                                //@ts-ignore
                                parsedUrl={el.element.parsedUrl}
                                id={i}
                                key={i}
                            >
                                {el.element.title}
                            </Option>
                            );
                        })}
                        </Select>
                        {this.props.showAddSelect ? (
                            <p>
                                Visualizza le feature nel layer corrispondenti alla
                                seguente espressione
                            </p>
                            ) : (
                            <AndOrSelector chooseAndOr={this.props.chooseAndOr} />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}