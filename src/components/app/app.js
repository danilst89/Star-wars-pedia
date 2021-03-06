import React, {Component} from 'react';

import Header from '../header';
import RandomPlanet from '../random-planet';
import ErrorBoundry from '../error-boundry';
import SwapiService from '../../services/swapi-service';
import {PeoplePage, PlanetsPage, StarshipsPage, SecretPage, LoginPage} from '../pages';

import {SwapiServiceProvider} from '../swapi-service-context';

import './app.css';
import DummySwapiService from "../../services/dummy-swapi-service";



import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { StarshipDetails } from '../sw-components';

export default class App extends Component {

    state = {
        showRandomPlanet: true,
        swapiService: new SwapiService(),
        isLoggedIn: false
    };

    onLogin = () => {
        this.setState({
            isLoggedIn: true
        })
    }

    onServiceChange = () => {
        this.setState(({swapiService}) => {
            const Service = swapiService instanceof SwapiService ? DummySwapiService : SwapiService;
            return {
                swapiService: new Service()
            }
        });
    };

    render() {
        return (
            <ErrorBoundry>
                <SwapiServiceProvider value={this.state.swapiService}>
                    <Router>
                        <div className="stardb-app">
                            <Header onServiceChange={this.onServiceChange}/>

                            <RandomPlanet/>

                            <Switch>
                                <Route path='/people/:id?' component={PeoplePage}/>
                                <Route path='/planets' component={PlanetsPage}/>
                                <Route exact path='/starships' component={StarshipsPage}/>
                                <Route path='/starships/:id' render={({match, location, history}) => <StarshipDetails itemId={match.params.id}/>}/>

                                <Route exact path='/' render={() => <h2>Welcome to StarDB</h2>}/>

                                <Route 
                                    path='/login'
                                    render={() => (
                                        <LoginPage isLogged={this.state.isLoggedIn} onLogin={this.onLogin}/>
                                    )}
                                />

                                <Route 
                                    path='/secret'
                                    render={() => (
                                        <SecretPage isLogged={this.state.isLoggedIn}/>
                                    )}
                                />

                                <Route render={() => <h2>Page not found</h2>}/>
                            </Switch>
                        </div>
                    </Router>
                </SwapiServiceProvider>
            </ErrorBoundry>
        );
    }
}
