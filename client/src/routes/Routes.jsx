import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Layout } from "antd";
import Home from "../sections/home";
import Host from "../sections/host";
import Listing from "../sections/listing";
import Listings from "../sections/listings";
import User from "../sections/user";
import NotFound from "../sections/notfound";
import LogIn from "../sections/logIn";

const Routes = () => (
    <BrowserRouter>
        <Layout id="app">
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/host" component={Host} />
                <Route exact path="/listing/:id" component={Listing} />
                <Route exact path="/listing/:location?" component={Listings} />
                <Route exact path="/login" component={LogIn} />
                <Route exact path="/user/:id" component={User} />
                <Route component={NotFound} />
            </Switch>
        </Layout>
    </BrowserRouter>
);

export default Routes;
