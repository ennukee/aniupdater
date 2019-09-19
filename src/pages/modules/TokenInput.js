import React, { Component } from 'react'
import './css/TokenInput.css'

export default class TokenInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
             inputVal: ''
        }
    }
    
    render() {
        return (
            <div id='input-container'>
                <input id='token-input' 
                    type='text' 
                    placeholder='AniList Token'
                    value={this.state.inputVal} 
                    onChange={e => this.setState({inputVal: e.target.value})}/>
                <input 
                    id='token-submit' 
                    type='button' 
                    value='✓' 
                    onClick={() => this.props.callback(this.state.inputVal)}
                    disabled={this.props.disabled}
                />
            </div>
        )
    }
}
