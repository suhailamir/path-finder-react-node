import React from 'react';
import PropTypes from 'prop-types';

import {
  Row, Col, Select, Icon, Radio, Button, Card
} from 'antd';


import 'antd/dist/antd.css';
import './App.css';


const { Option } = Select;


export default class App extends React.Component {
  static propTypes = {
    getDestinations: PropTypes.func.isRequired,
    getFares: PropTypes.func.isRequired,
    destinations: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      key: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    fares: PropTypes.shape({
    }).isRequired,
  };

  defaultState=
    {
      from: 'London', to: 'Madrid', fareType: 'fast', isDisabled: false
    };
  
  constructor(props) {
    super(props);
    this.state = {
      from: 'London',
      to: 'Madrid',
      fareType: 'fast',
      isDisabled: false
    };
  }


  componentDidMount() {
    const { getDestinations, getFares } = this.props;
    getDestinations();
    const { to, from, fareType } = this.defaultState;
    getFares({ to, from, fareType });
  }


  onChange = (e) => {
    this.setState({ fareType: e.target.value });
  }

  handleToChange = (value) => {
    this.setState(
      () => ({ to: value, isDisabled: false })
    );
  }

  handleFromChange = (value) => {
    this.setState(
      () => ({ from: value, isDisabled: false })
    );
  }

  handleSubmit = () => {
    const { getFares } = this.props;
    const { to, from, fareType } = this.state;
    getFares({ to, from, fareType });
  }

  reset = () => {
    const { getFares } = this.props;
    this.setState(
      () => (this.defaultState)
    );
    const { to, from, fareType } = this.state;
    console.log('this.state :', this.state);
    getFares({ to, from, fareType });
  }

  ditinationDropdown = (items, onChangeHandler, activeItem) => {
    if (items && items.length > 0) {
      return (
        <Select defaultValue={activeItem || items[0].value} onChange={onChangeHandler}>
          {items.map(item => (
            <Option value={item.value
            }
            >
              {item.label}
            </Option>
          ))}
        </Select>
      );
    }
    return '';
  }

  renderFares = fare => ((fare && fare.path) ? (
    <div>
      {
        fare.path.map(f => (
          <Row style={{
            marginBottom: '10px'
          }}
          >
            <Col xs={24} md={24} lg={24}>
              <Card className="fare-card">
                <div className="fare-list-container">
                  <div className="from-to-fare">
                    <div className="from-to">
                      <p>{f.departure}</p>

                      <p><Icon type="right" /></p>

                      <p>{f.arrival}</p>
                    </div>
                    <div className="fare">
                      <p>
                        {f.finalCost}
                        {'€'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p>
                      <i>
                        {`${f.transport} 
                      ${f.reference} for 
                      ${f.duration.h} 
                      h 
                      ${f.duration.m}
                      m` }
                      </i>

                    </p>

                  </div>
                </div>

              </Card>
            </Col>
          </Row>
        ))
      }
      <Row style={{
        marginBottom: '10px'
      }}
      >
        <Col xs={24} md={24} lg={24}>
          <Card className="fare-card">
            <div className="fare-list-container">
              <div className="from-to-fare">
                <div className="fare-total">
                  <p>Total</p>

                  <p>
                    {fare.detailedTime.h}
                    {'h '}
                    {fare.detailedTime.m}
                    {'m'}
                  </p>

                  <p>
                    {fare.cost}
                    {'€'}
                  </p>
                </div>

              </div>
            </div>

          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24} md={24} lg={24}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            onClick={this.reset}

            style={
              {
                width: '100%'
              }
            }
          >
            Reset
          </Button>
        </Col>

      </Row>
    </div>
  ) : (
    <Row style={{
        marginBottom: '10px'
      }}
    >
      <Col xs={24} md={24} lg={24}>
        <Card className="fare-card">
          <div className="fare-list-container">
            <div className="from-to-fare">
              <div className="fare-total">
                <p>No deals found</p>
              </div>

            </div>
          </div>

        </Card>
      </Col>
    </Row>
    ));


  render() {
    const { destinations, fares } = this.props;
    const { isDisabled } = this.state;
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;

    return (
      <div>
        <Row type="flex" justify="space-between">
          <Col xs={23} md={6} lg={6} offset={1} className="form">
            <Row>
              <Col xs={24} md={12} lg={12}>
                {this.ditinationDropdown(destinations, this.handleFromChange, this.defaultState.from)}
              </Col>
              <Col xs={24} md={12} lg={12}>
                {this.ditinationDropdown(destinations.reverse(), this.handleToChange, this.defaultState.to)}
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <RadioGroup onChange={this.onChange} defaultValue="fast">
                  <RadioButton value="cheap">Cheapest</RadioButton>
                  <RadioButton value="fast">Fastest</RadioButton>

                </RadioGroup>
              </Col>

            </Row>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Button type="primary" htmlType="submit" onClick={this.handleSubmit} className="login-form-button" disabled={isDisabled}>
                  Search
                </Button>
              </Col>

            </Row>
          </Col>
          <Col xs={23} md={15} lg={15} offset={1} className="fare-card-container">
            {this.renderFares(fares)}
          </Col>

        </Row>

      </div>
    );
  }
}
