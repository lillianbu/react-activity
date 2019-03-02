import React from 'react'
import "../css/app.css";
import Clock from 'svg-react-loader?name=Clockface!../css/clockface.svg';

export default class Clockface extends React.Component {
    render () {
        return <Clock className='normal clock-svg' />;
    }
};