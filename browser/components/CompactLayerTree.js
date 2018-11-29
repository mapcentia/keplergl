const React = require('react');

/**
 * Compact layer tree component
 */
class CompactLayerTree extends React.Component {
    constructor(props) {
        super(props);
    }

    getLayersCheckedForImport() {
        let ids = [];
        $(`[data-compact-layer-tree-gc2-id]:checked`).each((index, item) => {
            ids.push($(item).data(`compact-layer-tree-gc2-id`));
        });

        return ids;
    }

    handleChange({target}) {
        if (target.checked){
           target.removeAttribute('checked');
        } else {
           target.setAttribute('checked', true);
        }

        this.props.onSelectedLayersChange(this.getLayersCheckedForImport());
    }

    render() {
        let layersControl = (<p>{__(`No layers available`)}</p>);

        let layersMeta = (this.props.layers && `data` in this.props.layers ? this.props.layers.data: false);
        if (layersMeta) {
            layersControl = [];
    
            let groups = [];
            for (let i = 0; i < layersMeta.length; ++i) {
                let groupName = layersMeta[i].layergroup;
                if (groups.indexOf(groupName) === -1) {
                    groups.push(groupName);
                }
            }

            groups.map(groupName => {

                if (!groupName) {
                    return;
                }

                let base64GroupName = Base64.encode(groupName).replace(/=/g, "");
                let groupLayers = [];

                layersMeta.map((layerMeta, index) => {
                    if (layerMeta.layergroup === groupName) {
                        let tableId = (layerMeta.f_table_schema + '.' + layerMeta.f_table_name);

                        let checked = false;
                        if (this.props.layerTree.getActiveLayers().indexOf(`v:` + tableId) > -1) {
                            checked = true;
                        }

                        groupLayers.push(<li key={base64GroupName + index} className="layer-item list-group-item" style={{minHeight: '40px', marginTop: '10px'}}>
                            <div style={{display: 'inline-block'}}>
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" defaultChecked={checked} data-gc2-layer-type="vector" data-gc2-id={tableId}/>
                                    </label>
                                </div>
                            </div>
                            <div style={{ display: 'inline-block'}}>
                                <span>{layerMeta.f_table_title || layerMeta.f_table_name}</span>
                            </div>
                            <div style={{display: 'inline-block', float: 'right'}}>
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" data-compact-layer-tree-gc2-id={tableId} onClick={this.handleChange.bind(this)} /> {__('View in KeplerGL')}
                                    </label>
                                </div>
                            </div>
                        </li>);
                    }
                });

                let groupPanel = (<div key={base64GroupName} className="panel panel-default panel-layertree">
                    <div className="panel-heading" role="tab">
                        <h4 className="panel-title">
                            <a
                                style={{ display: 'block' }}
                                className="accordion-toggle"
                                data-toggle="collapse"
                                data-parent="#layers"
                                href={'#compact-layer-tree-collapse' + base64GroupName}>{groupName}</a>
                        </h4>
                    </div>
                    <ul className="list-group" role="tabpanel">
                        <div id={'compact-layer-tree-collapse' + base64GroupName} className="accordion-body collapse">{groupLayers}</div>
                    </ul>
                </div>);

                layersControl.push(groupPanel);
            });
        }

        return (<div>{layersControl}</div>);
    }
}

module.exports = CompactLayerTree;