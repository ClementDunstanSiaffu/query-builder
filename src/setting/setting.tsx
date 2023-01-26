/** @jsx jsx */
import { React, jsx, FormattedMessage } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import {MapWidgetSelector, SettingRow, SettingSection} from "jimu-ui/advanced/setting-components";


export default class Setting extends React.PureComponent<AllWidgetSettingProps<any>, any> {
  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    });
  };

  saveState(key,value){
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(key, value)
    });
  }

  render() {
    return (
        <div className="widget-setting-search-advanced">
          <SettingSection title={"Sorgente Mappa"}>
            <MapWidgetSelector useMapWidgetIds={this.props.useMapWidgetIds} onSelect={this.onMapWidgetSelected} />
          </SettingSection>
          <SettingSection title={"Options"}>
            <SettingRow label={<FormattedMessage id="idWidgetTable" defaultMessage={"Id Widget table"}/>}>
              <input defaultValue={this.props.config.idWidgetTable} onChange={(e) => this.saveState('idWidgetTable',e.target.value)}/>
            </SettingRow>
          </SettingSection>
        </div>
    );
  }
}

