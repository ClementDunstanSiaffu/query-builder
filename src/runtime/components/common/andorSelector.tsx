
import {React,jsx} from 'jimu-core';
import { Select,Option} from 'jimu-ui';
import { ChangeEvent } from 'react';

type PropsType = {chooseAndOr:(e:ChangeEvent,blockId?:any)=>void;}

export default class AndOrSelector extends React.PureComponent<PropsType,any>{

    render(): React.ReactNode {
        return(
            <Select
            onChange={(e)=>this.props.chooseAndOr(e)}
            placeholder=" Visualizza le feature nel layer che corrispondono a tutte le espressioni seguenti"
            defaultValue="AND"
        >
            <Option value="AND">
                Visualizza le feature nel layer che corrispondono a
                tutte le espressioni seguenti
            </Option>
            <Option value="OR">
                Visualizza le feature nel layer che corrispondono ad
                una qualsiasi delle espressioni seguenti
            </Option>
        </Select>
        )
    }
}
