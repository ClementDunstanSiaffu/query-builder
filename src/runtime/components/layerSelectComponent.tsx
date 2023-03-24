
import Layer from 'esri/layers/Layer';
import {appActions, React} from 'jimu-core';
import { Alert, Select,Option } from 'jimu-ui';
import { ChangeEvent } from 'react';
import { LayerSelectContext } from '../../context/contextApi';
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
    // onChangeSelectLayer :(e:ChangeEvent)=>void,
    // currentSelectedId:string,
    // resultLayerList:resultLayerListObject[],
    // showAddSelect:boolean,
    // chooseAndOr:(e:ChangeEvent)=>void
}

export default class LayerSelectComponent extends React.PureComponent<PropsType,any>{

    static contextType?: React.Context<any> = LayerSelectContext

    constructor(props:PropsType){
        super(props);
        this.onChangeSelectLayer = this.onChangeSelectLayer.bind(this);
        this.chooseAndOr = this.chooseAndOr.bind(this);
    }

    async onChangeSelectLayer(e) {
        const self = this.context.parent;
        self.graphicLayerFound.removeAll();
        const jimuMapView = this.context.jimuMapView
        if (jimuMapView) {
            jimuMapView.view.map.allLayers.forEach((f, index) => {
            if (f.title === e.currentTarget.innerText) {
              jimuMapView.view.whenLayerView(f).then((layerView) => {
                self.setState({
                  resultsLayerSelected: f,
                  currentTargetText: e.currentTarget.innerText,
                  currentSelectedId: e.currentTarget.value,
                });
                self.props.dispatch(
                  appActions.widgetStatePropChange("value", "checkedLayers", [f.id])
                );
              });
            }
          });
        }
    }

    chooseAndOr = (e) =>{
        const self = this.context.parent;
        self.setState({ AndOr: e.target.value });
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
                          onChange={this.onChangeSelectLayer}
                            placeholder="Seleziona il Layer"
                            value={this.context.currentSelectedId}
                        >
                        {this.context.resultLayerList.map((el, i) => {
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
                        {this.context.showAddSelect ? (
                            <p>
                                Visualizza le feature nel layer corrispondenti alla
                                seguente espressione
                            </p>
                            ) : (
                            <AndOrSelector chooseAndOr={this.chooseAndOr} />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}