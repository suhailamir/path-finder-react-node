
import { connect } from 'react-redux';
import App from './App';


import {
 getDestinations,
    getFares 
} from './actions/appAction';

/* 
 * mapDispatchToProps
*/
const mapDispatchToProps = dispatch => ({
  getDestinations: () => dispatch(getDestinations()),
  getFares: data => dispatch(getFares(data)),

});

/* 
 * mapStateToProps
*/
const mapStateToProps = state => ({
  ...state.appReducer
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
