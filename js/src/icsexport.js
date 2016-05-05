import React from 'react'

export class IcsExport extends React.Component{

    constructor(props){
        super(props);
        this.state = {name:[]};
        this.handleChange = this.handleChange.bind(this)
        this.exportCall = this.exportCall.bind(this)

    }

    handleChange(e){
        this.setState({name: e.target.value});
    }

    exportCall(){
        this.props.onClick(this.state.name);
    }

    render(){
        return(
            <div>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Calendar name" onChange={this.handleChange} />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button" onClick={this.exportCall}>Export</button>
              </span>
            </div>
                <div className="input-group">
                  <span className="input-group-addon" id="basic-addon1">Exported url:</span>
                  <input type="text" className="form-control" value={this.props.url} readOnly placeholder="Username" aria-describedby="basic-addon1" size="45"/>
                </div>
            </div>
        );
    }
}
